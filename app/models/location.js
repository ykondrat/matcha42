const mongoose  = require('mongoose');

const locationSchema = mongoose.Schema({
    sessionId:  String,
    country:    String,
    city:       String,
    latitude:   String,
    longitude:  String,
});

module.exports = mongoose.model('Location', locationSchema);