import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Work = new mongoose.Schema({
  staff: { type: Schema.Types.ObjectId, ref: 'staff' },
  dateID: Number,
  datetime: Date,
  endDatetime: Date,
  workingHours: { type: Number, default: 0 },
});

Work.index({ staff: 1, dateID: 1 }, { unique: true });

const model = mongoose.model('work', Work);

export default model;
