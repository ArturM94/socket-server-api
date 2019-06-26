import mongoose, { Schema } from 'mongoose';


const MessageSchema = new Schema({
  chatTd: {
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

export const MessageModel = mongoose.model('MessageModel', MessageSchema);
