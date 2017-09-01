const mongoose  = require('mongoose');

const connectionSchema = mongoose.Schema({
    first: String,
    second: String,
    messages: [
    	{
    		who: String,
    		subject: String
    	}
    ]
});

module.exports = mongoose.model('Connection', connectionSchema);