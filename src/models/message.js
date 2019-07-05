import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Message = mongoose.model('Message', MessageSchema);
