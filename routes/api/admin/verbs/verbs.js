var express = require('express');
var router = express.Router();

function initVerb (db) {

    var verbModel = require('./verbs.model')(db);

    router.get('/all',(req, res)=>{
        verbModel.allVerbs((err, verbs)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(verbs);
        }); 
    });
    
    router.post('/new',(req, res)=>{
        var data = req.body;
        verbModel.addVerb(data, (err, verb)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(verb);
        });
    });

    router.put('/update/:name',(req, res)=>{
        var name = req.params.name;
        var data = req.body;
        verbModel.updateVerb(name, data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });

    return router;
}
module.exports = initVerb;