const mongoose  = require('mongoose');

const notificationSchema = mongoose.Schema({
    from: 			String,
    to: 			String,
    subject: 		[String],
    view: 			[String]
});

module.exports = mongoose.model('Notification', notificationSchema);