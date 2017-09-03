const User = require('../models/user');

module.exports = (app) => {
    app.post('/search/:id', (req, res) => {
        User.find({}, (err, data) => {
            data = data.filter(item => item._id != req.body.id);

            if (req.body.gender) {
                data = data.filter((item) => {
                    var currentUser = getCurrentUser(item);
                    if (currentUser.gender == req.body.gender) {
                        return (true);
                    }
                    return (false);
                });
            }
            if (req.body.sexual) {
                data = data.filter((item) => {
                    var currentUser = getCurrentUser(user);                
                    if (currentUser.sexual == req.body.sexual) {
                        return (true);
                    }
                    return (false);
                });
            }
            if (req.body.age) {
                data = data.filter((item) => {
                    var currentUser = getCurrentUser(item);

                    if (currentUser.birthDate) {
                        let today = new Date();
                        let birthDate = new Date(currentUser.birthDate);
                        let age = today.getFullYear() - birthDate.getFullYear();
                        let m = today.getMonth() - birthDate.getMonth();
                        let from = parseInt(req.body.age) - 2;
                        let to = parseInt(req.body.age) + 2;
                        
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }

                        if (age >= from && age <= to) {
                            return (true);
                        } else {
                            return (false);
                        }
                    } 
                    return (false);
                });
            }
            if (req.body.rating) {
                data = data.filter((user) => {
                    var currentUser = getCurrentUser(user);
                    let from = parseInt(req.body.rating) - 10; 
                    let to = parseInt(req.body.rating) + 10;
                    
                    if (currentUser.fameRating >= from && currentUser.fameRating <= to) {
                        return (true);
                    } else {
                        return (false);
                    }
                });
            }
            if (req.body.location) {
                data = data.filter((user) => {
                    var currentUser = getCurrentUser(user);

                    if (currentUser.city == req.body.location || currentUser.country == req.body.location) {
                       return (true);
                    } else {
                        return (false);
                    }
                });
            }
            if (req.body.tags) {
                var tags = req.body.tags.split(' ');

                data = data.filter((user) => {
                    var currentUser = getCurrentUser(user);
                    
                    if (currentUser.interests) {
                        var interests = currentUser.interests.split(' ');
                        var match = tags.length;

                        tags.forEach((item) => {
                            if (interests.includes(item)) {
                                match--;
                            }
                        })
                        if (match == 0) {
                            return (true);
                        } else {
                            return (false);
                        }
                    } else {
                        return (false);
                    }
                });
            }

            User.findById(req.body.id, (err, user) => {
                if (err) {
                    throw err;
                }
                if (user) {
                    var currentUser = getCurrentUser(user);
                    
                    currentUser.blockedUser.forEach((itemId) => {
                        data = data.filter(item => item._id != itemId);
                    });

                    var sendData = data.slice(req.params.id, req.params.id + 6);
                    res.send(sendData);
                }
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