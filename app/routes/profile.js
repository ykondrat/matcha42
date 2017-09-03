const User = require('../models/user');

module.exports = (app) => {
	app.post('/get-user-profile', (req, res) => {
        User.findById(req.body.id, function (err, user){
            if (err) {
                throw err;
            }
            if (user) {
                res.send(user);
            }
        });
    });
    app.post('/user-info', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                var currentUser = getCurrentUser(user);
            
                if (!currentUser.birthDate && !currentUser.sexual && !currentUser.interests && !currentUser.biography) {
                    currentUser.fameRating += 20;
                }
                currentUser.gender = req.body.gender;
                currentUser.sexual = req.body.sexual;
                currentUser.birthDate = req.body.birthday;
                currentUser.interests = req.body.interests;
                currentUser.biography = req.body.about;
                if (req.body.lat) {
                    currentUser.latitude = req.body.lat;
                    currentUser.longitude = req.body.lng;
                    currentUser.city = req.body.city;
                    currentUser.country = req.body.country;
                }
                if (currentUser.avatar != 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png' || currentUser.avatar != '') {
                    currentUser.active = 1;
                }

                user.save(function(err, updatedUser){
                    if (err)
                        throw err;
                    if (updatedUser) {
                        res.sendStatus(200);      
                    }
                });
            } 
        });
    });
    app.post('/user-modify', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                var currentUser = getCurrentUser(user);

                currentUser.firstName = req.body.firstName;
                currentUser.lastName = req.body.lastName;
                
                if (req.body.password != '') {
                    var newUser = new User();
                    currentUser.password = newUser.generateHash(req.body.password);
                }
                if (req.body.email) {
                    currentUser.email = req.body.email;
                }

                user.save(function(err, updatedUser){
                    if (err)
                        throw err;
                    if (updatedUser) {
                        res.sendStatus(200);
                    }
                });
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