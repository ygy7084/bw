import mongoose from 'mongoose';

const History = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  staffSn: String,
  staffName: String,
  barcode_id: String,
  bus: Number,
  enteringBus: { type: Number, default: -1 },
  outgoingBus: { type: Number, default: -1 },
  state: String,
  datetime: Date,
});

History.index({ datetime: 1 });

const model = mongoose.model('history', History);

export default model;
