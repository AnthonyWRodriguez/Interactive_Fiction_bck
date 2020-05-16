var express = require('express');
var router = express.Router();

function initChests (db) {

    var chestsModel = require('./chests.model')(db);

    router.get('/getAll', (req, res)=>{
        chestsModel.getAll((err, all)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(all);
        });
    });

    router.post('/newChest', (req, res)=>{
        var data = req.body;
        chestsModel.newChest(data, (err, chest)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(chest);
        }); 
    });

    router.put('/updateChest', (req, res)=>{
        var data = req.body;
        chestsModel.updateChest(data, (err, chest)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(chest);
        }); 
    });

    router.get('/allChestRoom', (req, res)=>{
        chestsModel.allChestRoom((err, chestsRooms)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(chestsRooms);
        });
    });

    router.post('/linkChestToRoom', (req, res)=>{
        var data = req.body;
        chestsModel.linkChestToRoom(data, (err, link)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(link);
        });
    });

    return router;
}
module.exports = initChests;