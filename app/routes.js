var User            = require('./models/user');
var Location        = require('./models/location');
var Notification    = require('./models/notification');
var Report          = require('./models/report');
var Connection      = require('./models/connection');
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
        User.find({}, (err, data) => {
            data = data.filter(item => item._id != req.body.id);

            if (req.body.gender) {
                data = data.filter((item) => {
                    if (item.local.gender) {
                        if (item.local.gender == req.body.gender) {
                            return (true);
                        }
                    } else if (item.facebook.gender == req.body.gender) {
                        return (true);
                    } else if (item.google.gender == req.body.gender) {
                        return (true);
                    }
                    return (false);
                });
            }
            if (req.body.sexual) {
                data = data.filter((item) => {
                    if (item.local.sexual) {
                        if (item.local.sexual == req.body.sexual) {
                            return (true);
                        }
                    } else if (item.facebook.sexual) {
                        if (item.facebook.sexual == req.body.sexual) {
                            return (true);
                        }
                    } else if (item.google.sexual) {
                        if (item.google.sexual == req.body.sexual) {
                            return (true);
                        }
                    } 
                    return (false);    
                });
            }
            if (req.body.age) {
                data = data.filter((item) => {
                    if (item.local.birthDate) {
                        var today = new Date();
                        var birthDate = new Date(item.local.birthDate);
                        var age = today.getFullYear() - birthDate.getFullYear();
                        var m = today.getMonth() - birthDate.getMonth();
                        
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        if (age == parseInt(req.body.age)) {
                            return (true);
                        } else {
                            return (false);
                        }
                    } else if (item.facebook.birthDate) {
                        var today = new Date();
                        var birthDate = new Date(item.facebook.birthDate);
                        var age = today.getFullYear() - birthDate.getFullYear();
                        var m = today.getMonth() - birthDate.getMonth();
                        
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        if (age == parseInt(req.body.age)) {
                            return (true);
                        } else {
                            return (false);
                        }
                    } else if (item.google.birthDate) {
                        var today = new Date();
                        var birthDate = new Date(item.google.birthDate);
                        var age = today.getFullYear() - birthDate.getFullYear();
                        var m = today.getMonth() - birthDate.getMonth();
                        
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        if (age == parseInt(req.body.age)) {
                            return (true);
                        } else {
                            return (false);
                        }
                    }
                    return (false);
                });
            }

            if (user.local.email) {
                user.local.blockedUser.forEach((userID) => {
                    data = data.filter(item => item._id != userID);                
                });
            } else if (user.facebook.email) {
                user.facebook.blockedUser.forEach((userID) => {
                    data = data.filter(item => item._id != userID);                
                });
            } else {
                user.google.blockedUser.forEach((userID) => {
                    data = data.filter(item => item._id != userID);                
                });
            }


            var sendData = data.slice(req.params.id, req.params.id + 5);
            res.send(sendData);
        });
    });

    app.post('/get-user-profile', isLoggedOn, (req, res) => {
        User.findById(req.body.id, function (err, user){
            if (err) {
                throw err;
            }
            if (user) {
                res.send(user);
            }
        });
    });

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

    app.post('/block-user', (req, res) => {
        User.findById(req.body.who, (err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                if (user.local.email) {
                    if (!user.local.blockedUser.includes(req.body.whom))
                        user.local.blockedUser.push();
                } else if (user.facebook.email) {
                    if (!user.facebook.blockedUser.includes(req.body.whom))
                        user.facebook.blockedUser.push();
                } else {
                    if (!user.google.blockedUser.includes(req.body.whom))
                        user.google.blockedUser.push();
                }

                user.save((err, updatedUser) => {
                    if (err) {
                        throw err;
                    }
                    if (updatedUser) {
                        res.sendStatus(200);
                    }
                });
            }
        });
    });

    app.post('/report-user', (req, res) => {
        User.findById(req.body.who, (err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                if (user.local.email) {
                    if (!user.local.blockedUser.includes(req.body.whom))
                        user.local.blockedUser.push();
                } else if (user.facebook.email) {
                    if (!user.facebook.blockedUser.includes(req.body.whom))
                        user.facebook.blockedUser.push();
                } else {
                    if (!user.google.blockedUser.includes(req.body.whom))
                        user.google.blockedUser.push();
                }

                user.save((err, updatedUser) => {
                    if (err) {
                        throw err;
                    }
                    if (updatedUser) {
                        var newReport = new Report();
                        newReport.user_id = req.body.whom;
                         
                        newReport.save(function(err) {
                            if (err)
                               throw err;
                            res.sendStatus(200);
                        });
                    }
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
                    if (!user.local.birthDate && !user.local.biography && !user.local.interests && !user.local.sexual) {
                        user.local.fameRating += 20;
                    }
                    user.local.gender = req.body.gender;
                    user.local.sexual = req.body.sexual;
                    user.local.birthDate = req.body.birthday;
                    user.local.interests = req.body.interests;
                    user.local.biography = req.body.about;
                    if (req.body.lat) {
                        user.local.latitude = req.body.lat;
                        user.local.longitude = req.body.lng;
                        user.local.city = req.body.city;
                        user.local.country = req.body.country;
                    }
                    if (user.local.avatar != 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png') {
                        user.local.active = 1;
                    }
                } else if (user.facebook.email) {
                    if (!user.facebook.birthDate && !user.facebook.biography && !user.facebook.interests && !user.facebook.sexual) {
                        user.facebook.fameRating += 20;
                    }
                    user.facebook.gender = req.body.gender;
                    user.facebook.sexual = req.body.sexual;
                    user.facebook.birthDate = req.body.birthday;
                    user.facebook.interests = req.body.interests;
                    user.facebook.biography = req.body.about;
                    if (req.body.lat) {
                        user.facebook.latitude = req.body.lat;
                        user.facebook.longitude = req.body.lng;
                        user.facebook.city = req.body.city;
                        user.facebook.country = req.body.country;    
                    }
                    
                    if (user.facebook.avatar != '') {
                        user.facebook.active = 1;
                    }
                } else {
                    if (!user.google.birthDate && !user.google.biography && !user.google.interests && !user.google.sexual) {
                        user.google.fameRating += 20;
                    }
                    user.google.gender = req.body.gender;
                    user.google.sexual = req.body.sexual;
                    user.google.birthDate = req.body.birthday;
                    user.google.interests = req.body.interests;
                    user.google.biography = req.body.about;
                    user.google.latitude = req.body.lat;
                    user.google.longitude = req.body.lng;
                    user.google.city = req.body.city;
                    user.google.country = req.body.country;
                    
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
                                if (user.local.gender && user.local.sexual && user.local.birthDate) {
                                    user.local.active = 1;
                                }
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

    // Set likes and connection
    app.post('/set-likes', (req, res) => {
        User.findById(req.body.who, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                var saver = false;

                if (user.local.email) {
                    if (user.local.dislikedUser.includes(req.body.whom)) {
                        var index = user.local.dislikedUser.indexOf(req.body.whom);
                        if (index > -1) {
                            user.local.dislikedUser.splice(index, 1);
                        }
                    }
                    if (!user.local.likedUser.includes(req.body.whom)) {
                        user.local.likedUser.push(req.body.whom);
                        saver = true;
                    }
                } else if (user.facebook.email) {
                    if (user.facebook.dislikedUser.includes(req.body.whom)) {
                        var index = user.facebook.dislikedUser.indexOf(req.body.whom);
                        if (index > -1) {
                            user.facebook.dislikedUser.splice(index, 1);
                        }
                    }
                    if (!user.facebook.likedUser.includes(req.body.whom)) {
                        user.facebook.likedUser.push(req.body.whom);
                        saver = true;
                    }
                } else {
                    if (user.google.dislikedUser.includes(req.body.whom)) {
                        var index = user.google.dislikedUser.indexOf(req.body.whom);
                        if (index > -1) {
                            user.google.dislikedUser.splice(index, 1);
                        }
                    }
                    if (!user.google.likedUser.includes(req.body.whom)) {
                        user.google.likedUser.push(req.body.whom);
                        saver = true;
                    }
                }
                if (user.local.avatar == '' ||
                    user.local.avatar == 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png' ||
                    user.facebook.avatar == '' ||
                    user.google.avatar == '') {
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
                                    if (user.local.email) {
                                        user.local.fameRating += 10;
                                        if (user.local.likedUser.includes(req.body.who)) {
                                            var newConnection = new Connection();
                                            newConnection.first = req.body.who;
                                            newConnection.second = req.body.whom;

                                            newLocation.save(function(err, connect) {
                                                if (err)
                                                   throw err;
                                                if (connect) {
                                                    var newNotification = new Notification();
                                                    newNotification.from = req.body.who;
                                                    newNotification.to = req.body.whom;
                                                    newNotification.subject = 'You have a new connection';
                                                     
                                                    newNotification.save(function(err) {
                                                        if (err)
                                                           throw err;
                                                    });
                                                }
                                            });
                                        }
                                    } else if (user.facebook.email) {
                                        user.facebook.fameRating += 10;
                                        if (user.facebook.likedUser.includes(req.body.who)) {
                                            var newConnection = new Connection();
                                            newConnection.first = req.body.who;
                                            newConnection.second = req.body.whom;

                                            newLocation.save(function(err, connect) {
                                                if (err)
                                                   throw err;
                                                if (connect) {
                                                    var newNotification = new Notification();
                                                    newNotification.from = req.body.who;
                                                    newNotification.to = req.body.whom;
                                                    newNotification.subject = 'You have a new connection';
                                                     
                                                    newNotification.save(function(err) {
                                                        if (err)
                                                           throw err;
                                                    });
                                                }
                                            });
                                        }
                                    } else {
                                        user.google.fameRating += 10;
                                        if (user.google.likedUser.includes(req.body.who)) {
                                            var newConnection = new Connection();
                                            newConnection.first = req.body.who;
                                            newConnection.second = req.body.whom;

                                            newLocation.save(function(err, connect) {
                                                if (err)
                                                   throw err;
                                                if (connect) {
                                                    var newNotification = new Notification();
                                                    newNotification.from = req.body.who;
                                                    newNotification.to = req.body.whom;
                                                    newNotification.subject = 'You have a new connection';
                                                     
                                                    newNotification.save(function(err) {
                                                        if (err)
                                                           throw err;
                                                    });
                                                }
                                            });
                                        }
                                    }                                
                                }

                                user.save(function (err, updatedUser) {
                                    if (err)
                                        throw err;
                                    if (updatedUser) {
                                        res.send({msg: 'SET'});
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

                if (user.local.email) {
                    if (user.local.likedUser.includes(req.body.whom)) {
                        var index = user.local.likedUser.indexOf(req.body.whom);
                        if (index > -1) {
                            user.local.likedUser.splice(index, 1);
                        }
                    }
                    if (!user.local.dislikedUser.includes(req.body.whom)) {
                        user.local.dislikedUser.push(req.body.whom);
                        saver = true;
                    }
                } else if (user.facebook.email) {
                    if (user.facebook.likedUser.includes(req.body.whom)) {
                        var index = user.facebook.likedUser.indexOf(req.body.whom);
                        if (index > -1) {
                            user.facebook.likedUser.splice(index, 1);
                        }
                    }
                    if (!user.facebook.dislikedUser.includes(req.body.whom)) {
                        user.facebook.dislikedUser.push(req.body.whom);
                        saver = true;

                    }   
                } else {
                    if (user.google.likedUser.includes(req.body.whom)) {
                        var index = user.google.likedUser.indexOf(req.body.whom);
                        if (index > -1) {
                            user.google.likedUser.splice(index, 1);
                        }
                    }
                    if (!user.google.dislikedUser.includes(req.body.whom)) {
                        user.google.dislikedUser.push(req.body.whom);
                        saver = true;
                    }    
                }
                if (user.local.avatar == '' ||
                    user.local.avatar == 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png' ||
                    user.facebook.avatar == '' ||
                    user.google.avatar == '') {
                    saver = false;
                } 

                if (saver) {
                    Connection.remove( { $or:[ { first: req.body.whom, second: req.body.who }, {first: req.body.who, second: req.body.whom} ]} , (err, removed) => {
                        if (err) {
                            throw err;
                        }
                        if (removed) {
                            console.log(removed);
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
                                    if (user.local.email) {
                                        user.local.fameRating -= 5;
                                    } else if (user.facebook.email) {
                                        user.facebook.fameRating -= 5;
                                    } else {
                                        user.google.fameRating -= 5;
                                    }                                
                                }

                                user.save(function (err, updatedUser) {
                                    if (err)
                                        throw err;
                                    if (updatedUser) {
                                        res.send({msg: 'SET'});
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