import mongoose from 'mongoose';

const Bus = new mongoose.Schema({
  number: Number,
  datetime: Date,
});

Bus.index({ number: 1 }, { unique: true });

const model = mongoose.model('bus', Bus);

export default model;
