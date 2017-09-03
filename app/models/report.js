const mongoose  = require('mongoose');

const reportSchema = mongoose.Schema({
	report_from: String,
    user_id:  String
});

module.exports = mongoose.model('Report', reportSchema);