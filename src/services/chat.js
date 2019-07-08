import { Chat } from '../models/chat';
import { Message } from '../models/message';

/**
 * Gets all user chats.
 *
 * @param userId {string} Current user id
 * @returns {Promise<Array>} Array of user chats with last message
 */
async function getAllUserChats (userId) {
  const allUserChats = [];
  const chats = await Chat.find({ users: userId })
    .select('_id')
    .exec();

  const promises = chats.map(async (chat) => {
    const message = await Message.find({ chatId: chat._id })
      .sort('-createdAt')
      .limit(1)
      .populate({
        path: 'author',
        select: 'profile.firstName profile.lastName',
      })
      .exec();
    await allUserChats.push(message);
  });
  await Promise.all(promises);

  return allUserChats;
}

/**
 * Gets messages for chat.
 *
 * @param chatId {string} Chat id
 * @returns {Promise<any>} Messages
 */
async function getMessages (chatId) {
  return Message.find({ chatId })
    .select('author body createdAt')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'profile.firstName profile.lastName',
    })
    .exec();
}

/**
 * Creates message.
 *
 * @param chatId {string} Chat id
 * @param userId {string} Current user id
 * @param messageBody {string} Sender message body
 * @returns {Promise<Promise<this> | void>} New message document
 */
async function createMessage (chatId, userId, messageBody) {
  const message = new Message({
    chatId,
    author: userId,
    body: messageBody,
  });
  return message.save();
}

/**
 * Removes user from chat.
 *
 * @param chatId {string} Chat id
 * @param userId {string} Current user id
 */
async function removeUserFromChat (chatId, userId) {
  await Chat.findOneAndUpdate({ _id: chatId }, { $pull: { users: `${userId}` } })
    .exec();
}

/**
 * Adds user to chat.
 *
 * @param chatId {string} Chat id
 * @param userId {string} Current user id
 */
async function addUserToChat (chatId, userId) {
  await Chat.findOneAndUpdate({ _id: chatId }, { $push: { users: userId } })
    .exec();
}

/**
 * Deletes chat with related messages.
 *
 * @param chatId {string} Chat id
 * @returns {Promise<{ok?: number, n?: number, deletedCount?: number}>}
 */
async function deleteChat (chatId) {
  const countDeletedMessages = await Message.deleteMany({ chatId })
    .exec();

  await Chat.findByIdAndDelete(chatId)
    .exec();

  return countDeletedMessages;
}

/**
 * Creates chat.
 *
 * @param creatorId {string} Current user id
 * @param receiverId {string} Receiver id
 * @param messageBody {string} Sender message body
 * @returns {Promise<this>} New chat document
 */
async function createChat (creatorId, receiverId, messageBody) {
  const chat = new Chat({
    users: [creatorId, receiverId],
  });
  const newChat = await chat.save();

  await createMessage(newChat._id, creatorId, messageBody);

  return newChat;
}

export default {
  getAllUserChats,
  getMessages,
  createMessage,
  removeUserFromChat,
  addUserToChat,
  deleteChat,
  createChat,
};
