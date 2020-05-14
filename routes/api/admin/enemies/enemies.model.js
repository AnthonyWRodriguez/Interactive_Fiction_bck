var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    enemiesModel = {};
    var enemiesCollection = db.collection("enemies");

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
        var {name, health, weapon, atk} = data;

    }

    return enemiesModel;
}