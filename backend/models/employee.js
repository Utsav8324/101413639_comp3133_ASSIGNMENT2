const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  position: String
});

module.exports = mongoose.model('Employee', employeeSchema);