const User 			= require('../models/user');
const Connection 	= require('../models/connection');
const Notification  = require('../models/notification');

module.exports = (app) => {
	app.post('/messages', (req, res) => {
		var sender;
		Connection.find({ 'first': req.body.id }, (err, data) => {
			if (err) {
				throw err;
			}
			if (data) {
				sender = [...data];
				Connection.find({ 'second': req.body.id }, (err, data) => {
					if (err) {
						throw err;
					}
					if (data) {
						sender = sender.concat(data);
						res.send(sender);
					}
				});
			} else {
				Connection.find({ 'second': req.body.id }, (err, data) => {
					if (err) {
						throw err;
					}
					if (data) {
						sender = [...data];
						res.send(sender);
					}
				});
			}
		});
	});
	app.post('/set-message', (req, res) => {
		Connection.findOne({ 'first': req.body.sender, 'second': req.body.to }, (err, con) => {
			if (err) {
				throw err;
			}
			if (con) {
				con.messages.push(req.body.message);

				con.save(function (err, updatedCon) {
                    if (err)
                        throw err;
                    if (updatedCon) {
                    	Notification.findOne({ 'to': req.body.to}, (err, not) => {
                            if (err) {
                                throw err;
                            }
                            if (not) {
                                not.subject.push('You have a new message');

                                not.save(function(err) {
                                    if (err)
                                       throw err;
                                });
                            } else {
                                var newNotification = new Notification();
                                newNotification.from = req.body.sender;
                                newNotification.to = req.body.to;
                                newNotification.subject = 'You have a new message';
                                 
                                newNotification.save(function(err) {
                                    if (err)
                                       throw err;
                                });
                            }
                        });
                        res.sendStatus(200);
                    }
                });
			} else {
				Connection.findOne({ 'first': req.body.to, 'second': req.body.sender }, (err, con) => {
					if (err) {
						throw err;
					}
					if (con) {
						con.messages.push(req.body.message);

						con.save(function (err, updatedCon) {
		                    if (err)
		                        throw err;
		                    if (updatedCon) {
		                    	Notification.findOne({ 'to': req.body.to}, (err, not) => {
		                            if (err) {
		                                throw err;
		                            }
		                            if (not) {
		                                not.subject.push('You have a new message');

		                                not.save(function(err) {
		                                    if (err)
		                                       throw err;
		                                });
		                            } else {
		                                var newNotification = new Notification();
		                                newNotification.from = req.body.sender;
		                                newNotification.to = req.body.to;
		                                newNotification.subject = 'You have a new message';
		                                 
		                                newNotification.save(function(err) {
		                                    if (err)
		                                       throw err;
		                                });
		                            }
		                        });
		                        res.sendStatus(200);
		                    }
		                });
					}
				});		
			}
		});
	});
};