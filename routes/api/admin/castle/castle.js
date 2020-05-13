var express = require('express');
var router = express.Router();

function initCastle (db) {

    var castleModel = require('./castle.model')(db);

    router.get('/allRooms', (req, res)=>{
        castleModel.getAllRooms((err, rooms)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(rooms);
        });
    });

    router.post('/newRoom', (req, res)=>{
        var data = req.body;
        castleModel.newRoom(data, (err, room)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(room);
        });
    });


    router.put('/updateRoom', (req, res)=>{
        var id = req.body.id;
        var leftB = false;
        var rightB = false;
        var forwardB = false;
        var backwardB = false;
        if(req.body.leftB==="true"){
            leftB = true;
        }
        if(req.body.rightB==="true"){
            rightB = true;
        };
        if(req.body.forwardB==="true"){
            forwardB = true;
        };
        if(req.body.backwardB==="true"){
            backwardB = true;
        };
        var data = {
            "_id":id,
            "leftBool": leftB,
            "rightBool": rightB,
            "forwardBool": forwardB,
            "backwardBool": backwardB,
            ...req.body
        };
        castleModel.updateRoom(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });

    router.put('/addObjectInv', (req, res)=>{
        var data = req.body;
        castleModel.addObjectInv(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });

    router.put('/addObjectEnv', (req, res)=>{
        var data = req.body;
        castleModel.addObjectEnv(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });

    return router;

}
module.exports = initCastle;