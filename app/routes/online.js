const User = require('../models/user');

module.exports = (app) => {
	app.post('/online', (req, res) => {
		User.findById(req.body.id, (err, user) => {
			if (err) {
				throw err;
			}
			if (user) {
				user = getCurrentUser(user);
				user.online = req.body.date;

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
}
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