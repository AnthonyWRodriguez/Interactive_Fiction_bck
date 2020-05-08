var express = require('express');
var router = express.Router();

function initAdmin(db){
    var usersRouter = require('./users/users')(db);
    router.use('/users', usersRouter);

    var castleRouter = require('./castle/castle')(db);
    router.use('/castle', castleRouter);

    var objectsRouter = require('./objects/objects')(db);
    router.use('/objects', objectsRouter);

    return router;
}
module.exports = initAdmin;