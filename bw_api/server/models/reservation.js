import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Reservation = new mongoose.Schema({
  movie: { type: Schema.Types.ObjectId, ref: 'movie' },
  customer: { type: Schema.Types.ObjectId, ref: 'customer' },
  staff: { type: Schema.Types.ObjectId, ref: 'staff' },
});

Reservation.index({ movie: 1, customer: 1 }, { unique: true });

const model = mongoose.model('reservation', Reservation);

export default model;
