var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    enemiesModel = {};
    var enemiesCollection = db.collection("enemies");

    var enemyTemplate = {
        enemyName: "",
        enemyHealth: "",
        enemyWeapon: ""
    };

    enemiesModel.getAllEnemies = (handler) => {
        return enemiesCollection.find({}).toArray(handler);
    };

    return enemiesModel;
}