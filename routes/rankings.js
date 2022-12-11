var express = require('express');
const ranking = require('../db/models/ranking');
var router = express.Router();
var rankings = require('../src/repositories/rankings');
var bookings = require('../src/repositories/bookings');

/*GET_AVERAGE*/
router.get('/average', async function (req, res) {
  res.json(await rankings.getAverage())
});

/*GET_ALL*/
router.get('/', async function (req, res, next) {
  if (req.query.bookingId) {
    let ranking = await rankings.getAll({ bookingId: req.query.bookingId })
    if (ranking) {
      return res.json(ranking)
    }
    return res.status(404).end()
  }
  res.json(await rankings.getAll())
});

/*GET_BY_ID*/
router.get('/id/', async function (req, res) {
  let ranking = await rankings.getById(req.query.id)
  if (ranking) {
    return res.json(ranking)

  }
  res.status(404).end()
});



/*POST*/
router.post('/save', async function (req, res, next) {

  // Valido si el parametro calification esta comprendido entre 1 y 5
  if (req.body.calification < 1 || req.body.calification > 5) {
    return res.status(400).json({
      "message": "INVALID_CALIFICATION",
      "descripcion": "El parametro calification es invalido"
    })
  }

  // Valido si el parametro bookingId no es nulo o vacio
  if (!req.body.bookingId) {
    return res.status(400).json({
      "message": "INVALID_BOOKING",
      "descripcion": "El parametro bookingId es invalido"
    })
  }

  const reqBooking = await bookings.getById(req.body.bookingId)

  // Valido si el bookingId que viene por body existe en la tabla bookings
  if (!reqBooking) {
    return res.status(400).json({
      "message": "UNREGISTERED_BOOKING",
      "descripcion": "no existe el booking"
    })
  }

  // Valido si ya existe una calificacion con ese bookingId
  if (await rankings.exists(req.body.bookingId)) {
    return res.status(400).json({
      "message": "CALIFICATION_EXISTS",
      "descripcion": "La calification ya existe"
    })
  }

  // Valido si el vehiculo ya salio del parking para poder calificar la experiencia
  if (!reqBooking.egressTo) {
    return res.status(400).json({
      "message": "PARKED_BOOKING",
      "descripcion": "El vehiculo sigue estacionado."
    })
  }

  try {
    let saved = await rankings.save(req.body.calification, req.body.bookingId)
    res.status(201).json({ "message": saved });
  } catch (e) {
    res.status(500).json({ "messaje": "error" });
  }

});

module.exports = router;