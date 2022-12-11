var express = require('express');
var router = express.Router();
var vehicles = require('../src/repositories/vehicles');
var User =  require ('../src/repositories/users');

router.get('/', async function(req, res, next) {
    res.json(await vehicles.getAll());
});


router.get('/:id', async function(req, res) {
   
    let vehicle = await vehicles.getById(req.params.id)
    if(vehicle){
        //Devuelvo si existe
        return res.json(vehicle)
    }
    //Devuelvo error si no existe
    res.status(404).end()
});


router.post('/', async function(req,res,next){


    if(req.body.patent == null){
        return res.status(400).json({
            "message" : "MISSING_PATENT",
            "description" : "La patente no puede ser nula"
        })
    }

 
    if(req.body.patent.length < 6){
        return res.status(400).json({
            "message" : "INVALID_SHORT_PATENT",
            "description" : "La patente debe tener un minimo de 6 caracteres"
        })
    }
    
    if(req.body.patent.length > 7){
        return res.status(400).json({
            "message" : "INVALID_LARGE_PATENT",
            "description" : "La patente ingresada no puede superar los 7 caracteres"
        })
    }
    

    let vehicle = await vehicles.exist(req.body.patent)

    if(vehicle != null){
        return res.status(400).json({
            "message" : "PATENT_EXIST",
            "description" : "Ya existe un vehiculo con la patente ingresada"
        })
    }

    if(req.body.userId == null){
        return res.status(400).json({
            "message" : "MISSING_ID",
            "description" : "Se debe proporcionar un ID de usuario"
        })
    }

    let user = await User.getById(req.body.userId)

    if(!user){
        return res.status(400).json({
            "message" : "MISSING_USER",
            "description" : "El id de usuario proporcionado no existe"
        })
    }

    try{
        let saved =  await vehicles.save(req.body.patent, req.body.userId)
        res.status(201).json({ "message" : saved});
    } catch (e){
        res.status(404)
    }


})



module.exports = router;
