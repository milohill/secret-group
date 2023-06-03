const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  author: { type: Schema.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  title: { type: String, maxLength: 15, required: true },
  content: { type: String, maxLength: 40 },
});

module.exports = mongoose.model('Message', messageSchema);
