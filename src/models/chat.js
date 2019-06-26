import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

export const ChatModel = mongoose.model('ChatModel', ChatSchema);
