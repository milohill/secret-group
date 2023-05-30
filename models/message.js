const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  title: { type: String, maxLength: 15, required: true },
  date: { type: String, required: true },
  content: { type: String, maxLength: 40 },
});

module.exports = mongoose.model('message', messageSchema);
