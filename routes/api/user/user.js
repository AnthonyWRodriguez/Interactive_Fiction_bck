var express = require('express');
var router = express.Router();

function initUser (db) {

    var userModel = require('./user.model')(db);

    router.post('/new', (req, res)=>{
        var data = req.body;
        userModel.newUser(data, (err,user)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"error"});
            }
            return res.status(200).json(user);
        });
    });

    router.get('/myUser/:email', (req, res)=>{
        var data = req.params.email;
        userModel.currentUser(data, (err, user)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(user);
        });
    });

    router.get('/currentRoom/:userID/:roomID', (req, res)=>{
        var user = req.params.userID;
        var room = req.params.roomID;
        var data = {
            "userID": user,
            "roomID": room
        };
        userModel.currentRoom(data, (err, room)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(room);
        });
    });

    router.put('/drop', (req, res)=>{
        var data = req.body;
        userModel.dropObject(data, (err, drop)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(drop);
        });
    });

    router.put('/grab', (req, res)=>{
        var data = req.body;
        userModel.grabObject(data, (err, drop)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(drop);
        });
    });

    router.put('/equip', (req, res)=>{
        var data = req.body;
        userModel.equipObject(data, (err, equip)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(equip);
        });
    });

    router.put('/unequip', (req, res)=>{
        var data = req.body;
        userModel.unequipObject(data, (err, unequip)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(unequip);
        });
    });

    router.put('/addCommand', (req, res)=>{
        var data = req.body;
        userModel.addCommand(data, (err, add)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(add);
        });
    });

    router.get('/allVerbs',(req, res)=>{
        userModel.allVerbs((err, verbs)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(verbs);
        }); 
    });

    router.get('/allObjectsEnv/:name', (req, res)=>{
        var data = req.params.name;
        userModel.getAllObjectsEnv(data, (err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    router.get('/allObjectsInv/:name', (req, res)=>{
        var data = req.params.name;
        userModel.getAllObjectsInv(data, (err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    router.put('/death', (req, res)=>{
        var data = req.body;
        userModel.diedAndStartedOver(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json({"msg":"Welcome back to life"});
        })
    });

    router.get('/allInvObjects', (req, res)=>{
        userModel.getAllInvObjects((err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    router.put('/changeRoom', (req, res)=>{
        var data = req.body;
        userModel.changeRoom(data, (err, change)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(change);
        });
    });

    router.put('/hitEnemy', (req, res)=>{
        var num = parseInt(req.body.newHP);
        var data = {
            "newHealth": num,
            ...req.body
        }
        userModel.hitEnemy(data, (err, hit)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(hit);
        });
    });

    router.put('/killedEnemy', (req, res)=>{
        var data = req.body;
        userModel.killedEnemy(data, (err, killed)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(killed);
        });
    });

    router.put('/getHit', (req, res)=>{
        var health = parseInt(req.body.health);
        var data = {
            "HP": health,
            ...req.body
        }
        userModel.getHit(data, (err, hit)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(hit);
        });
    });

    return router;
}
module.exports = initUser;