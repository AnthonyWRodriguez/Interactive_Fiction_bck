var express = require('express');
var router = express.Router();

function initEnemies (db) {

    var enemiesModel = require('./enemies.model')(db);

    router.get('/allEnemies', (req, res)=>{
        enemiesModel.getAllEnemies((err, enemies)=>{
            if(err){
                console.log(err);
                return res.status(500).json(err);
            }
            return res.status(200).json(enemies);
        });
    });

    return router;

}
module.exports = initEnemies;