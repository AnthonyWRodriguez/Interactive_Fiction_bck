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

    router.post('/newEnemy', (req, res)=>{
        var a = req.body.WP.toLowerCase();
        var heal =  parseInt(req.body.heal);
        var attack = parseInt(req.body.atk);
        var b = a.split(" ");
        var WP = {};
        if(b.length===1){
            WP = b[0].charAt(0).toUpperCase()+b[0].slice(1);
        }else{
            WP = b[0].charAt(0).toUpperCase()+b[0].slice(1)+" "+b[1].charAt(0).toUpperCase()+b[1].slice(1);
        }
        var data = {
            "weapon": WP,
            "health": heal,
            "attack": attack,
            ...req.body
        }
        enemiesModel.newEnemy(data, (err, enemy)=>{
            if(err){
                console.log(err);
                return res.status(500).json(err);
            }
            return res.status(200).json(enemy);
        });
    });

    router.put('/updateEnemy', (req, res)=>{
        var heal =  parseInt(req.body.heal);
        var attack = parseInt(req.body.atk);
        var a = req.body.WP.toLowerCase();
        var b = a.split(" ");
        var WP = {};
        if(b.length===1){
            WP = b[0].charAt(0).toUpperCase()+b[0].slice(1);
        }else{
            WP = b[0].charAt(0).toUpperCase()+b[0].slice(1)+" "+b[1].charAt(0).toUpperCase()+b[1].slice(1);
        }
        var data = {
            "weapon": WP,
            "health": heal,
            "attack": attack,
            ...req.body
        }
        enemiesModel.updateEnemy(data, (err, enemy)=>{
            if(err){
                console.log(err);
                return res.status(500).json(err);
            }
            return res.status(200).json(enemy);
        });
    });

    return router;

}
module.exports = initEnemies;