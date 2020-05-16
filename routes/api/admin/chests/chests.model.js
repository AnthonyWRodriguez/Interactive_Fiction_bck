var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    chestsModel = {};

    var chestsCollection = db.collection("chests");
    var chestRoomCollection = db.collection("roomChest");
    var objectsInvCollection = db.collection("objectsInv");

    var chestTemplate = {
        objectName: "",
        objectDesc: "",
        objectOpen: "",
        objectClose: "",
        objectInteracted: false,
        objectHelp: "",
        objectContents: {},
    };

    var chestRoomTemplate = {
        roomID: "",
        chest: {},
    }

    chestsModel.getAll = (handler) =>{
        chestsCollection.find({}).toArray(handler);
    };

    chestsModel.newChest = (data, handler)=>{
        var {chestName, contentName, desc, open, close, help} = data;
        objectsInvCollection.find({}).toArray((err, objs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var content = {};
            for(var x=0;x<objs.length;x++){
                if(objs[x].objectName===contentName){
                    content = objs[x];
                }
            }
            var chest = Object.assign(
                {},
                chestTemplate,
                {
                    objectName: chestName,
                    objectDesc: desc,
                    objectOpen: open,
                    objectClose: close,
                    objectInteracted: false,
                    objectHelp: help,
                    objectContents: content,
                }
            );
            chestsCollection.insertOne(chest, (err, rslt)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, rslt.ops);
            });
        });

    };

    chestsModel.updateChest = (data, handler)=>{
        var {chestNameOG, chestNameNew, contentName, desc, open, close, help} = data;
        objectsInvCollection.find({}).toArray((err, objs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var content = {};
            for(var x=0;x<objs.length;x++){
                if(objs[x].objectName===contentName){
                    content = objs[x];
                }
            };
            var query = {"objectName": chestNameOG};
            var updateCommand = {
                $set:{
                    objectName: chestNameNew,
                    objectDesc: desc,
                    objectOpen: open,
                    objectClose: close,
                    objectInteracted: false,
                    objectHelp: help,
                    objectContents: content,
                }
            };
            chestsCollection.findOneAndUpdate(
                query, 
                updateCommand,
                (err, rslt)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, rslt);
            });
        });
    };

    chestsModel.allChestRoom = (handler) =>{
        chestRoomCollection.find({}).toArray(handler);
    };

    chestsModel.linkChestToRoom = (data, handler)=>{
        var {chestName, roomId} = data;
        chestsCollection.find({}).toArray((err, chests)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var roomCH = {};
            for(var x=0;x<chests.length;x++){
                if(chests[x].objectName===chestName){
                    roomCH = chests[x];
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

    return chestsModel;
}