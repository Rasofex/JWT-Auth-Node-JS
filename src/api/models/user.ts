import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    githubLink: {
      type: String,
      default: '',
    },
    twitterLink: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
