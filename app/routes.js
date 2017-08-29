var User            = require('./models/user');
var Location        = require('./models/location');
const fs            = require('fs');
const nodemailer    = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kondratyev.yevhen@gmail.com',
        pass: ''
    }
});

module.exports = (app, passport, uploads) => {
    // Main route of site
    app.get('/', (req, res) => {
        res.render('index', { title: 'matcha signup', message: req.flash('errorMessage') });
    });
    
    // Profile route
    app.get('/profile', isLoggedOn, (req, res) => {
        res.render('profile', { title: 'matcha profile', user: req.user });
    });
    
    // Search route
    app.post('/search/:id', isLoggedOn, (req, res) => {
        console.log(req.body);
        console.log(req.params.id);
        // User.find({}, (err, data) => {
        //     res.send(data);
        // });
    });

    // Logout from site
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    
    // Forgot password
    app.post('/forgot-password', (req, res) => {
        User.findOne({ 'local.email': req.body.email }, (err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                var length = 16;
                var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                var newPassword = "";
                
                for (var i = 0, n = charset.length; i < length; ++i) {
                    newPassword += charset.charAt(Math.floor(Math.random() * n));
                }
                var newUser = new User;
                user.local.password = newUser.generateHash(newPassword);

                var mailOptions = {
                    from: 'kondratyev.yevhen@gmail.com',
                    to: user.local.email,
                    subject: 'New Password in Matcha',
                    html: `
                            <div style="width: 100%;
                                    height: 100%;
                                    background: url(http://localhost:8000/images/matcha.jpg) 100% 100% no-repeat;
                                    background-size: cover">
                                <h1 style="margin: 0 10px 0 10px;
                                    padding: 7px;
                                    font-size: 6vmin;
                                    font-weight: bold;">Your new password to <span style="color: #70E97A;
                                    text-shadow: 2px 2px #000;">matcha</span></h1>
                                <h3 style="margin: 0 10px 0 10px;
                                    padding: 7px;
                                    font-size: 4vmin;">Password: ${newPassword}</h3>
                                <a href="http://localhost:8000" style="font-size: 4vmin;
                                    margin: 0 10px 0 10px;
                                    padding: 7px;
                                    background-color: #70E97A;
                                    color: white;
                                    font-weight: bold;
                                    border-radius: 4px; 
                                    text-decoration: none;  ">Go to matcha</a>
                                <p style="margin: 0 10px 0 10px;
                                    padding: 7px;
                                    font-size: 3vmin;">ykondrat &copy; 2017</p>
                            </div>`
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                user.save(function(err, updatedUser){
                    if (err)
                        throw err;
                    if (updatedUser) {
                        res.send({msg: 'Password was sent on your mail'});
                    }
                });
            } else {
                res.send({msg: 'No such email locally registered'});
            }
        });
    });

    // Sigin with passport.js
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));
    
    // Signup with passport.js
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
                        res.sendStatus(200);
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
                        res.sendStatus(200);
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

    // Modify user props
    app.post('/user-modify', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                if (user.local.email) {
                    user.local.firstName = req.body.firstName;
                    user.local.lastName = req.body.lastName;
                    user.local.email = req.body.email;

                    if (req.body.password != '') {
                        var newUser = new User;
                        user.local.password = newUser.generateHash(req.body.password);
                    }
                } else if (user.facebook.email) {
                    user.facebook.firstName = req.body.firstName;
                    user.facebook.lastName = req.body.lastName;
                } else {
                    user.google.firstName = req.body.firstName;
                    user.google.lastName = req.body.lastName;
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

    // Set User photo and avatar
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
                            if (user.local.avatar == 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png') {
                                user.local.fameRating += 10;
                            }
                            user.local.avatar = `http://localhost:8000${path}`;
                        } else {
                            if (!user.local.photos) {
                                user.local.fameRating += 10;
                            } else if (user.local.photos[photo.fieldname] == '' || !user.local.photos[photo.fieldname]) {
                                user.local.fameRating += 10;
                            }
                            
                            user.local.photos[photo.fieldname] = `http://localhost:8000${path}`;
                        }
                    });
                } else if (user.facebook.email) {
                    req.files.forEach((photo, index) => {
                        path = photo.path.substring(6);

                        if (photo.fieldname == 'avatar') {
                            user.facebook.avatar = `http://localhost:8000${path}`;
                        } else {
                            if (!user.facebook.photos) {
                                user.facebook.fameRating += 10;
                            } else if (user.facebook.photos[photo.fieldname] == '' || !user.facebook.photos[photo.fieldname]) {
                                user.facebook.fameRating += 10;
                            }

                            user.facebook.photos[photo.fieldname] = `http://localhost:8000${path}`;
                        }
                    });
                } else {
                    req.files.forEach((photo, index) => {
                        path = photo.path.substring(6);

                        if (photo.fieldname == 'avatar') {
                            user.google.avatar = `http://localhost:8000${path}`;
                        } else {
                            if (!user.google.photos) {
                                user.google.fameRating += 10;
                            } else if (user.google.photos[photo.fieldname] == '' || !user.google.photos[photo.fieldname]) {
                                user.google.fameRating += 10;
                            }

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
    });

    //Delete User photo
    app.post('/delete-photo', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                if (user.local.email) {
                    let photo = user.local.photos[req.body.photo].split('/'); 
                    photo = photo[photo.length - 1];
                    let path = __dirname + '/../public/uploads/' + photo;
                    user.local.photos[req.body.photo] = "";
                    user.local.fameRating -= 10;

                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path);
                    }   
                } else if (user.facebook.email) {
                    let photo = user.facebook.photos[req.body.photo].split('/'); 
                    photo = photo[photo.length - 1];
                    let path = __dirname + '/../public/uploads/' + photo;
                    user.facebook.photos[req.body.photo] = "";
                    user.facebook.fameRating -= 10;

                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path);
                    } 
                } else {
                    let photo = user.google.photos[req.body.photo].split('/'); 
                    photo = photo[photo.length - 1];
                    let path = __dirname + '/../public/uploads/' + photo;
                    user.google.photos[req.body.photo] = "";
                    user.google.fameRating -= 10;

                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path);
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

    //Set Avatar
    app.post('/set-avatar', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                if (user.local.email) {
                    let tmp = user.local.photos[req.body.photo];
                    user.local.photos[req.body.photo] = user.local.avatar;
                    user.local.avatar = tmp;
                } else if (user.facebook.email) {
                    let tmp = user.facebook.photos[req.body.photo];
                    user.facebook.photos[req.body.photo] = user.facebook.avatar;
                    user.facebook.avatar = tmp;
                } else {
                    let tmp = user.google.photos[req.body.photo];
                    user.google.photos[req.body.photo] = user.google.avatar;
                    user.google.avatar = tmp;
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