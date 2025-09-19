const mongoose = require('mongoose');
const AssignmentSchema = new mongoose.Schema({
  agent: {type: mongoose.Schema.Types.ObjectId, ref: 'Agent'},
  items: [{type: mongoose.Schema.Types.ObjectId, ref: 'ListItem'}],
  createdAt: {type:Date, default: Date.now}
});
module.exports = mongoose.model('Assignment', AssignmentSchema);
