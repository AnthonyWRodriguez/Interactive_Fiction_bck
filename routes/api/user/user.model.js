var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};

    var userCollection = db.collection("users");
    var castleCollection = db.collection("castle");
    var verbCollection = db.collection("verbs");
    var objectsEnvCollection = db.collection("objectsEnv");
    var objectsInvCollection = db.collection("objectsInv");

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
        userBaseHealth: 0,
        userRealHealth: 0,
        userAtk: 0,
        userActive: false
    }

    userModel.newUser = (data, handler)=>{
        castleCollection.find({}).toArray((err, res)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            objectsInvCollection.find({}).toArray((err, objs)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                var sword = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Steel Sword"){
                        sword = objs[y];
                        break;
                    }
                }
                var healHerb = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Healing Herb"){
                        healHerb = objs[y];
                        break;
                    }
                }
                var shield = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Iron Shield"){
                        shield = objs[y];
                        break;
                    }
                }
                var fist = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Fist"){
                        fist = objs[y];
                        break;
                    }
                }
                var {name, email} = data;
                var room = new ObjectID("5ebb610f6bc9ce5a28d03b99");
                var user = Object.assign(
                    {},
                    userTemplate,
                    {
                        userName: name,
                        userEmail: email,
                        userProgress: res,
                        userInventory: [sword, healHerb, shield],
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
                        userBaseHealth: 10,
                        userRealHealth: 10,
                        userAtk: 2,
                        userActive: true
                    }
                );
                userCollection.insertOne(user, (err, rslt)=>{
                    if(err){
                        console.log(err);
                        return handler(err, null);
                    }
        
                    return handler(null, rslt.ops);
                })
            })
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

    userModel.grabObject = (data, handler)=>{
        var {object, currentRName, uName, InvObjs} = data;
        var Objs = InvObjs;
        var b = 0;
        for(var a=0;a<Objs.length;a++){
            if(Objs[a].objectName===object.objectName){
                b=a;
                break;
            }
        }
        Objs.splice(b,1);
        var query = {"userName": uName}
        var updateCommand = {
            $push:{
                "userInventory": object
            },
            $set:{
                "userProgress.$[r].roomObjectsInv": Objs
            },
        };
        var filter = {
            arrayFilters: [
                {
                    "r.roomName": currentRName
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
                return handler(null, Objs);
            }
        )
    };


    userModel.dropObject = (data, handler)=>{
        var {object, currentRName, uName, InvObjs} = data;
        var query = {"userName": uName};
        var Objs = InvObjs;
        var b = 0;
        for(var a=0;a<Objs.length;a++){
            if(Objs[a].objectName===object.objectName){
                b=a;
                break;
            }
        }
        Objs.splice(b,1);
        var updateCommand = {
            $push:{
                "userProgress.$[r].roomObjectsInv": object
            },
            $set:{
                "userInventory": Objs
            }
        };
        var filter = {
            arrayFilters: [
                {
                    "r.roomName": currentRName
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
                return handler(null, Objs);
            }
        )
    };


    userModel.equipObject = (data, handler) =>{
        var {object, uName, leftE, rightE, InvObjs, dir} = data;
        var Objs = InvObjs;
        var b = 0;
        for(var a=0;a<Objs.length;a++){
            if(Objs[a].objectName===object.objectName){
                b++;
                break;
            }
        }
        var query = {"userName": uName};
        var updateCommand = {};
        var msg = "";
        if(object.objectName===leftE && object.objectName===rightE){
            msg = "You already have equipped two of those";
            return handler(null, {"msg":msg});
        }
        if(b>=1){
            if(object.objectType!=="HEAL" && object.objectType!=="UPGR"){
                if(dir==="left"){
                    if(object.objectName!==leftE){
                        if( b>1 || object.objectName!==rightE){
                            updateCommand={
                                $set:{
                                    "userLeftEquip": object
                                }
                            }
                        }else{
                            return handler(null, {"msg":"That item is already equipped in your right hand"});
                        }
                    }else{
                        return handler(null, {"msg":"That item is already equipped in your left hand"});
                    }
                }else{
                    if(object.objectName!==rightE){
                        if( b>1 || object.objectName!==leftE){
                            updateCommand={
                                $set:{
                                    "userRightEquip": object
                                }
                            }
                        }else{
                            return handler(null, {"msg":"That item is already equipped in your left hand"});
                        }
                    }else{
                        return handler(null, {"msg":"That item is already equipped in your right hand"});
                    }
                }
            }else{
                return handler(null, {"A":"A"});
            }    
        }else{
            return handler(null, {"msg":"That item is not in your inventory"});
        }
        userCollection.findOneAndUpdate(
            query,
            updateCommand,
            (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, {"msg":msg});
            }
        )
    };







    
    userModel.unequipObject = (data, handler)=>{
        var {object, uName, leftE, rightE, dir} = data;
        objectsInvCollection.find({}).toArray((err, objs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var fist = {};
            for(var a=0;a<objs.length;a++){
                if(objs[a].objectName==="Fist"){
                    fist = objs[a];
                    break;
                }
            }
            var msg = "";
            var query = {"userName": uName};
            var updateCommand={};
            if(dir==="left"){
                msg = `Unequipped ${object.objectName} from left hand`;
                updateCommand = {
                    $set:{
                        userLeftEquip: fist
                    }
                }
            }else if(dir==="right"){
                msg = `Unequipped ${object.objectName} from right hand`;
                updateCommand = {
                    $set:{
                        userRightEquip: fist
                    }
                }
            }else{
                if(object===leftE){
                    msg = `Unequipped ${object.objectName} from left hand`;
                    updateCommand = {
                        $set:{
                            userLeftEquip: fist
                        }
                    }
                }
                if(object===rightE){
                    msg = `Unequipped ${object.objectName} from right hand`;
                    updateCommand = {
                        $set:{
                            userRightEquip: fist
                        }
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
                    return handler(null, {"msg":msg});
                }
            )
        });
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

    userModel.getAllObjectsInv = (data, handler)=>{
        var name = data;
        var query = {"objectName": name};
        objectsInvCollection.findOne(
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

    userModel.diedAndStartedOver = (data, handler)=>{
        castleCollection.find({}).toArray((err, res)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            objectsInvCollection.find({}).toArray((err, objs)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                var sword = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Steel Sword"){
                        sword = objs[y];
                        break;
                    }
                }
                var healHerb = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Healing Herb"){
                        healHerb = objs[y];
                        break;
                    }
                }
                var shield = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Iron Shield"){
                        shield = objs[y];
                        break;
                    }
                }
                var fist = "";
                for (y=0;y<objs.length;y++){
                    if(objs[y].objectName==="Fist"){
                        fist = objs[y];
                        break;
                    }
                }
                var {name} = data;
                var room = new ObjectID("5ebb610f6bc9ce5a28d03b99");
                var query = {"userName": name};
                var updateCommand = {
                    $set:{
                        userProgress: res,
                        userInventory: [sword, healHerb, shield],
                        userLeftEquip: fist,
                        userRightEquip: fist,
                        userCurrentRoom: room,
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
                        userBaseHealth: 10,
                        userRealHealth: 10,
                        userAtk: 2,
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
            });
        });
    }


    return userModel;
}