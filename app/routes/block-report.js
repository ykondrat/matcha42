const User            = require('../models/user');
const Report          = require('../models/report');
const Connection      = require('../models/connection');

module.exports = (app) => {
    app.post('/block-user', (req, res) => {
        User.findById(req.body.who, (err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
            	var currentUser = getCurrentUser(user);
                var saver = true;

                if (!currentUser.blockedUser.includes(req.body.whom)) {
                    currentUser.blockedUser.push(req.body.whom);
                    saver = true
                }
                if (currentUser.likedUser.includes(req.body.whom)) {
                    var index = currentUser.likedUser.indexOf(req.body.whom);
                    if (index > -1) {
                        currentUser.likedUser.splice(index, 1);
                        saver = true
                    }
                }
                if (currentUser.avatar == '' || currentUser.avatar == 'https://www.worldskills.org/components/angular-worldskills-utils/images/user.png') {
                    saver = false;
                }

                if (saver) {
                	Connection.findOne({ 'first': req.body.who, 'second': req.body.whom }, (err, con) => {
                        if (err) {
                            throw err;
                        }
                        if (con) {
                            Connection.findByIdAndRemove(con._id, (err, con) => {  
                                if (err) {
                                    throw err;
                                }
                            });
                        }
                        if (!con) {
                            Connection.findOne({ 'first': req.body.whom, 'second': req.body.who }, (err, con) => {
                                if (err) {
                                    throw err;
                                }
                                if (con) {
                                    Connection.findByIdAndRemove(con._id, (err, con) => {  
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                }
                            });
                        }
                    });
                	user.save((err, updatedUser) => {
	                    if (err) {
	                        throw err;
	                    }
	                    if (updatedUser) {
	                        res.sendStatus(200);
	                    }
                	});
                }
            }
        });
    });
    app.post('/report-user', (req, res) => {
        var newReport = new Report();
        newReport.report_from = req.body.who;
        newReport.user_id = req.body.whom;
         
        newReport.save(function(err) {
            if (err)
               throw err;
            res.sendStatus(200);
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