var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    objectsModel = {};

    var objectsCollection = db.collection("objectsEnv");
    var objectsInvCollection = db.collection("objectsInv");
    var chestRoomCollection = db.collection("roomChest");

    var objectTemplate = {
        objectName: "",
        objectDesc: "",
        objectPush: "",
        objectPull: "",
        objectRead: "",
        objectOpen: "",
        objectClose: "",
        objectClimb: "",
        objectBurn: "",
        objectShoot: "",
        objectShatter: "",
        objectContents: {},
        objectInteracted: false,
        objectHelp: "",
        objectPushBool: false,
        objectPullBool: false,
        objectReadBool: false,
        objectOpenBool: false,
        objectCloseBool: false,
        objectClimbBool: false,
        objectBurnBool: false,
        objectShootBool: false,
        objectShatterBool: false,
    };

    
    var chestRoomTemplate = {
        roomID: "",
        chest: {},
    }

    objectsModel.getAllObjects = (handler)=>{
        return objectsCollection.find({}).toArray(handler);
    };

    objectsModel.newObject = (data, handler)=>{
        var {name, desc, push, pull, read, open, close, climb, burn, shoot, shatter, contentName, help, 
            pushBool, pullBool, readBool, openBool, closeBool, climbBool, burnBool, shootBool, shatterBool,} = data;
        objectsInvCollection.find({}).toArray((err, invs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var content = {};
            for (var x=0;x<invs.length;x++){
                if(invs[x].objectName===contentName){
                    content = invs[x];
                    break;
                }
            }
            var object = Object.assign(
                {},
                objectTemplate,
                {
                    objectName: name,
                    objectDesc: desc,
                    objectPush: push,
                    objectPull: pull,
                    objectRead: read,
                    objectOpen: open,
                    objectClose: close,
                    objectClimb: climb,
                    objectBurn: burn,
                    objectShoot: shoot,
                    objectShatter: shatter,
                    objectContents: content,
                    objectInteracted: false,
                    objectHelp: help,
                    objectPushBool: pushBool,
                    objectPullBool: pullBool,
                    objectReadBool: readBool,
                    objectOpenBool: openBool,
                    objectCloseBool: closeBool,
                    objectClimbBool: climbBool,
                    objectBurnBool: burnBool,
                    objectShootBool: shootBool,
                    objectShatterBool: shatterBool,
                }
            );
            objectsCollection.insertOne(object, (err, object)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, object.ops);
            })
        })
    };

    objectsModel.updateObject = (data, handler)=>{
        var {id, name, desc, push, pull, read, open, close, climb, burn, shoot, shatter, contentName, help, 
            pushBool, pullBool, readBool, openBool, closeBool, climbBool, burnBool, shootBool, shatterBool,} = data;
        objectsInvCollection.find({}).toArray((err, invs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var content = {};
            for (var x=0;x<invs.length;x++){
                if(invs[x].objectName===contentName){
                    content = invs[x];
                    break;
                }
            }
            var query = {"_id": new ObjectID(id)};
            var updateCommand = {
                $set:{
                    objectName: name,
                    objectDesc: desc,
                    objectPush: push,
                    objectPull: pull,
                    objectRead: read,
                    objectOpen: open,
                    objectClose: close,
                    objectClimb: climb,
                    objectBurn: burn,
                    objectShoot: shoot,
                    objectShatter: shatter,
                    objectContents: content,
                    objectInteracted: false,
                    objectHelp: help,
                    objectPushBool: pushBool,
                    objectPullBool: pullBool,
                    objectReadBool: readBool,
                    objectOpenBool: openBool,
                    objectCloseBool: closeBool,
                    objectClimbBool: climbBool,
                    objectBurnBool: burnBool,
                    objectShootBool: shootBool,
                    objectShatterBool: shatterBool,
                }
            }
            objectsCollection.findOneAndUpdate(
                query,
                updateCommand,
                (err, upd)=>{
                    if(err){
                        console.log(err);
                        return handler(err, null);
                    }
                    return handler(null, upd);
                }
            )
        });
    }

    objectsModel.allChestRoom = (handler) =>{
        chestRoomCollection.find({}).toArray(handler);
    };

    objectsModel.linkChestToRoom = (data, handler)=>{
        var {chestName, roomId} = data;
        objectsCollection.find({}).toArray((err, objs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var roomCH = {};
            for(var x=0;x<objs.length;x++){
                if(objs[x].objectName===chestName){
                    roomCH = objs[x];
                }
            }
            var chestRoom = Object.assign(
                {},
                chestRoomTemplate,
                {
                    roomID: new ObjectID(roomId),
                    chest: roomCH,
                }
            );
            chestRoomCollection.insertOne(chestRoom ,(err, chestR)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, chestR);
            });
        });
    }
        
    return objectsModel;
}