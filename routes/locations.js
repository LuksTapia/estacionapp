var express = require('express');
var router = express.Router();
var locations = require('../src/repositories/locations');

router.get('/', async function (req, res, next) {
    console.log(req.query.locationName);
    if (req.query.locationName){
        return res.json( await locations.getAll({locationName: req.query.locationName}))
    }
    res.json(await locations.getAll());
});

router.get('/:id', async function (req, res) {
    let location = await locations.getById(req.params.id)
    if (location) {
        return res.json(location)
    }
    res.status(404).end()
});

/*
//NO ES LOGICA DE NEGOCIO:
//Las location son provistas por el sistema y no pueden crearse ni modificarse
router.post('/', async function (req, res, next) {

    if (!req.body.locationName) {
        return res.status(400).json({ "message": "MISSING_LOCATION_NAME" }) //Esto es cuando falta 1 campo (Bad Request)
    }
    if (req.body.locationName.length > 30) {
        return res.status(400).json({ "message": "INVALID_LOCATION_NAME" }) //Esto es cuando falta 1 campo (Bad Request)
    }
    if (await locations.exist(req.body.locationName)) {
        return res.status(400).json({ "message": "DUPLICATE_LOCATION_NAME" }) //Esto es cuando esta duplicado
    }
    try {
        let saved = await locations.save(req.body.locationName)
        //res.json({"message" : saved});
        res.status(201).json({ "message": saved }); //Esta debe ser la respuesta correcta
    } catch (e) {
        console.log(e); //Esto es para mi para saber como resolverlo
        res.status(500).json({ "message": "error" }) //Esto es para el cliente cuando hay algun error
    }
});
*/

module.exports = router;