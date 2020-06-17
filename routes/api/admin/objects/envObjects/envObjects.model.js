var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    objectsModel = {};

    var objectsCollection = db.collection("objectsEnv");
    var objectsInvCollection = db.collection("objectsInv");
    var chestRoomCollection = db.collection("roomChest");
    var roomMoveCollection = db.collection("roomMove");

    var objectTemplate = {
        objectName: "",
        objectDesc: "",
        objectPush: "",
        objectPull: "",
        objectRead: "",
        objectOpen: "",
        objectClimb: "",
        objectContents: {},
        objectInteracted: false,
        objectHelp: "",
        objectPushBool: false,
        objectPullBool: false,
        objectReadBool: false,
        objectOpenBool: false,
        objectClimbBool: false,
        objectHelpBool: false,
        objectDescBool: false,
    };

    
    var chestRoomTemplate = {
        roomID: "",
        chest: {},
    }

    var roomMoveTemplate = {
        roomID: "",
        dir: "",
    }

    objectsModel.getAllObjects = (handler)=>{
        return objectsCollection.find({}).toArray(handler);
    };

    objectsModel.newObject = (data, handler)=>{
        var {name, desc, push, pull, read, open, climb, contentName, help, pushBool, 
            pullBool, readBool, openBool, climbBool, helpBool, descBool} = data;
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
                    objectClimb: climb,
                    objectContents: content,
                    objectInteracted: false,
                    objectHelp: help,
                    objectPushBool: pushBool,
                    objectPullBool: pullBool,
                    objectReadBool: readBool,
                    objectOpenBool: openBool,
                    objectClimbBool: climbBool,
                    objectHelpBool: helpBool,
                    objectDescBool: descBool,
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
        var {id, name, desc, push, pull, read, open, climb, contentName, help, pushBool, 
            pullBool, readBool, openBool, climbBool, helpBool, descBool} = data;
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
                    objectClimb: climb,
                    objectContents: content,
                    objectInteracted: false,
                    objectHelp: help,
                    objectPushBool: pushBool,
                    objectPullBool: pullBool,
                    objectReadBool: readBool,
                    objectOpenBool: openBool,
                    objectClimbBool: climbBool,
                    objectHelpBool: helpBool,
                    objectDescBool: descBool,
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

    objectsModel.allRoomMove = (handler)=>{
        roomMoveCollection.find({}).toArray(handler);
    }

    objectsModel.newRoomMove = (data, handler)=>{
        var {roomID, dir}=data;
        var roomMove = Object.assign(
            {},
            roomMoveTemplate,
            {
                roomID: roomID,
                dir: dir,
            }
        );
        roomMoveCollection.insertOne(roomMove, (err, object)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            return handler(null, object.ops);
        })
    }
        
    return objectsModel;
}