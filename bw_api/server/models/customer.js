import mongoose from 'mongoose';

const Customer = new mongoose.Schema({
  name: String,
  phone: String,
  barcode_id: String,
  bus: Number,
  enteringBus: Number,
  outgoingBus: Number,
  state: { type: String, default: '미교부' },
});

Customer.index({ phone: 1 }, { unique: true, sparse: true });
Customer.index({ barcode_id: 1 }, { unique: true, sparse: true });

const model = mongoose.model('customer', Customer);

export default model;
