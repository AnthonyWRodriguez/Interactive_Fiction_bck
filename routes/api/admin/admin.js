var express = require('express');
var router = express.Router();

function initAdmin(db){
    var usersRouter = require('./users/users')(db);
    router.use('/users', usersRouter);

    var castleRouter = require('./castle/castle')(db);
    router.use('/castle', castleRouter);

    var objectsRouter = require('./objects/objects')(db);
    router.use('/objects', objectsRouter);

    var verbsRouter = require('./verbs/verbs')(db);
    router.use('/verbs', verbsRouter);

    var enemiesRouter = require('./enemies/enemies')(db);
    router.use('/enemies', enemiesRouter);

    var chestsRouter = require('./chests/chests')(db);
    router.use('/chests', chestsRouter);

    return router;
}
module.exports = initAdmin;