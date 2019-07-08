import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose, { CastError, ValidationError } from 'mongoose';
import * as argon2 from 'argon2';
import { User } from '../models/user';
import { Message } from '../models/message';
import { Chat } from '../models/chat';
import ChatService from '../services/chat';

chai.use(chaiAsPromised);

let hashedPassword;
let creatorId;
let receiverId;
let invalidUserId;
let invalidChatId;
let chat;
let chatId;
let messageBody;
let message;

setup(async () => {
  await mongoose.connection.dropDatabase();

  const password = 'password';
  hashedPassword = await argon2.hash(password);

  const mockCreator = await User.create({
    email: 'creator@gmail.com',
    password: hashedPassword,
    profile: {
      firstName: 'Mock',
      lastName: 'Creator',
    },
  });
  creatorId = mockCreator._id;

  const mockReceiver = await User.create({
    email: 'receiver@gmail.com',
    password: hashedPassword,
    profile: {
      firstName: 'Mock',
      lastName: 'Receiver',
    },
  });
  receiverId = mockReceiver._id;

  messageBody = 'Message';

  const randomId = () => Math.floor(Math.random() * 100) + 1;

  invalidUserId = randomId();
  invalidChatId = randomId();
});

suite('Chat Service', () => {
  suite('positive tests', () => {
    test('#getAllUserChats()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      const foundChats = await ChatService.getAllUserChats(creatorId);
      const chats = await Chat.find({ users: creatorId })
        .exec();

      assert.equal(foundChats.length, chats.length, 'number of found user chats');
    });

    test('#getMessages()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      message = await Message.create({
        chatId,
        author: creatorId,
        body: messageBody,
      });

      const [foundMessages] = await ChatService.getMessages(chatId);

      assert.equal(foundMessages.body, message.body, 'message body');
      assert.deepEqual(foundMessages.createdAt, message.createdAt, 'message createdAt');
    });

    test('#createMessage()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      message = await ChatService.createMessage(chatId, creatorId, messageBody);

      assert.equal(message.chatId, chatId, 'message chat id');
      assert.equal(message.author, creatorId, 'message author');
      assert.equal(message.body, messageBody, 'message body');
    });

    test('#removeUserFromChat()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      await ChatService.removeUserFromChat(chatId, receiverId);

      const foundChat = await Chat.findOne({ _id: chatId })
        .exec();

      assert.equal(foundChat.users.length, 1, 'number of users in chat');
      assert.include(foundChat.users, creatorId, 'remained user');
      assert.notInclude(foundChat.users, receiverId, 'removed user');
    });

    test('#addUserToChat()', async () => {
      const mockUser = await User.create({
        email: 'user@gmail.com',
        password: hashedPassword,
        profile: {
          firstName: 'Mock',
          lastName: 'User',
        },
      });
      const userId = mockUser._id;

      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      await ChatService.addUserToChat(chatId, userId);

      const foundChat = await Chat.findOne({ _id: chatId })
        .exec();

      assert.equal(foundChat.users.length, 3, 'number of users in chat');
      assert.includeMembers(foundChat.users, [creatorId, receiverId, userId], 'users in chat');
    });

    test('#deleteChat()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      message = await Message.create({
        chatId,
        author: creatorId,
        body: messageBody,
      });

      const deleteObject = await ChatService.deleteChat(chatId);

      assert.equal(deleteObject.ok, 1, 'success delete');
      assert.equal(deleteObject.n, 1, 'number of deleted messages');
      assert.equal(deleteObject.deletedCount, 1, 'number of deleted messages');
    });

    test('#createChat()', async () => {
      chat = await ChatService.createChat(creatorId, receiverId, messageBody);
      chatId = chat._id;

      message = await Message.findOne({ chatId });

      assert.equal(chat.users.length, 2, 'number of users in chat');
      assert.deepEqual(chat.users, [creatorId, receiverId], 'users in chat');
      assert.deepEqual(message.chatId, chatId, 'message id in created chat');
      assert.equal(message.body, messageBody, 'message body in created chat');
    });
  });

  suite('negative tests', () => {
    test('#getAllUserChats()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });

      const foundChats = ChatService.getAllUserChats(invalidUserId);

      return expect(foundChats).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid user id')
        .and.be.an.instanceOf(Error);
    });

    test('#getMessages()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });

      const foundMessages = ChatService.getMessages(invalidChatId);

      return expect(foundMessages).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid chat id')
        .and.be.an.instanceOf(Error);
    });

    test('#createMessage() - invalid chat id', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });

      message = ChatService.createMessage(invalidChatId, creatorId, messageBody);

      return expect(message).to.eventually
        .be.rejectedWith(ValidationError, null, 'get ValidationError due invalid chat id')
        .and.be.an.instanceOf(Error);
    });

    test('#createMessage() - invalid user id', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      message = ChatService.createMessage(chatId, invalidUserId, messageBody);

      return expect(message).to.eventually
        .be.rejectedWith(ValidationError, null, 'get ValidationError due invalid creator id')
        .and.be.an.instanceOf(Error);
    });

    test('#createMessage() - empty message body', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      message = ChatService.createMessage(chatId, invalidUserId, '');

      return expect(message).to.eventually
        .be.rejectedWith(ValidationError, null, 'get ValidationError due empty message body')
        .and.be.an.instanceOf(Error);
    });

    test('#removeUserFromChat() - invalid chat id', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });

      const removeUserFromChat = ChatService.removeUserFromChat(invalidChatId, receiverId);

      return expect(removeUserFromChat).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid user id')
        .and.be.an.instanceOf(Error);
    });

    test('#removeUserFromChat() - invalid receiver id', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      const removeUserFromChat = ChatService.removeUserFromChat(chatId, invalidUserId);

      return expect(removeUserFromChat).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid receiver id')
        .and.be.an.instanceOf(Error);
    });

    test('#addUserToChat() - invalid chat id', async () => {
      const mockUser = await User.create({
        email: 'user@gmail.com',
        password: hashedPassword,
        profile: {
          firstName: 'Mock',
          lastName: 'User',
        },
      });
      const userId = mockUser._id;

      chat = await Chat.create({
        users: [creatorId, receiverId],
      });

      const addUserToChat = ChatService.addUserToChat(invalidChatId, userId);

      return expect(addUserToChat).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid chat id')
        .and.be.an.instanceOf(Error);
    });

    test('#addUserToChat() - invalid user id', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      const addUserToChat = ChatService.addUserToChat(chatId, invalidUserId);

      return expect(addUserToChat).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid user id')
        .and.be.an.instanceOf(Error);
    });

    test('#deleteChat()', async () => {
      chat = await Chat.create({
        users: [creatorId, receiverId],
      });
      chatId = chat._id;

      message = await Message.create({
        chatId,
        author: creatorId,
        body: messageBody,
      });

      const deleteObject = ChatService.deleteChat(invalidChatId);

      return expect(deleteObject).to.eventually
        .be.rejectedWith(CastError, null, 'get CastError due invalid chat id')
        .and.be.an.instanceOf(Error);
    });

    test('#createChat() - invalid creator id', async () => {
      chat = ChatService.createChat(invalidUserId, receiverId, messageBody);

      return expect(chat).to.eventually
        .be.rejectedWith(ValidationError, null, 'get ValidationError due invalid creator id')
        .and.be.an.instanceOf(Error);
    });

    test('#createChat() - invalid receiver id', async () => {
      chat = ChatService.createChat(creatorId, invalidUserId, messageBody);

      return expect(chat).to.eventually
        .be.rejectedWith(ValidationError, null, 'get ValidationError due invalid receiver id')
        .and.be.an.instanceOf(Error);
    });

    test('#createChat() - empty message body', async () => {
      chat = ChatService.createChat(creatorId, receiverId, '');

      return expect(chat).to.eventually
        .be.rejectedWith(ValidationError, null, 'get ValidationError due empty message body')
        .and.be.an.instanceOf(Error);
    });
  });
});
