var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    castleModel = {};
    var castleCollection = db.collection("castle");
    var usersCollection = db.collection("users");
    var objectsEnvCollection = db.collection("objectsEnv");
    var objectsInvCollection = db.collection("objectsInv");
    var enemiesCollection = db.collection("enemies");

    var roomTemplate = {
        roomName: "",
        roomEnter: "",
        roomEnterEnemy: "",
        roomLook: "",
        roomLeft: "",
        roomLeftBool: false,
        roomRight: "",
        roomRightBool: false,
        roomForward: "",
        roomForwardBool: false,
        roomBackward: "",
        roomBackwardBool: false,
        roomObjectsInv: [],
        roomObjectsEnv: [],
        roomEnemy: "",
        roomEnemyHealth: "",
        roomEnemyAlive: false
    };

    castleModel.getAllRooms = (handler) => {
        return castleCollection.find({}).toArray(handler);
    };

    castleModel.newRoom = (data, handler) =>{
        var {name, enter, enterEnemy, enemyName, enemyAlive, look, left, right, forward, backward, leftBool, rightBool, forwardBool, backwardBool } = data;
        enemiesCollection.find({}).toArray((err, enemies)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var enemy = "";
            for(var a=0;a<enemies.length;a++){
                if(enemies[a].enemyName===enemyName){
                    enemy = enemies[a];
                    break;
                }
            }
            var leftB = Boolean(false);
            var rightB = Boolean(false);
            var forwardB = Boolean(false);
            var backwardB = Boolean(false);
            var enemyLive = Boolean(false);
            if(leftBool==="true"){
                leftB = Boolean(true);
            }
            if(rightBool==="true"){
                rightB = Boolean(true);
            };
            if(forwardBool==="true"){
                forwardB = Boolean(true);
            };
            if(backwardBool==="true"){
                backwardB = Boolean(true);
            };
            if(enemyAlive==="true"){
                enemyLive = Boolean(true);
            }
            var room = Object.assign(
                {},
                roomTemplate,
                {
                    roomName: name,
                    roomEnter: enter,
                    roomEnterEnemy: enterEnemy,
                    roomLook: look,
                    roomLeft: left,
                    roomLeftBool: leftB,
                    roomRight: right,
                    roomRightBool: rightB,
                    roomForward: forward,
                    roomForwardBool: forwardB,
                    roomBackward: backward,
                    roomBackwardBool: backwardB,
                    roomObjectsInv: [],
                    roomObjectsEnv: [],
                    roomEnemy: enemy,
                    roomEnemyHealth: enemy.enemyHealth,
                    roomEnemyAlive: enemyLive
                }
            );
            castleCollection.insertOne(room, (err, rslt)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, rslt.ops);
            });
        });
    };

    castleModel.updateRoom = (data, handler) =>{
        var {_id, name, enter, enterEnemy, enemyName, enemyAlive, look, left, right, forward, backward, leftBool, rightBool, forwardBool, backwardBool} = data;
        enemiesCollection.find({}).toArray((err, enemies)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var enemy = {};
            for(var a=0;a<enemies.length;a++){
                if(enemies[a].enemyName===enemyName){
                    enemy = enemies[a];
                    break;
                }
            }
            var leftB = Boolean(false);
            var rightB = Boolean(false);
            var forwardB = Boolean(false);
            var backwardB = Boolean(false);
            var enemyLive = Boolean(false);
            if(leftBool==="true"){
                leftB = Boolean(true);
            }
            if(rightBool==="true"){
                rightB = Boolean(true);
            };
            if(forwardBool==="true"){
                forwardB = Boolean(true);
            };
            if(backwardBool==="true"){
                backwardB = Boolean(true);
            };
            if(enemyAlive==="true"){
                enemyLive = Boolean(true);
            }
            var query = {"_id": new ObjectID(_id)};
            var updateCommand = {
                "$set":{
                    roomName: name,
                    roomEnter: enter,
                    roomEnterEnemy: enterEnemy,
                    roomLook: look,
                    roomLeft: left,
                    roomRight: right,
                    roomForward: forward,
                    roomBackward: backward,
                    roomLeftBool: leftB,
                    roomRightBool: rightB,
                    roomForwardBool: forwardB,
                    roomBackwardBool: backwardB,
                    roomEnemy: enemy,
                    roomEnemyHealth: enemy.enemyHealth,
                    roomEnemyAlive: enemyLive,
                }
            };
            castleCollection.updateOne(
                query,
                updateCommand,
                (err, rslt)=>{
                    if(err){
                        console.log(err);
                        return handler(err, null);
                    }
                    var query2 = {"userProgress":{"$elemMatch":{"_id": new ObjectID(_id)}}};
                    var updateCommand2 = {
                        $set:{
                            "userProgress.$[r].roomName": name,
                            "userProgress.$[r].roomEnter": enter,
                            "userProgress.$[r].roomEnterEnemy": enterEnemy,
                            "userProgress.$[r].roomLook": look,
                            "userProgress.$[r].roomLeft": left,
                            "userProgress.$[r].roomRight": right,
                            "userProgress.$[r].roomForward": forward,
                            "userProgress.$[r].roomBackward": backward,
                            "userProgress.$[r].roomLeftBool": leftB,
                            "userProgress.$[r].roomRightBool": rightB,
                            "userProgress.$[r].roomForwardBool": forwardB,
                            "userProgress.$[r].roomBackwardBool": backwardB,
                            "userProgress.$[r].roomEnemy": enemy,
                            "userProgress.$[r].roomEnemyHealth": enemy.enemyHealth,
                            "userProgress.$[r].roomEnemyAlive": enemyLive
                        }
                    };
                    var filter = {
                        arrayFilters: [
                            {
                                "r._id":new ObjectID(_id)
                            }
                        ],
                        multi: true,
                    };
                    usersCollection.updateMany(
                        query2,
                        updateCommand2,
                        filter,
                        (err, upds)=>{
                            if(err){
                                console.log(err);
                                return handler(err, null);
                            }
                            return handler(null, {"msg":"The update was a success"});
                        }
                    )
                }
            )    
        });
    };

    castleModel.addObjectInv = (data, handler)=>{
        var {idRoom, nameObj} = data;
        objectsInvCollection.find({}).toArray((err, objects)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }else{
                var x = 0;
                for(x=0;x<objects.length;x++){
                    if(objects[x].objectName===nameObj){
                        var query = {"_id": new ObjectID(idRoom)};
                        var updateCommand = {
                            $push:{
                                "roomObjectsInv": objects[x]
                            }
                        };
                        castleCollection.findOneAndUpdate(
                            query,
                            updateCommand,
                            (err, upd)=>{
                                if(err){
                                    console.log(err);
                                    return handler(err, null);
                                }
                                return handler(null, {"msg":"The item was successfully added"});
                            }
                        )
                    }
                }
            }
        })
    }

    castleModel.addObjectEnv = (data, handler)=>{
        var {idRoom, nameObj} = data;
        objectsEnvCollection.find({}).toArray((err, objects)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }else{
                var x = 0;
                for(x=0;x<objects.length;x++){
                    if(objects[x].objectName===nameObj){
                        var query = {"_id": new ObjectID(idRoom)};
                        var updateCommand = {
                            $push:{
                                "roomObjectsEnv": objects[x]
                            }
                        };
                        castleCollection.findOneAndUpdate(
                            query,
                            updateCommand,
                            (err, upd)=>{
                                if(err){
                                    console.log(err);
                                    return handler(err, null);
                                }
                                return handler(null, {"msg":"The item was successfully added"});
                            }
                        )
                    }
                }
            }
        })
    }

    return castleModel;

}