var express = require('express');
const place = require('../db/models/place');
var router = express.Router(); //submodulo del enrutador. 
var places = require('../src/repositories/places');
var parkings = require('../src/repositories/parkings');

router.get('/', async function (req, res, next) {
  res.json(await places.getAll());
});


router.get('/id', async function (req, res) {
  let place = await places.getById(req.query.id)
  if (place) {
    return res.json(place)
  }
  res.status(404).end()
});

router.post('/save', async function (req, res, next) {

  if (req.body.capacity < 1) {
    return res.status(400).json({
      "message": "INVALID_FULL_CAPACITY",
      "descripcion": "El parametro de la capacidad es invalido"
    });
  }

  if (!req.body.parkingId) {
    return res.status(400).json({
      "message": "INVALID_PARKING",
      "descripcion": "El parametro parkingId es nulo o vacio"
    });
  }

  const placeParking = await parkings.getById(req.body.parkingId)
  if (!placeParking) {
    return res.status(400).json({
      "message": "UNREGISTERED_PARKING",
      "descripcion": "No existe el parking"
    });
  }

  try {
    await places.savePlaces(req.body.capacity, req.body.parkingId)
    res.status(201).json({ "message": "se agregaron places" });
  } catch (e) {
    res.status(500).json({ "messaje": "error" });
  }

});


module.exports = router;