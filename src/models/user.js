import mongoose, { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

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

// eslint-disable-next-line consistent-return
UserSchema.pre('save', (next) => {
  const user = this;
  const SALT_ROUNDS = 5;

  if (!user.isModified('password')) {
    return next();
  }

  // eslint-disable-next-line consistent-return
  bcrypt.genSalt(SALT_ROUNDS, (error, salt) => {
    if (error) {
      return next(error);
    }

    // eslint-disable-next-line consistent-return
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = (inputPassword, callback) => {
  // eslint-disable-next-line consistent-return
  bcrypt.compare(inputPassword, this.password, (error, isMatch) => {
    if (error) {
      return callback(error);
    }

    callback(null, isMatch);
  });
};

export const UserModel = mongoose.model('UserModel', UserSchema);
