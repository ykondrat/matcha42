const User            = require('../models/user');
const Notification    = require('../models/notification');
const Connection      = require('../models/connection');

module.exports = (app) => {
    app.post('/set-likes', (req, res) => {
        User.findById(req.body.who, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                var saver = false;
                var currentUser = getCurrentUser(user);

                if (currentUser.dislikedUser.includes(req.body.whom)) {
                    var index = currentUser.dislikedUser.indexOf(req.body.whom);
                    if (index > -1) {
                        currentUser.dislikedUser.splice(index, 1);
                    }
                }
                if (!currentUser.likedUser.includes(req.body.whom)) {
                    currentUser.likedUser.push(req.body.whom);
                    saver = true;
                }
                
                if (currentUser.avatar == '' || currentUser.avatar == 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png') {
                    saver = false;
                } 

                if (saver) {
                    user.save(function(err, updatedUser){
                        if (err)
                            throw err;
                        if (updatedUser) {
                            User.findById(req.body.whom, function(err, user) {
                                if (err) {
                                    throw err;
                                }
                                if (user) {
                                    currentUser = getCurrentUser(user);
                                    
                                    currentUser.fameRating += 10;
                                    if (currentUser.likedUser.includes(req.body.who)) {
                                        var newConnection = new Connection();
                                        newConnection.first = req.body.who;
                                        newConnection.second = req.body.whom;

                                        newConnection.save(function(err, connect) {
                                            if (err)
                                               throw err;
                                            if (connect) {

                                            }
                                        });
                                    }                               
                                }

                                user.save(function (err, updatedUser) {
                                    if (err)
                                        throw err;
                                    if (updatedUser) {
                                        res.send({ msg: 'SET' });
                                    }
                                });
                            });
                        }
                    });
                } else {
                    res.sendStatus(200);
                }      
            }
        });
    });
    app.post('/set-dislike', (req, res) => {
        User.findById(req.body.who, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                var saver = false;
                var currentUser = getCurrentUser(user);

                if (currentUser.likedUser.includes(req.body.whom)) {
                    var index = currentUser.likedUser.indexOf(req.body.whom);
                    if (index > -1) {
                        currentUser.likedUser.splice(index, 1);
                    }
                }
                if (!currentUser.dislikedUser.includes(req.body.whom)) {
                    currentUser.dislikedUser.push(req.body.whom);
                    saver = true;
                }
                
                if (currentUser.avatar == '' || currentUser.avatar == 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png') {
                    saver = false;
                } 

                if (saver) {
                    Connection.findOne({ 'first': req.body.who, 'second': req.body.whom }, (err, con) => {
                        if (err) {
                            throw err;
                        }
                        if (con) {
                            Connection.findByIdAndRemove(con._id, (err, con) => {  
                                if (err) {
                                    throw err;
                                }
                            });
                        }
                        if (!con) {
                            Connection.findOne({ 'first': req.body.whom, 'second': req.body.who }, (err, con) => {
                                if (err) {
                                    throw err;
                                }
                                if (con) {
                                    Connection.findByIdAndRemove(con._id, (err, con) => {  
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                }
                            });
                        }
                    });
                    user.save(function(err, updatedUser){
                        if (err)
                            throw err;
                        if (updatedUser) {
                            User.findById(req.body.whom, function(err, user) {
                                if (err) {
                                    throw err;
                                }
                                if (user) {
                                    currentUser = getCurrentUser(user);
                                    
                                    currentUser.fameRating -= 5;                                
                                }

                                user.save(function (err, updatedUser) {
                                    if (err)
                                        throw err;
                                    if (updatedUser) {
                                        res.send({ msg: 'SET' });
                                    }
                                });
                            });
                        }
                    });
                } else {
                    res.sendStatus(200);
                }      
            }
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