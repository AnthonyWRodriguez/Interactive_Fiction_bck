var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    castleModel = {};
    var castleCollection = db.collection("castle");
    var usersCollection = db.collection("users");
    var objectsEnvCollection = db.collection("objectsEnv");
    var objectsInvCollection = db.collection("objectsInv");

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
        var {name, enter, look, left, right, forward, backward, leftBool, rightBool, forwardBool, backwardBool } = data;
        var leftB = Boolean(false);
        var rightB = Boolean(false);
        var forwardB = Boolean(false);
        var backwardB = Boolean(false);
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
        var room = Object.assign(
            {},
            roomTemplate,
            {
                roomName: name,
                roomEnter: enter,
                roomEnterEnemy: "",
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
                roomEnemy: "",
                roomEnemyHealth: "",
                roomEnemyAlive: false
            }
        );
        castleCollection.insertOne(room, (err, rslt)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            return handler(null, rslt.ops);
        });
    };

    castleModel.updateRoom = (data, handler) =>{
        var {_id, name, enter, look, left, right, forward, backward, leftBool, rightBool, forwardBool, backwardBool} = data;
        var leftB = Boolean(false);
        var rightB = Boolean(false);
        var forwardB = Boolean(false);
        var backwardB = Boolean(false);
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
        var query = {"_id": new ObjectID(_id)};
        var updateCommand = {
            "$set":{
                roomName: name,
                roomEnter: enter,
                roomLook: look,
                roomLeft: left,
                roomRight: right,
                roomForward: forward,
                roomBackward: backward,
                roomLeftBool: leftB,
                roomRightBool: rightB,
                roomForwardBool: forwardB,
                roomBackwardBool: backwardB,
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
                        "userProgress.$[r].roomLook": look,
                        "userProgress.$[r].roomLeft": left,
                        "userProgress.$[r].roomRight": right,
                        "userProgress.$[r].roomForward": forward,
                        "userProgress.$[r].roomBackward": backward,
                        "userProgress.$[r].roomLeftBool": leftB,
                        "userProgress.$[r].roomRightBool": rightB,
                        "userProgress.$[r].roomForwardBool": forwardB,
                        "userProgress.$[r].roomBackwardBool": backwardB,
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