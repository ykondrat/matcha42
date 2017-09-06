const User          = require('../models/user');
const Location      = require('../models/location');
const nodemailer    = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kondratyev.yevhen@gmail.com',
        pass: ''
    }
});
module.exports = (app, passport) => {
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    app.get('/profile', isLoggedOn, (req, res) => {
        res.render('profile', { title: 'matcha profile', user: req.user });
    });
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
};
function isLoggedOn(req, res, next) {
    if (req.isAuthenticated()) {
        return (next());
    }
    res.redirect('/');
}