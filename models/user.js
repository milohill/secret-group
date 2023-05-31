const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  'is-member': { type: Boolean, required: true },
});

module.exports = mongoose.model('user', userSchema);
