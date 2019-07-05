import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

export const Chat = mongoose.model('Chat', ChatSchema);
