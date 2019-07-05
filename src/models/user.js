import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    require: [true, 'email required'],
  },
  password: {
    type: String,
    require: [true, 'password required'],
    select: false,
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
  },
}, {
  timestamps: true,
});


export const User = mongoose.model('User', UserSchema);
