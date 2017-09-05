const express       = require('express');
const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');
const mongoose      = require('mongoose');
const configDb      = require('./config/database');
const path          = require('path');
const bodyParser    = require('body-parser');
const sass          = require('node-sass-middleware');
const passport      = require('passport');
const flash         = require('connect-flash');
const MongoStore    = require('connect-mongo')(session);
const multer		    = require('multer');
const storage       = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, req.body.id + file.originalname);
	}
});
const uploads		= multer({ storage: storage });

const app = express();

const port = process.env.PORT || 8000;

require('./config/passport')(passport);
mongoose.connect(configDb.url);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.use(cookieParser());

app.use(session({
                    secret: 'anyStringOfText',
                    saveUninitialized: true,
                    resave: true,
                    store: new MongoStore({ mongooseConnection: mongoose.connection })
                }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes/online')(app);
require('./app/routes/messages')(app);
require('./app/routes/search')(app);
require('./app/routes/block-report')(app);
require('./app/routes/likes')(app);
require('./app/routes/photo')(app, uploads);
require('./app/routes/profile')(app);
require('./app/routes/notification')(app);
require('./app/routes/auth')(app, passport);
require('./app/routes/main')(app);

app.listen(port)

console.log('\x1b[33m%s\x1b[0m', '========= Matcha server =========');
console.log('\x1b[32m%s\x1b[0m', `server is runing on port: ${port}`);
console.log('\x1b[33m%s\x1b[0m', '=================================');
console.log('\x1b[35m%s\x1b[0m', 'Dev: Yevhen Kondratyev');
console.log('\x1b[35m%s\x1b[0m', 'Email: kondratyev.yevhen@gmail.com');