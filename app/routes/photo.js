const User 	= require('../models/user');
const fs 	= require('fs');

module.exports = (app, uploads) => { 
    app.post('/photo', uploads.any(), (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
            	var currentUser = getCurrentUser(user);
            	
            	req.files.forEach((photo, index) => {
                    path = photo.path.substring(6);
                    
                    if (photo.fieldname == 'avatar') {
                        if (currentUser.avatar == 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png') {
                            currentUser.fameRating += 10;
                            if (currentUser.gender && currentUser.sexual && currentUser.birthDate) {
                                currentUser.active = 1;
                            }
                        }
                        currentUser.avatar = `http://localhost:8000${path}`;
                    } else {
                        if (!currentUser.photos) {
                            currentUser.fameRating += 10;
                        } else if (currentUser.photos[photo.fieldname] == '' || !currentUser.photos[photo.fieldname]) {
                            currentUser.fameRating += 10;
                        }
                        currentUser.photos[photo.fieldname] = `http://localhost:8000${path}`;
                    }
                });

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
    app.post('/delete-photo', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
            	var currentUser = getCurrentUser(user);
            	let photo = currentUser.photos[req.body.photo].split('/'); 
                photo = photo[photo.length - 1];
                let path = __dirname + '/../public/uploads/' + photo;
                currentUser.photos[req.body.photo] = "";
                currentUser.fameRating -= 10;

                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
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
    app.post('/set-avatar', (req, res) => {
        User.findById(req.body.id, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
            	var currentUser = getCurrentUser(user);

                let tmp = currentUser.photos[req.body.photo];
                currentUser.photos[req.body.photo] = currentUser.avatar;
                currentUser.avatar = tmp;

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