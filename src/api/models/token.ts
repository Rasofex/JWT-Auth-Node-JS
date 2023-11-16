import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Token = mongoose.model('Refresh-Token', tokenSchema);
