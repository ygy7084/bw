import mongoose from 'mongoose';


const Movie = new mongoose.Schema({
  name: String,
  datetime: Date,
  theater: String,
  available: Number,
});

const model = mongoose.model('movie', Movie);

export default model;