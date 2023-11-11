import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: String,
});

export const Token = mongoose.model('Refresh-Token', tokenSchema);
