var express = require('express');
var router = express.Router();

function initObjects (db) {

    var objectsModel = require('./envObjects.model')(db);

    router.get('/allObjects', (req, res)=>{
        objectsModel.getAllObjects((err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    router.post('/newObject', (req, res)=>{
        var push = false;
        var pull = false;
        var read = false;
        var open = false;
        var climb = false;
        var help = false;
        var desc = false;
        if(req.body.pushB==="true"){
            push=true;
        }
        if(req.body.pullB==="true"){
            pull=true;
        }
        if(req.body.readB==="true"){
            read=true;
        }
        if(req.body.openB==="true"){
            open=true;
        }
        if(req.body.climbB==="true"){
            climb=true;
        }
        if(req.body.helpB==="true"){
            help=true;
        }
        if(req.body.descB==="true"){
            desc=true;
        }
        var data = {
            "pushBool": push,
            "pullBool": pull,
            "readBool": read,
            "openBool": open,
            "climbBool": climb,
            "helpBool": help,
            "descBool": desc,
            ...req.body
        }
        objectsModel.newObject(data, (err, object)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(object);
        });
    });

    router.put('/updateObject', (req, res)=>{
        var push = false;
        var pull = false;
        var read = false;
        var open = false;
        var climb = false;
        var help = false;
        var desc = false;
        if(req.body.pushB==="true"){
            push=true;
        }
        if(req.body.pullB==="true"){
            pull=true;
        }
        if(req.body.readB==="true"){
            read=true;
        }
        if(req.body.openB==="true"){
            open=true;
        }
        if(req.body.climbB==="true"){
            climb=true;
        }
        if(req.body.helpB==="true"){
            help=true;
        }
        if(req.body.descB==="true"){
            desc=true;
        }
        var data = {
            "pushBool": push,
            "pullBool": pull,
            "readBool": read,
            "openBool": open,
            "climbBool": climb,
            "helpBool": help,
            "descBool": desc,
            ...req.body
        }
        objectsModel.updateObject(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });

    router.get('/allChestRoom', (req, res)=>{
        objectsModel.allChestRoom((err, chestsRooms)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(chestsRooms);
        });
    });

    router.post('/linkChestToRoom', (req, res)=>{
        var data = req.body;
        objectsModel.linkChestToRoom(data, (err, link)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(link);
        });
    });

    router.get('/allRoomMove', (req, res)=>{
        objectsModel.allRoomMove((err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    router.post('/newRoomMove', (req, res)=>{
        var data = req.body;
        objectsModel.newRoomMove(data, (err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    return router;
}
module.exports = initObjects;