import mongoose from 'mongoose';

const Staff = new mongoose.Schema({
  sn: String,
  level: { type: String, default: '직원' },
  name: { type: String, default: '' },
  location: { type: String, default: '' },
  barcode_id: String,
});

Staff.index({ sn: 1 }, { unique: true });
Staff.index({ barcode_id: 1 }, { unique: true, sparse: true });

const model = mongoose.model('staff', Staff);

export default model;
