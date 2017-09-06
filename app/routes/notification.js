const Notification = require('../models/notification');
const User         = require('../models/user');

module.exports = (app) => {
	app.post('/notification-view', (req, res) => {
        Notification.findOne({ 'to': req.body.id }, (err, notification) => {
            if (err) {
                throw err;
            }
            if (notification) {
                User.findById(req.body.from, (err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        user = getCurrentUser(user);
                        notification.subject.push('Your profile was viewed');
                        notification.view.push(`Your profile was viewed by ${user.firstName} ${user.lastName} <img src="${user.avatar}" class="not-avatar">`);

                        notification.save(function(err) {
                            if (err)
                               throw err;
                            res.sendStatus(200);
                        });        
                    }
                });
            } else {
                User.findById(req.body.from, (err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        user = getCurrentUser(user);
                        var newNotification = new Notification();
                        newNotification.from = req.body.from;
                        newNotification.to = req.body.id;
                        newNotification.subject = 'Your profile was viewed';
                        newNotification.view = `Your profile was viewed by ${user.firstName} ${user.lastName} <img src="${user.avatar}" class="not-avatar">`;

                        newNotification.save(function(err) {
                            if (err)
                               throw err;
                            res.sendStatus(200);
                        });        
                    }
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
function getCurrentUser(user){
    var currentUser;

    if (user.local.email) {
        currentUser = user.local;
    } else if (user.facebook.email) {
        currentUser = user.facebook;
    } else {
        currentUser = user.google;
    }
    return (currentUser);
}