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
    app.get('/get-users', isLoggedOn, (req, res) => {
        User.find({}, (err, data) => {
            if (err) {
                throw err;
            }
            if (data) {
                res.send(data);
            }
        })
    });
    app.post('/get-matcha', (req, res) => {
        User.find({}, (err, data) => {
            data = data.filter(item => item._id != req.body.id);

            if (req.body.sexual == 'heterosexual') {
                data = data.filter((item) => {
                    var currentUser = getCurrentUser(item);
                    if ((currentUser.gender != req.body.gender) && (currentUser.sexual == 'heterosexual' || currentUser.sexual == 'bisexual')) {
                        return (true);
                    }
                    return (false);
                });
            } else if (req.body.sexual == 'homosexual') {
                data = data.filter((item) => {
                    var currentUser = getCurrentUser(item);
                    if ((currentUser.gender == req.body.gender) && (currentUser.sexual == 'homosexual')) {
                        return (true);
                    }
                    return (false);
                });
            } else {
                data = data.filter((item) => {
                    var currentUser = getCurrentUser(item);
                    if (currentUser.sexual == req.body.sexual) {
                        return (true);
                    }
                    return (false);
                });
            }
            data = data.filter((item) => {
                var currentUser = getCurrentUser(item);
                let from = parseInt(req.body.rating) - 50;
                let to = parseInt(req.body.rating) + 50;
                if (parseInt(currentUser.fameRating) >= from &&  parseInt(currentUser.fameRating) <= to) {
                    return (true);
                }
                return (false);
            });

            var today = new Date();
            var birthDateUser = new Date(req.body.birthDate);
            var ageUser = today.getFullYear() - birthDateUser.getFullYear();
            var mUser = today.getMonth() - birthDateUser.getMonth();
            
            if (mUser < 0 || (mUser === 0 && today.getDate() < birthDateUser.getDate())) {
                ageUser--;
            }

            data = data.filter((item) => {
                var currentUser = getCurrentUser(item);
                let birthDate = new Date(currentUser.birthDate);
                let age = today.getFullYear() - birthDate.getFullYear();
                let m = today.getMonth() - birthDate.getMonth();
                
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age >= ageUser - 4 && age <= ageUser + 4) {
                    return (true);
                } 
                return (false);
            });

            let interests = req.body.interests.split(' ');
            
            data.sort((userA, userB) => {
                userA = getCurrentUser(userA);
                userB = getCurrentUser(userB);
                let interestA = userA.interests.split(' ');
                let interestB = userB.interests.split(' ');
                let counterA = 0;
                let counterB = 0;

                interestA.forEach((item) => {
                    if (interests.includes(item)) {
                        counterA++;
                    }
                });
                interestB.forEach((item) => {
                    if (interests.includes(item)) {
                        counterB++;
                    }
                });
                if (counterA < counterB) {
                    return (true);
                }
                return (false);
            });

            data.sort((userA, userB) => {
                userA = getCurrentUser(userA);
                userA = getCurrentUser(userB);
                let currentLat = parseFloat(req.body.lat);
                let currentLng = parseFloat(req.body.lng);
                let radius = 6378137;

                var deltaLat1 = parseFloat(currentLat) - parseFloat(userA.latitude);
                var deltaLon1 = parseFloat(currentLng) - parseFloat(userA.longitude);
                var angle1 = 2 * Math.asin( Math.sqrt( Math.pow( Math.sin( deltaLat1 / 2), 2) + Math.cos(currentLat) * Math.cos(parseFloat(userA.latitude)) * Math.pow( Math.sin ( deltaLon1 / 2), 2) ) );
                var distance1 = radius * angle1;

                var deltaLat2 = parseFloat(currentLat) - parseFloat(userB.latitude);
                var deltaLon2 = parseFloat(currentLng) - parseFloat(userB.longitude);
                var angle2 = 2 * Math.asin( Math.sqrt( Math.pow( Math.sin( deltaLat2 / 2), 2) + Math.cos(currentLat) * Math.cos(parseFloat(userB.latitude)) * Math.pow( Math.sin ( deltaLon2 / 2), 2) ) );
                var distance2 = radius * angle2;

                if (distance1 < distance2) {
                    return (true);
                }
                return (false);
            });

            User.findById(req.body.id, (err, user) => {
                if (err) {
                    throw err;
                }
                if (user) {
                    var currentUser = getCurrentUser(user);
                    
                    currentUser.blockedUser.forEach((itemId) => {
                        data = data.filter(item => item._id != itemId);
                    });

                    var sendData = data.slice(0, 6);
                    res.send(sendData);
                }
            });
        });
    });
    app.post('/get-userId', (req, res) => {
        User.findById(req.body.id, (err, user) => {
            if (err)
                throw err;
            if (user)
                res.send(user);
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
function isLoggedOn(req, res, next) {
    if (req.isAuthenticated()) {
        return (next());
    }
    res.redirect('/');
}