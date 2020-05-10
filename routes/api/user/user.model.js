var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};

    var userCollection = db.collection("users");
    var castleCollection = db.collection("castle");
    var verbCollection = db.collection("verbs");
    var objectsEnvCollection = db.collection("objectsEnv");

    var userTemplate ={
        userName: "",
        userEmail: "",
        userProgress: "",
        userInventory: [],
        userLeftEquip: "",
        userRightEquip: "",
        userCurrentRoom: "",
        userRole: "",
        userCommands: [],
        userActive: false
    }

    userModel.newUser = (data, handler)=>{
        castleCollection.find({}).toArray((err, res)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var {name, email} = data;
            var sword = "Steel Sword";
            var healHerb = "Healing Herb";
            var shield = "Iron Shield";
            var fist = "Fist";
            var room = new ObjectID("5eae5849ed6b166964fdbb2c");
            var user = Object.assign(
                {},
                userTemplate,
                {
                    userName: name,
                    userEmail: email,
                    userProgress: res,
                    userInventory: [sword, healHerb, healHerb, shield],
                    userLeftEquip: fist,
                    userRightEquip: fist,
                    userCurrentRoom: room,
                    userRole: "player",
                    userCommands: [                
                        `You start at the doors of a massive castle. 
                        You look at your surroundings: A wide open space. 
                        This castle has been constructed atop a cliff with no apparent way to enter or leave. 
                        A maiden's shouts can be faintly heard inside. 
                        You hear your name being called out.`,
                        `${name}!!! Save me!!!`,
                        `You try to force the door open, but it appears to be locked. 
                        The path behind you is gone beacuse the wooden bridge collapsed. 
                        You can go around the castle through the left or the right. `,
                        `As you start to feel you gain control over your whole body after daydreaming about
                        ... well... that's not important..., but after you regain body control, 
                        you hear a strange voice saying "Welcome to my world, dear player."`,
                        `"I'm the inner voice of your conscience. 
                        During this adventure you're about to embark, 
                        I will be the one in charge of guiding you. 
                        In case you need any help, you may type in 'help'"`],
                    userActive: true
                }
            );
            userCollection.insertOne(user, (err, rslt)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
    
                return handler(null, rslt.ops);
            });
        });
    };

    userModel.currentUser = (data, handler)=>{
        var email = data;
        var query = {"userEmail": email};
        userCollection.findOne(
            query,
            (err, user)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, user);
            }
        )
    };

    userModel.currentRoom = (data, handler)=>{
        var {userID, roomID} = data;
        var query = {"_id": new ObjectID(userID)};
        userCollection.findOne(
            query,
            (err, user)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                var index;
                for(var x=0;x<user.userProgress.length;x++){
                    if(user.userProgress[x]._id==roomID){
                        index = x;
                        break;
                    }
                }
                return handler(null, user.userProgress[index]);
            }
        )
    }

    userModel.dropObject = (data, handler)=>{
        var {id, inv, obj, duplicate, dir, room} = data;
        var query = {"_id": new ObjectID(id)};
        var updateCommand = "";
        if(duplicate==="true"){
            updateCommand = {
                $set:{
                    "userInventory": inv
                },
                $push:{
                    "userProgress.$[r].roomObjectsInv": obj
                }
            };    
        }else{
            if(dir==="left"){
                updateCommand = {
                    $set:{
                        "userInventory": inv,
                        "userLeftEquip": "Fist"
                    },
                    $push:{
                        "userProgress.$[r].roomObjectsInv": obj
                    }
                };
            }else{
                updateCommand = {
                    $set:{
                        "userInventory": inv,
                        "userRightEquip": "Fist"
                    },
                    $push:{
                        "userProgress.$[r].roomObjectsInv": obj
                    }
                };
            } 
        }
        var filter = {
            arrayFilters: [
                {
                    "r._id":new ObjectID(room)
                }
            ],
            multi: true,
        };
        userCollection.findOneAndUpdate(
            query,
            updateCommand,
            filter,
            (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, upd);
            }
        )
    };

    userModel.grabObject = (data, handler)=>{
        var {idU, idR, obj, objs} = data;
        var query = {"_id":new ObjectID(idU)};
        var updateCommand = {
            $push:{
                "userInventory": obj
            },
            $set:{
                "userProgress.$[r].roomObjectsInv": objs
            }
        };
        var filter = {
            arrayFilters: [
                {
                    "r._id":new ObjectID(idR)
                }
            ],
            multi: true,
        };
        userCollection.findOneAndUpdate(
            query,
            updateCommand,
            filter,
            (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, upd);
            }
        )
    };

    userModel.equipObject = (data, handler) =>{
        var {id, nameObj, direction} = data;
        var query = {"_id": new ObjectID(id)};
        var updateCommand="";
        if(direction==="left"){
            updateCommand = {
                $set:{
                    "userLeftEquip": nameObj
                }
            }    
        }else{
            updateCommand = {
                $set:{
                    "userRightEquip": nameObj
                }
            }  
        }
        userCollection.findOneAndUpdate(
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
    };

    userModel.unequipObject = (data, handler)=>{
        var{id, direction} = data;
        var query = {"_id": new ObjectID(id)};
        var updateCommand="";
        if(direction==="left"){
            updateCommand = {
                $set:{
                    "userLeftEquip": "Fist"
                }
            }    
        }else{
            updateCommand = {
                $set:{
                    "userRightEquip": "Fist"
                }
            }  
        }
        userCollection.findOneAndUpdate(
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
    }

    userModel.addCommand = (data, handler)=>{
        var {email, commands} = data;
        var query = {"userEmail": email};
        var updateCommand = {
            $set:{
                "userCommands": commands
            }
        }
        userCollection.findOneAndUpdate(
            query,
            updateCommand,
            (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, upd.data);
            }
        )
    }

    userModel.allVerbs=(handler)=>{
        verbCollection.find({}).toArray(handler);
    };
    
    userModel.getAllObjectsEnv = (data, handler)=>{
        var name = data;
        var query = {"objectName": name};
        objectsEnvCollection.findOne(
            query,
            (err, obj)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, obj);
            }
        )
    };


    return userModel;
}