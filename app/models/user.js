const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');

const userSchema = mongoose.Schema({
    local: {
        firstName:  String,
        lastName:   String,
        email:      String,
        gender:     String,
        password:   String,
        avatar:     String,
        active:     Number,
        country:    String,
        city:       String,
        latitude:   String,
        longitude:  String,
        photos: {
            photo1: String,
            photo2: String,
            photo3: String,
            photo4: String
        },
        likedUser: [String],
        dislikedUser: [String],
        blockedUser: [String],
        interests: String,
        biography: String,
        sexual: String,
        fameRating: Number,
        birthDate: String
    },
    facebook: {
        id:         String,
        token:      String,
        email:      String,
        firstName:  String,
        lastName:   String,
        gender:     String,
        avatar:     String,
        active:     Number,
        country:    String,
        city:       String,
        latitude:   String,
        longitude:  String,
        photos: {
            photo1: String,
            photo2: String,
            photo3: String,
            photo4: String
        },
        likedUser: [String],
        dislikedUser: [String],
        blockedUser: [String],
        interests: String,
        biography: String,
        sexual: String,
        fameRating: Number,
        birthDate: String
    },
    google: {
        id:         String,
        token:      String,
        email:      String,
        firstName:  String,
        lastName:   String,
        gender:     String,
        avatar:     String,
        active:     Number,
        country:    String,
        city:       String,
        latitude:   String,
        longitude:  String,
        photos: {
            photo1: String,
            photo2: String,
            photo3: String,
            photo4: String
        },
        likedUser: [String],
        dislikedUser: [String],
        blockedUser: [String],
        interests: String,
        biography: String,
        sexual: String,
        fameRating: Number,
        birthDate: String
    }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);