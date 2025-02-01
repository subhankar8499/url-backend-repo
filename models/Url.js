const mongoose = require('mongoose');
const shortid = require('shortid');

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, default: shortid.generate },
  remarks: String,
  expiresAt: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clicks: [clickSchema]
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);