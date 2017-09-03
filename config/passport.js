const LocalStrategy     = require('passport-local').Strategy;
const FacebookStrategy  = require('passport-facebook');
const GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy;
const User              = require('../app/models/user');
const Location          = require('../app/models/location');
const configAuth        = require('./auth');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
           done(err, user); 
        });
    });
    
    passport.use('local-signup', new LocalStrategy({
        usernameField:  'email',
        passwordField:  'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        process.nextTick(() => { 
            User.findOne({ 'local.email': email }, (err, user) => {
                if (err) {
                    return (done(err));
                }
                if (user) {
                    return (done(null, false, req.flash('errorMessage', 'Email already exists')));
                } else {
                    Location.findOne({ 'sessionId': req.sessionID }, (err, location) => {
                        if (err) {
                            throw err;
                        }
                        if (location) {
                            var newUser = new User();
                            newUser.local.firstName = req.body.firstName;
                            newUser.local.lastName = req.body.lastName;
                            newUser.local.email = email;
                            newUser.local.active = 0;
                            newUser.local.sexual = 'bisexual';
                            newUser.local.fameRating = 10;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.country = location.country;
                            newUser.local.city = location.city;
                            newUser.local.longitude = location.longitude;
                            newUser.local.latitude = location.latitude;
                            newUser.local.avatar = 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png';

                            newUser.save(function(err) {
                                if (err)
                                   throw err;
                                return (done(null, newUser));
                            });
                        }
                    });
                }
            });
        });
    }));
    
    passport.use('local-signin', new LocalStrategy({
        usernameField:  'email',
        passwordField:  'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
            process.nextTick(() => {
                User.findOne({ 'local.email': email }, (err, user) => {
                    if (err) {
                        return (done(err));
                    }
                    if (!user) {
                        return (done(null, false, req.flash('errorMessage', 'No user found')));
                    }
                    if (!user.validPassword(password)) {
                        return (done(null, false, req.flash('errorMessage', 'Incorrect password')));
                    }
                    Location.findOne({ 'sessionId': req.sessionID }, (err, location) => {
                        if (err) {
                            throw err;
                        }
                        if (location) {
                            user.local.country = location.country;
                            user.local.city = location.city;
                            user.local.longitude = location.longitude;
                            user.local.latitude = location.latitude;

                            user.save(function(err, updatedUser){
                                if (err)
                                    return (done(err));
                                if (updatedUser) {
                                    return (done(null, updatedUser));
                                }
                            });
                        }
                    });
                }); 
            });
    }));
    
    var facebookOptions = {
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields,
    };
    var facebookCallBack = function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'facebook.id': profile.id }, function(err, user) {
                if (err)
                    return (done(err));
                if (user) {
                    return (done(null, user));
                } else {
                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.firstName = profile.name.givenName;
                    newUser.facebook.lastName = profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;
                    newUser.facebook.gender = profile.gender;
                    newUser.facebook.country = '0';
                    newUser.facebook.city = '0';
                    newUser.facebook.longitude = '0';
                    newUser.facebook.latitude = '0';
                    newUser.facebook.active = 0;
                    newUser.facebook.avatar = `https://graph.facebook.com/${profile.id}/picture?type=large&width=720&height=720`;
                    newUser.facebook.fameRating = 20;
                    
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return (done(null, newUser));
                    });
                }
            });
        }); 
    };
    passport.use(new FacebookStrategy(facebookOptions, facebookCallBack));

    var googleOptions = {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    };
    var googleCallBack = function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'google.id': profile.id }, function(err, user) {
                if (err)
                    return (done(err));
                if (user) {
                    return (done(null, user));
                } else {
                    var newUser = new User();
                    var avatar = profile.photos[0].value.replace("?sz=50", "?sz=450");
                    newUser.google.id = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.firstName = profile.name.givenName;
                    newUser.google.lastName = profile.name.familyName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.google.gender = profile.gender;
                    newUser.google.avatar = avatar;
                    newUser.google.fameRating = 20;
                    newUser.google.active = 0;
                    newUser.google.country = '0';
                    newUser.google.city = '0';
                    newUser.google.longitude = '0';
                    newUser.google.latitude = '0';

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return (done(null, newUser));
                    });
                }
            });
        }); 
    };
    passport.use(new GoogleStrategy(googleOptions, googleCallBack)); 
};