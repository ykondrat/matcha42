module.exports = {
    'facebookAuth': {
        'clientID' : '1951885001760138',
        'clientSecret': '98354fe787125465652fabd098e7298e',
        'callbackURL': 'http://localhost:8000/auth/facebook/callback',
        'profileFields': ['email', 'id', 'first_name', 'gender', 'last_name', 'picture']
    },
    'googleAuth': {
        'clientID' : '965013119924-47cshe9trfrrte6k2kr5d630v5sldn0r.apps.googleusercontent.com',
        'clientSecret': '01rGqhlP5HEsioIwSJBcFHno',
        'callbackURL': 'http://localhost:8000/auth/google/callback'
    }
}