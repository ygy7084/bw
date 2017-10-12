import mongoose from 'mongoose';

const Theater = new mongoose.Schema({
  code: String,
  name: String,
});

Theater.index({ code: 1 }, { unique: true });

const model = mongoose.model('theater', Theater);

export default model;