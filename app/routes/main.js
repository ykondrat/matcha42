module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('index', { title: 'matcha signup', message: req.flash('errorMessage') });
    });
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.render('error');
    });
};