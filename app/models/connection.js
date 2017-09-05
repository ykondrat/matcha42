const mongoose  = require('mongoose');

const connectionSchema = mongoose.Schema({
    first: String,
    second: String,
    messages: [String]
});

module.exports = mongoose.model('Connection', connectionSchema);