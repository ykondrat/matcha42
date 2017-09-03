const Notification = require('../models/notification');

module.exports = (app) => {
	app.post('/notification-view', (req, res) => {
        Notification.findOne({ 'to': req.body.id }, (err, notification) => {
                if (err) {
                    throw err;
                }
                if (notification) {
                    notification.subject.push('Your profile was viewed');
 
                    notification.save(function (err) {
                        if (err)
                            throw err;
                        res.sendStatus(200);
                    });
                } else {
                    var newNotification = new Notification();
                    newNotification.from = req.body.from;
                    newNotification.to = req.body.id;
                    newNotification.subject = 'Your profile was viewed';

                    newNotification.save(function(err) {
                        if (err)
                           throw err;
                        res.sendStatus(200);
                    });
                }
        });
    });
    app.post('/notification-like', (req, res) => {
        Notification.findOne({ 'to': req.body.whom }, (err, notification) => {
                if (err) {
                    throw err;
                }
                if (notification) {
                    notification.subject.push('Some body like you');
 
                    notification.save(function (err) {
                        if (err)
                            throw err;
                        res.sendStatus(200);
                    });
                } else {
                    var newNotification = new Notification();
                    newNotification.from = req.body.who;
                    newNotification.to = req.body.whom;
                    newNotification.subject = 'Some body like you';
              
                    newNotification.save(function(err) {
                        if (err)
                           throw err;
                        res.sendStatus(200);
                    });
                }
        });
    });
    app.post('/notification-dislike', (req, res) => {
        Notification.findOne({ 'to': req.body.whom }, (err, notification) => {
            if (err) {
                throw err;
            }
            if (notification) {
                notification.subject.push('Some body dislike you');

                notification.save(function (err) {
                    if (err)
                        throw err;
                    res.sendStatus(200);
                });
            } else {
                var newNotification = new Notification();
                newNotification.from = req.body.who;
                newNotification.to = req.body.whom;
                newNotification.subject = 'Some body dislike you';
               
                newNotification.save(function(err) {
                    if (err)
                       throw err;
                    res.sendStatus(200);
                });
            }
        });
    });
    app.post('/get-notification', (req, res) => {
        Notification.findOne({'to': req.body.id}, (err, data) => {
            res.send(data);
        });
    });
    app.post('/get-notification-view', (req, res) => {
        Notification.findOne({'to': req.body.id}, (err, data) => {
            var sender = JSON.parse(JSON.stringify(data));
            data.subject = [];

            data.save(function(err) {
                if (err)
                   throw err;
                res.send(sender);
            });
        });
    });
};