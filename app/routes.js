var User = require('./models/user');
var Location = require('./models/location');

module.exports = (app, passport, uploads) => {
    // Main route of site
    app.get('/', (req, res) => {
        res.render('index', { title: 'matcha signup', message: req.flash('errorMessage') });
    });
    
    //Profile route
    app.get('/profile', isLoggedOn, (req, res) => {
        res.render('profile', { title: 'matcha profile', user: JSON.stringify(req.user) });
    });
    
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));
    
    // Facebook routes
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/'  }), (req, res) => {
        User.findById(req.user._id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                Location.findOne({ 'sessionId': req.sessionID }, (err, location) => {
                    if (err) {
                        throw err;
                    }
                    if (location) {
                        user.facebook.country = location.country; 
                        user.facebook.city = location.city;
                        user.facebook.latitude = location.latitude;
                        user.facebook.longitude = location.longitude;

                        user.save(function(err, updatedUser){
                            if (err)
                                throw err;
                            if (updatedUser) {
                                req.user = updatedUser;
                                res.redirect('/profile');            
                            }
                        });
                    }
                });
            } 
        });    
        
        
    });

    // Google+ routes
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        User.findById(req.user._id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                Location.findOne({ 'sessionId': req.sessionID }, (err, location) => {
                    if (err) {
                        throw err;
                    }
                    if (location) {
                        user.google.country = location.country; 
                        user.google.city = location.city;
                        user.google.latitude = location.latitude;
                        user.google.longitude = location.longitude;

                        user.save(function(err, updatedUser){
                            if (err)
                                throw err;
                            if (updatedUser) {
                                req.user = updatedUser;
                                res.redirect('/profile');            
                            }
                        });
                    }
                });
            } 
        });
    });
    
    // Set geolocation of user
    app.post('/geolocation', (req, res) => {
        process.nextTick(() => { 
            Location.findOne({ 'sessionId': req.sessionID }, (err, location) => {
                if (err) {
                    throw err;
                }
                if (location) {
                    location.country = req.body.country;
                    location.city = req.body.city;
                    location.latitude = req.body.latitude;
                    location.longitude = req.body.longitude;

                    location.save(function (err) {
                        if (err)
                            throw err;
                    });
                } else {
                    var newLocation = new Location();
                    newLocation.sessionId = req.sessionID;
                    newLocation.country = req.body.country;
                    newLocation.city = req.body.city;
                    newLocation.latitude = req.body.latitude;
                    newLocation.longitude = req.body.longitude;
                     
                    newLocation.save(function(err) {
                        if (err)
                           throw err;
                    });
                }
            });
        });
    });

    // Set main user info
    app.post('/user-info', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                if (user.local.email) {
                    if (!user.local.birthDate) {
                        user.local.fameRating += 20;
                    }
                    user.local.gender = req.body.gender;
                    user.local.sexual = req.body.sexual;
                    user.local.birthDate = req.body.birthday;
                    user.local.interests = req.body.interests;
                    user.local.biography = req.body.about;

                    if (user.local.avatar != 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png') {
                        user.local.active = 1;
                    }
                } else if (user.facebook.email) {
                    if (!user.facebook.birthDate) {
                        user.facebook.fameRating += 20;
                    }
                    user.facebook.gender = req.body.gender;
                    user.facebook.sexual = req.body.sexual;
                    user.facebook.birthDate = req.body.birthday;
                    user.facebook.interests = req.body.interests;
                    user.facebook.biography = req.body.about;
                    
                    if (user.facebook.avatar != '') {
                        user.facebook.active = 1;
                    }
                } else {
                    if (!user.google.birthDate) {
                        user.google.fameRating += 20;
                    }
                    user.google.gender = req.body.gender;
                    user.google.sexual = req.body.sexual;
                    user.google.birthDate = req.body.birthday;
                    user.google.interests = req.body.interests;
                    user.google.biography = req.body.about;
                    
                    if (user.google.avatar != '') {
                        user.google.active = 1;
                    }
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

    // Set Use photo and avatar
    app.post('/photo', uploads.any(), (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {


                if (user.local.email) {
                    req.files.forEach((photo, index) => {
                        path = photo.path.substring(6);
                        
                        if (photo.fieldname == 'avatar') {
                            user.local.avatar = `http://localhost:8000${path}`;
                        } else {
                            user.local.photos[photo.fieldname] = `http://localhost:8000${path}`;
                        }
                    });
                } else if (user.facebook.email) {
                    req.files.forEach((photo, index) => {
                        path = photo.path.substring(6);

                        if (photo.fieldname == 'avatar') {
                            user.facebook.avatar = `http://localhost:8000${path}`;
                        } else {
                            user.facebook.photos[photo.fieldname] = `http://localhost:8000${path}`;
                        }
                    });
                } else {
                    req.files.forEach((photo, index) => {
                        path = photo.path.substring(6);

                        if (photo.fieldname == 'avatar') {
                            user.google.avatar = `http://localhost:8000${path}`;
                        } else {
                            user.google.photos[photo.fieldname] = `http://localhost:8000${path}`;
                        }
                    });
                }

                user.save(function(err, updatedUser){
                    if (err)
                        throw err;
                    if (updatedUser) {
                        res.redirect('/profile');
                    }
                });
            }
        });
        console.log(req.files);
        console.log(req.body.id);
    });
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.render('error');
    });
};

function isLoggedOn(req, res, next) {
    if (req.isAuthenticated()) {
        return (next());
    }
    res.redirect('/');
}