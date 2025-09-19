const mongoose = require('mongoose');
const ListItemSchema = new mongoose.Schema({
  firstName: String,
  phone: String,
  notes: String,
  uploadedAt: {type:Date, default:Date.now}
});
module.exports = mongoose.model('ListItem', ListItemSchema);
