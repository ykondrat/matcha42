const mongoose  = require('mongoose');

const reportSchema = mongoose.Schema({
    user_id:  String
});

module.exports = mongoose.model('Report', reportSchema);