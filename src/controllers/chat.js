import { validationResult } from 'express-validator';
import ChatService from '../services/chat';

async function getAllUserChats (req, res) {
  try {
    const allUserChats = await ChatService.getAllUserChats(req.currentUser._id);
    return res.status(200)
      .json({ chats: allUserChats });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function getChat (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { chatId } = req.params;

  try {
    const messages = await ChatService.getMessages(chatId);
    return res.status(200)
      .json({ messages });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function sendMessage (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { chatId } = req.params;
  const { messageBody } = req.body;

  try {
    await ChatService.createMessage(chatId, req.currentUser._id, messageBody);
    return res.status(200)
      .json({ message: 'Message sent.' });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function leaveChat (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { chatId } = req.params;

  try {
    await ChatService.removeUserFromChat(chatId, req.currentUser._id);
    return res.status(200)
      .json({ message: 'You leaved the chat.' });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function joinChat (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { chatId } = req.params;

  try {
    await ChatService.addUserToChat(chatId, req.currentUser._id);
    return res.status(200)
      .json({ message: 'You joined the chat.' });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function deleteChat (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { chatId } = req.params;

  try {
    const { deletedCount } = await ChatService.deleteChat(chatId);
    return res.status(200)
      .json({ message: `You delete the chat. Messages deleted: ${deletedCount}.` });
  } catch (e) {
    return res.status(500)
      .json({ error: e.message });
  }
}

async function createChat (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }

  const { receiverId } = req.params;
  const { messageBody } = req.body;

  if (!receiverId) {
    return res.status(422)
      .json({ error: 'Invalid receiver.' });
  }

  if (!messageBody) {
    return res.status(422)
      .json({ error: 'Empty message.' });
  }

  const chat = await ChatService.createChat(req.currentUser._id, receiverId, messageBody);
  return res.status(200)
    .json({ message: 'Chat is open.', chatId: chat._id });
}

export default {
  getAllUserChats,
  getChat,
  sendMessage,
  leaveChat,
  joinChat,
  deleteChat,
  createChat,
};
