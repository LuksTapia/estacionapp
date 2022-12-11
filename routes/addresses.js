
var express = require('express');
var router = express.Router();
var addresses = require('../src/repositories/addresses');

router.get('/', async function(req, res, next) {
    res.json(await addresses.getAll());
});


router.get('/getAll/:locationId',async function(req,res) {
    res.json(await addresses.getAllById(req.params.locationId));

})

router.post('/', async function(req, res, next) {

    //los datos se leen desde el req.body.code
    /*METODO POST:
    1)Debo tener location existente.
    2)El address, no puede tener un streetName nulo o blanco, y el número debe ser mayor a 0
    3)Chequear que esa dirección no exista:
        Para eso hay que validar que no haya un streetName&&streetNumber&&locationId existente. Puede
        haber calles con el mismo nombre y número, pero no con el mismo nombre, número y locationId
        
    */

    if(!req.body.locationId) {
        return res.status(400).json({
            "message" : "MISSING_LOCATION_ID",
            "description" : "El parámetro locationId no se encuentra"
        });

    }


    if(!req.body.streetName) {
        return res.status(400).json({
            "message" : "MISSING_STREET_NAME",
            "description" : "El parámetro streetName no se encuentra"

        })
    }

    if(!req.body.streetNumber) {
        return res.status(400).json({
            "message" : "MISSING_STREET_NUMBER",
            "description" : "El parámetro streetNumber no se encuentra"

        })

    }

    if(req.body.streetNumber < 0) {
        return res.status(400).json({
            "message" : "INVALID_STREET_NUMBER_VALUE",
            "description" : "El parámetro streetNumber debe ser mayor a 0"

        })

    }

    if(addresses.exist(req.body.streetName, req.body.streetNumber, req.body.locationId)) {
        return res.status(400).json({
            "message" : "DUPLICATED_ADDRESS",
            "description" : "There is an address with this values that already exist"
        })

    }

    try {
        
      let saved = await addresses.save(req.body.streetName, req.body.streetNumber, req.body.locationId)

      res.status(201).json({"message" : saved});
      
    } catch (e) {
      console.log(e)
      res.status(500).json({"message" : "error"});
    }


  });






router.get('/:id', async function(req, res) {
    
    let address = await addresses.getById(req.params.id)
    if(address){
        
        return res.json(address)
    }
    
    res.status(404).end()
});

module.exports = router;