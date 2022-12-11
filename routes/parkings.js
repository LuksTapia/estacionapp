var express = require('express');
var router = express.Router(); //submodulo del enrutador. 
var parkings = require('../src/repositories/parkings');
var locations = require('../src/repositories/locations');
var addresses = require('../src/repositories/addresses');
var users = require('../src/repositories/users');
var places = require('../src/repositories/places');




router.get('/price', async function (req, res) {

  const location = await locations.getById(req.query.locationId);

  if (location != null) {
    return res.json(await parkings.getAllPrice({ locationId: req.query.locationId }))
  }

  res.json(await parkings.getAllPrice());
});


router.get('/', async function (req, res, next) {
  if (req.query.locationId) {
    return res.json(await parkings.getAll({ locationId: req.query.locationId }))
  }
  res.json(await parkings.getAll());
});



router.get('/:id', async function (req, res) {
  let parking = await parkings.getByIdPrice(req.params.id);

  if (parking) {
    return res.json(parking)
  }

  res.status(404).end()

})


/*POST*/
router.post('/', async function (req, res, next) {


  if (!req.body.name) {
    return res.status(400).json({
      "message": "MISSING_NAME",
      "description": "El parámetro name no se encuentra"

    })
  }

  if (!req.body.userId) {
    return res.status(400).json({
      "message": "MISSING_USER_ID",
      "description": "El parámetro userID no se encuentra"
    });

  }

  if (!req.body.farePerHour) {
    return res.status(400).json({
      "message": "MISSING_FARE_PARE_HOUR",
      "description": "El parámetro farePerHour no se encuentra"
    });
  }

  if (!req.body.openHour) {
    return res.status(400).json({
      "message": "MISSING_OPEN_HOUR",
      "description": "El parámetro openHour no se encuentra"
    });
  }

  if (!req.body.closeHour) {
    return res.status(400).json({
      "message": "MISSING_CLOSE_HOUR",
      "description": "El parámetro closeHour no se encuentra"
    });
  }



  if (!req.body.fullCapacity) {
    return res.status(400).json({
      "message": "MISSING_FULL_CAPACITY",
      "description": "El parámetro fullCapacity no se encuentra"
    });
  }

  const parkingUser = await users.getById(req.body.userId)

  if (!parkingUser) {
    return res.status(400).json({
      "message": "INVALID_USER",
      "description": "Unregistered user"
    })
  }


  if (req.body.farePerHour < 0) {
    return res.status(400).json({
      "message": "INVALID_FARE_PER_HOUR",
      "description": "El valor debe ser mayor a 0"
    });

  }

  if (req.body.openHour < 0 || req.body.openHour > 23) {
    return res.status(400).json({
      "message": "INVALID_OPEN_HOUR",
      "description": "Valor permitido de 0 a 23"
    });

  }

  if (req.body.closeHour < 0 || req.body.closeHour > 23) {
    return res.status(400).json({
      "message": "INVALID CLOSE HOUR",
      "description": "Valor permitido de 0 a 23"
    });

  }


  if (req.body.fullCapacity < 0) {
    return res.status(400).json({
      "message": "INVALID_FULL_CAPACITY_VALUE",
      "description": "El valor debe ser mayor a 0"
    });

  }

  if (!req.body.streetName) {
    return res.status(400).json({
      "message": "MISSING_STREET_NAME",
      "description": "El parámetro streetName no se encuentra"

    })
  }

  if (!req.body.streetNumber) {
    return res.status(400).json({
      "message": "MISSING_STREET_NUMBER",
      "description": "El parámetro streetNumber no se encuentra"

    })

  }

  if (!req.body.locationId) {
    return res.status(400).json({
      "message": "MISSING_LOCATION_ID",
      "description": "El parámetro locationId no se encuentra"
    });

  }

  if (req.body.streetNumber < 0) {
    return res.status(400).json({
      "message": "INVALID_STREET_NUMBER_VALUE",
      "description": "El parámetro streetNumber debe ser mayor a 0"

    })

  }

  let parkingAddress;
  const parkingLocation = await locations.getById(req.body.locationId)

  if (!parkingLocation) {
    return res.status(400).json({
      "message": "INVALID_LOCATION",
      "description": "Unregistered location"
    })
  }

  if (await addresses.exist(req.body.streetName, req.body.streetNumber, req.body.locationId)) {
    return res.status(400).json({
      "message": "DUPLICATED_ADDRESS",
      "description": "There is an address with this values that already exist"
    })
  }

  try {
    parkingAddress = await addresses.save(req.body.streetName, req.body.streetNumber, req.body.locationId)
  }

  catch (e) {
    console.log(e)
    //Si le envio un res.status() ---> me va a tirar un error de “Can’t set headers after they are sent to the client 


  }

  const addressParkingId = parkingAddress


  try {
    let saved = await parkings.save(req.body.name, addressParkingId.id, /*reemplazarlo por la const parkingAddress*/
      req.body.userId, req.body.farePerHour, req.body.openHour, req.body.closeHour, req.body.fullCapacity, req.body.extraInfo)

    await places.savePlaces(saved.fullCapacity, saved.id)

    res.status(201).json({ "message": saved });

  } catch (e) {
    console.log(e)
    res.status(500).json({ "message": "error" });
  }


});


router.patch('/editFarePerHour', async function (req, res, next) {

  if (!req.body.id) {
    return res.status(400).json({
      "message": "MISSING_PARKING_ID",
      "description": "El id del parking no se encuentra"
    });

  }

  if (!req.body.farePerHour) {
    return res.status(400).json({
      "message": "MISSING_FARE_PER_HOUR",
      "description": "El parámetro farePerHour no se encuentra"
    });
  }

  if (req.body.farePerHour < 0) {
    return res.status(400).json({
      "message": "INVALID_FARE_PER_HOUR",
      "description": "El valor debe ser mayor a 0"
    });

  }

  let parkingAModificar = await parkings.getByIdPrice(req.body.id);

  if (!parkingAModificar) {
    return res.status(400).json({ "message": "PARKING_NOT_FOUND" })
  }


  try {

    await parkings.updateFare(req.body.id, req.body.farePerHour)
    res.status(200).json({ "message": "VALUE_IS_NOW_UPDATED" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ "message": "FAILED_UPDATE" })

  }

});


router.patch('/editOpenHour', async function (req, res, next) {

  if (!req.body.id) {
    return res.status(400).json({
      "message": "MISSING_PARKING_ID",
      "description": "El id del parking no se encuentra"
    });

  }

  if (!req.body.openHour) {
    return res.status(400).json({
      "message": "MISSING_OPEN_HOUR",
      "description": "El parámetro openHour no se encuentra"
    });
  }

  if (req.body.openHour < 0 || req.body.openHour > 23) {
    return res.status(400).json({
      "message": "INVALID OPEN HOUR",
      "description": "Valor permitido de 0 a 23"
    });

  }

  let parkingAModificar = await parkings.getByIdPrice(req.body.id);

  if (!parkingAModificar) {
    return res.status(400).json({ "message": "PARKING_NOT_FOUND" })
  }


  try {

    await parkings.updateOpenH(req.body.id, req.body.openHour)
    res.status(200).json({ "message": "OPEN_HOUR_HAS_BEEN_UPDATED" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ "message": "FAILED_UPDATE" })

  }

});


router.patch('/editCloseHour', async function (req, res, next) {

  if (!req.body.id) {
    return res.status(400).json({
      "message": "MISSING_PARKING_ID",
      "description": "El id del parking no se encuentra"
    });

  }

  if (!req.body.closeHour) {
    return res.status(400).json({
      "message": "MISSING_CLOSE_HOUR",
      "description": "El parámetro closeHour no se encuentra"
    });
  }

  if (req.body.closeHour < 0 || req.body.closeHour > 23) {
    return res.status(400).json({
      "message": "INVALID_CLOSE_HOUR",
      "description": "Valor permitido de 0 a 23"
    });

  }

  let parkingAModificar = await parkings.getByIdPrice(req.body.id);

  if (!parkingAModificar) {
    return res.status(400).json({ "message": "PARKING_NOT_FOUND" })
  }


  try {

    await parkings.updateCloseH(req.body.id, req.body.closeHour)
    res.status(200).json({ "message": "CLOSE_HOUR_HAS_BEEN_UPDATED" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ "message": "FAILED_UPDATE" })

  }

});



module.exports = router;