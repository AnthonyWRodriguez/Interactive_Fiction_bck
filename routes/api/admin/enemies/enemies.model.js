var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    enemiesModel = {};
    var enemiesCollection = db.collection("enemies");
    var objectsInvCollection = db.collection("objectsInv");

    var enemyTemplate = {
        enemyName: "",
        enemyATK: "",
        enemyHealth: "",
        enemyWeapon: "",
        enemyDesc: "",
    };

    enemiesModel.getAllEnemies = (handler) => {
        return enemiesCollection.find({}).toArray(handler);
    };

    enemiesModel.newEnemy = (data, handler)=>{
        var {name, health, weapon, attack, desc} = data;
        objectsInvCollection.find({}).toArray((err, objs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var WP = {};
            for(var a=0;a<objs.length;a++){
                if(objs[a].objectName===weapon){
                    WP = objs[a];
                }
            }
            var enemy = Object.assign(
                {},
                enemyTemplate,
                {
                    enemyName: name,
                    enemyATK: attack,
                    enemyHealth: health,
                    enemyWeapon: WP,
                    enemyDesc: desc,
                }
            );
            enemiesCollection.insertOne(enemy, (err, rslt)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, rslt.ops);
            });    
        });
    };

    enemiesModel.updateEnemy = (data, handler)=>{
        var {nameOG, nameNew, health, weapon, attack, desc} = data;
        objectsInvCollection.find({}).toArray((err, objs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var WP = {};
            for(var a=0;a<objs.length;a++){
                if(objs[a].objectName===weapon){
                    WP = objs[a];
                }
            }
            var query = {"enemyName": nameOG};
            var updateCommand = {
                $set:{
                    "enemyName": nameNew,
                    "enemyATK": attack,
                    "enemyHealth": health,
                    "enemyWeapon": WP,
                    "enemyDesc": desc
                }
            }
            enemiesCollection.findOneAndUpdate(
                query,
                updateCommand,
                (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null,upd);
            });    
        });
    };

    return enemiesModel;
}