var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    verbModel = {};

    verbCollection = db.collection("verbs");

    var verbTemplate = {
        name: "",
        help: "",
        associateVerb: ""
    }

    verbModel.allVerbs=(handler)=>{
        verbCollection.find({}).toArray(handler);
    };

    verbModel.addVerb = (data, handler)=>{
        var {name, help, assoVerb} = data;
        var verb = Object.assign(
            {},
            verbTemplate,
            {
                name: name,
                help: help,
                associateVerb: assoVerb
            }
        );
        verbCollection.insertOne(verb, (err, nVerb)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            return handler(null, nVerb.ops)
        });
    };

    verbModel.updateVerb = (nam, data, handler)=>{
        var nameOG = nam;
        var {nameNew, help, assoVerb} = data;
        var query = {"name": nameOG};
        var updateCommand = {
            $set:{
                "name": nameNew,
                "help": help,
                "associateVerb": assoVerb
            }
        };
        verbCollection.findOneAndUpdate(
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

    return verbModel;
}