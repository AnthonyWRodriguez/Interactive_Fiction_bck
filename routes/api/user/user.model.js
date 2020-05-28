var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};

    var userCollection = db.collection("users");
    var castleCollection = db.collection("castle");
    var verbCollection = db.collection("verbs");
    var objectsEnvCollection = db.collection("objectsEnv");
    var objectsInvCollection = db.collection("objectsInv");
    var chestRoomCollection = db.collection("roomChest");
    var roomMoveCollection = db.collection("roomMove");

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
                            `You start at the "entrance doors" of a massive castle. 
                            You look at your surroundings: A wide open space. 
                            This castle has been constructed atop a cliff with no apparent way to enter or leave. 
                            A maiden's shouts can be faintly heard inside. 
                            You hear your name being called out.`,
                            `${name}!!! Save me!!!`,
                            `You try to force the door open, but it appears to be locked. 
                            The path behind you is gone beacuse the wooden bridge collapsed. 
                            You can go around the castle through the left or the right. `,
                            `As you start to feel you gain control over your whole body after daydreaming about
                            ... well... that's not important..., but
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
                msg = `Unequipped ${object} from left hand`;
                updateCommand = {
                    $set:{
                        userLeftEquip: fist
                    }
                }
            }else if(dir==="right"){
                msg = `Unequipped ${object} from right hand`;
                updateCommand = {
                    $set:{
                        userRightEquip: fist
                    }
                }
            }else{
                if(object===leftE){
                    msg = `Unequipped ${object} from left hand`;
                    updateCommand = {
                        $set:{
                            userLeftEquip: fist
                        }
                    }
                }else if(object===rightE){
                    msg = `Unequipped ${object} from right hand`;
                    updateCommand = {
                        $set:{
                            userRightEquip: fist
                        }
                    }
                }else{
                    msg = `Already unequipped the item`;
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
        var {name, uName} = data;
        var query = {"userName":uName, "userInventory": {"$elemMatch":{"objectName": name}}};
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
                            `You start at the "entrance doors" of a massive castle. 
                            You look at your surroundings: A wide open space. 
                            This castle has been constructed atop a cliff with no apparent way to enter or leave. 
                            A maiden's shouts can be faintly heard inside. 
                            You hear your name being called out.`,
                            `${name}!!! Save me!!!`,
                            `You try to force the door open, but it appears to be locked. 
                            The path behind you is gone beacuse the wooden bridge collapsed. 
                            You can go around the castle through the left or the right. `,
                            `As you start to feel you gain control over your whole body after daydreaming about
                            ... well... that's not important..., but 
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

    userModel.getAllInvObjects = (handler)=>{
        return objectsInvCollection.find({}).toArray(handler);
    };

    userModel.changeRoom = (data, handler) =>{
        var {uName, roomID} = data;
        var room = new ObjectID(roomID)
        var query = {"userName": uName};
        var updateCommand = {
            $set:{
                "userCurrentRoom": room
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
                return handler(null, {"msg":"You moved to the next room"});
            }
        )
    }

    userModel.hitEnemy = (data, handler)=>{
        var {userN, roomN, newHealth} = data;
        var query = {"userName": userN}
        var updateCommand = {
            $set:{
                "userProgress.$[r].roomEnemyHealth": newHealth
            }
        };
        var filter = {
            arrayFilters: [
                {
                    "r.roomName": roomN
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
    }

    userModel.killedEnemy = (data, handler)=>{
        var {userN, roomN} = data;
        var query = {"userName": userN}
        var updateCommand = {
            $set:{
                "userProgress.$[r].roomEnemyAlive": false
            }
        };
        var filter = {
            arrayFilters: [
                {
                    "r.roomName": roomN
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
    }

    userModel.getHit = (data, handler)=>{
        var {userN, HP} = data;
        var query = {"userName": userN}
        var updateCommand = {
            $set:{
                "userRealHealth": HP
            }
        };
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

    userModel.useHealingItem = (data, handler)=>{
        var {InvObjs, uName, baseH, realH} = data;
        var mainArray = [];
        var one = false
        var nwH = 0;
        for(let s =0;s<InvObjs.length;s++){
            if(InvObjs[s].objectType!=="HEAL"){
                mainArray.push(InvObjs[s]);
            }else{
                if(!one){
                    one=true;
                    nwH = realH+InvObjs[s].objectValue;
                    if(nwH>baseH){
                        nwH=baseH;
                    }
                }else{
                    mainArray.push(InvObjs[s]);
                }
            }
        }
        var query = {"userName": uName};
        var updateCommand = {
            $set:{
                "userInventory": mainArray,
                "userRealHealth": nwH,
            }
        };
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

    userModel.allChestRoom = (handler) =>{
        chestRoomCollection.find({}).toArray(handler);
    };

    userModel.addChestToRoom = (data, handler)=>{
        var {uName, currentRName, chest} = data;
        var query = {"userName": uName};
        var updateCommand = {
            $push:{
                "userProgress.$[r].roomObjectsEnv": chest
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
                return handler(null, upd);
            }
        )
    }

    userModel.openDoor = (data, handler)=>{
        var {roomID, uName, objectN} = data;
        roomMoveCollection.find({}).toArray((err, roomMoves)=>{
            if(err){
                console.log(err);
                return handler(err, null)
            }
            var dir = "";
            for (var x=0;x<roomMoves.length;x++){
                if(roomMoves[x].roomID==roomID){
                    dir = roomMoves[x].dir;
                    break;
                }
            }
            userCollection.find({}).toArray((err, users)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                var user = {};
                var room = {};
                var object = {};
                for (var x=0;x<users.length;x++){
                    if(users[x].userName===uName){
                        user = users[x];
                        break;
                    }
                }
                for (var x=0;x<user.userProgress.length;x++){
                    if(user.userProgress[x]._id==roomID){
                        room = user.userProgress[x];
                        break;
                    }
                }
                for (var x=0;x<room.roomObjectsEnv.length;x++){
                    if(room.roomObjectsEnv[x].objectName===objectN){
                        object = room.roomObjectsEnv[x];
                        break;
                    }
                }
                var query = {"userName": uName};
                var updateCommand = {}
                if(!object.objectInteracted){
                    updateCommand = {
                        $set:{
                            ["userProgress.$[r].room"+dir+"Bool"]: true,
                            "userProgress.$[r].roomObjectsEnv.$[c].objectInteracted": true
                        }
                    };    
                }
                var filter = {
                    arrayFilters: [
                        {
                            "r._id": new ObjectID(roomID)
                        },
                        {
                            "c.objectName": objectN
                        }
                    ],
                    multi: true,
                };
                if(!object.objectInteracted){
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
                    );
        
                }else{
                    return handler(null, {"more":"But you have already opened the door, so its redundant, to do so again"});
                }
            });
        });
    }

    userModel.openChest = (data, handler)=>{
        var {roomID, uName, objectN} = data;
        userCollection.find({}).toArray((err, users)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var user = {};
            var room = {};
            var chest = {};
            for (var x=0;x<users.length;x++){
                if(users[x].userName===uName){
                    user = users[x];
                    break;
                }
            }
            for (var x=0;x<user.userProgress.length;x++){
                if(user.userProgress[x]._id==roomID){
                    room = user.userProgress[x];
                    break;
                }
            }
            for (var x=0;x<room.roomObjectsEnv.length;x++){
                if(room.roomObjectsEnv[x].objectName===objectN){
                    chest = room.roomObjectsEnv[x];
                    break;
                }
            }
            var query = {"userName": uName};
            var updateCommand = {}
            if(!chest.objectInteracted){
                updateCommand = {
                    $push:{
                        "userProgress.$[r].roomObjectsInv": chest.objectContents
                    },
                    $set:{
                        "userProgress.$[r].roomObjectsEnv.$[c].objectInteracted": true
                    }
                };      
            }
            var filter = {
                arrayFilters: [
                    {
                        "r._id": new ObjectID(roomID)
                    },
                    {
                        "c.objectName": objectN
                    }
                ],
                multi: true,
            };
            if(!chest.objectInteracted){
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
                );
    
            }else{
                return handler(null, {"more":"But you have already gotten the key, so the chest is empty"});
            }
        });
    }

    userModel.useKey = (data, handler)=>{
        var {currentRName, uName, doorP, InvObjs, currentRID} = data;
        roomMoveCollection.find({}).toArray((err, roomMoves)=>{
            if(err){
                console.log(err);
                return handler(err, null)
            }
            var dir = "";
            for (var x=0;x<roomMoves.length;x++){
                if(roomMoves[x].roomID==currentRID){
                    dir = roomMoves[x].dir;
                    break;
                }
            }
            userCollection.find({}).toArray((err, users)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                var user = {};
                var room = {};
                var object = {};
                var msg = "";
                for (var x=0;x<users.length;x++){
                    if(users[x].userName===uName){
                        user = users[x];
                        break;
                    }
                }
                for (var x=0;x<user.userProgress.length;x++){
                    if(user.userProgress[x].roomName==currentRName){
                        room = user.userProgress[x];
                        break;
                    }
                }
                for (var x=0;x<room.roomObjectsEnv.length;x++){
                    if(room.roomObjectsEnv[x].objectName===doorP+" Door"){
                        object = room.roomObjectsEnv[x];
                        msg = "door is";
                        break
                    }
                    if(room.roomObjectsEnv[x].objectName===doorP+" Doors"){
                        object = room.roomObjectsEnv[x];
                        msg = "doors are";
                        break;
                    }
                }
                var newInv = [];
                var one = true;
                for(var x=0;x<InvObjs.length;x++){
                    if(InvObjs[x].objectName===(doorP+" Key")){
                        if(one){
                            one=false;
                        }else{
                            newInv.push(InvObjs[x]);
                        }
                    }else{
                        newInv.push(InvObjs[x]);
                    }
                }
                var query = {"userName": uName};
                var updateCommand = {};
                if(dir==="Forward"){
                    console.log("SOMETING MUST HAPPEN");
                    updateCommand = {
                        $set:{
                            "userProgress.$[r].roomForwardBool":true,
                            "userProgress.$[r].roomObjectsEnv.$[c].objectInteracted": true,
                            "userInventory": newInv
                        }
                    };        
                }
                if(dir==="Backward"){
                    updateCommand = {
                        $set:{
                            "userProgress.$[r].roomBackwardBool":true,
                            "userProgress.$[r].roomObjectsEnv.$[c].objectInteracted": true,
                            "userInventory": newInv
                        }
                    };        
                }   
                if(dir==="Left"){
                    updateCommand = {
                        $set:{
                            "userProgress.$[r].roomLeftBool":true,
                            "userProgress.$[r].roomObjectsEnv.$[c].objectInteracted": true,
                            "userInventory": newInv
                        }
                    };        
                }   
                if(dir==="Right"){
                    updateCommand = {
                        $set:{
                            "userProgress.$[r].roomRightBool":true,
                            "userProgress.$[r].roomObjectsEnv.$[c].objectInteracted": true,
                            "userInventory": newInv
                        }
                    };        
                }
                if(object.objectName!==undefined){
                    if(!object.objectInteracted){
                        var filter = {
                            arrayFilters: [
                                {
                                    "r.roomName": currentRName
                                },
                                {
                                    "c.objectName": object.objectName
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
                                return handler(null, {"msg":`Used the ${doorP} Key, but just as the ${msg} unlocking,
                                the key got stuck, rendering the key useless. Nonetheless, the ${msg} now open`});
                            }
                        );
                    }else{
                        return handler(null, {"msg":`Used the ${doorP} Key.`,
                        "more":`But the ${msg} already opened, so its redundant, to do so again`});
                    }    
                }else{
                    return handler(null, {"msg":`There is no object to use the ${doorP} Key with`});
                }
            });
        });
    }

    return userModel;
}