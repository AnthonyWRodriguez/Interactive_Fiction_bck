var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
/*var usersRouter = require('./routes/users');*/


function initApp(db){
  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  var apiRouter = require('./routes/api/api')(db);
  var apiAdmin = require('./routes/api/admin/admin')(db);
  var apiUser = require('./routes/api/user/user')(db);
  var apiObjects = require('./routes/api/admin/objects/objects')(db);

  app.use('/', indexRouter);
  app.use('/api', apiRouter);
  app.use('/admin', apiAdmin);
  app.use('/user', apiUser);
  app.use('/objects', apiObjects);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
}

module.exports = initApp;
