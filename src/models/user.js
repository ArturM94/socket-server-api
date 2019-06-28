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

UserSchema.virtual('fullName', () => `${this.profile.firstName} ${this.profile.lastName}`);

export const UserModel = mongoose.model('UserModel', UserSchema);
