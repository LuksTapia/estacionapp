var express = require('express');
var router = express.Router();
var bookings = require('../src/repositories/bookings');
var vehicles = require('../src/repositories/vehicles');
var parkings = require('../src/repositories/parkings');
var places = require('../src/repositories/places');

router.get('/', async function (req, res, next) {
    if (req.query.parkingId) {
        let bookingParking = await parkings.getByIdOld(req.query.parkingId)//Metodo del repo Parking(Lucas)
        if (!bookingParking) {
            return res.status(400).json({ "message": "UNREGISTERED_PARKING" })
        }
        return res.json(await bookings.getAll({ parkingId: bookingParking.id }))//Parking Active Bookings
    }
    if (req.query.patent) {
        let bookingVehicle = await vehicles.exist(req.query.patent)//Metodo del repo Vehicle(Nico)
        if (!bookingVehicle) {
            return res.status(400).json({ "message": "UNREGISTERED_VEHICLE" })
        }
        return res.json(await bookings.getAll({ vehicleId: bookingVehicle.id }))//Vehicle Active Booking
    }
    res.json(await bookings.getAll());//Active Bookings
});

router.get('/:id', async function (req, res) {
    let booking = await bookings.getById(req.params.id)
    if (booking) {
        return res.json(booking)
    }
    res.status(404).end()
});

router.post('/', async function (req, res, next) {
    if (!req.body.vehicleId) {
        return res.status(400).json({ "message": "MISSING_VEHICLE_ID" })
    }
    if (!req.body.parkingId) {
        return res.status(400).json({ "message": "MISSING_PARKING_ID" })
    }
    if (!req.body.placeId) {
        return res.status(400).json({ "message": "MISSING_PLACE_ID" })
    }
    const bookingParking = await parkings.getByIdOld(req.body.parkingId)//Metodo del repo Parking(Lucas)
    const bookingPlace = await places.getByIdOld(req.body.placeId)//Metodo del repo Place(Gabi)
    const bookingVehicle = await vehicles.getById(req.body.vehicleId)//Metodo del repo Vehicle(Nico)
    if (!bookingVehicle) {
        return res.status(400).json({ "message": "UNREGISTERED_VEHICLE" })
    }
    if (!bookingPlace) {
        return res.status(400).json({ "message": "UNREGISTERED_PLACE" })
    }
    if (!bookingParking) {
        return res.status(400).json({ "message": "UNREGISTERED_PARKING" })
    }
    if (bookingPlace.parkingId != bookingParking.id) {//Valido si el Place es del Parking
        return res.status(400).json({ "message": "INVALID_PLACE" })
    }
    if (await bookings.parkedVehicle(bookingVehicle.id)) {//Valido si Vehicle ya esta estacionado
        return res.status(400).json({ "message": "DUPLICATE_VEHICLE_BOOKING" })
    }
    if (await bookings.busyPlace(bookingPlace.id)) {//Valido si hay otro Vehicle en el Place
        return res.status(400).json({ "message": "DUPLICATE_PLACE_BOOKING" })
    }
    if (await bookings.countBusy(bookingParking.id) >= bookingParking.fullCapacity) {//Valido si el Parking esta completo
        return res.status(400).json({ "message": "PARKING_WITHOUT_CAPACITY" })
    }
    try {//Ingreso Vehicle
        let saved = await bookings.vehicleEntry(req.body.vehicleId, req.body.parkingId, req.body.placeId)
        res.status(201).json({ "BOOKING_REGISTERED: ": saved });
    } catch (e) {
        console.log(e);
        res.status(500).json({ "message": e })
    }
});

router.patch('/', async function (req, res, next) {
    if (!req.body.vehicleId) {
        return res.status(400).json({ "message": "MISSING_VEHICLE_ID" })
    }
    const BookingVehicle = await vehicles.getById(req.body.vehicleId)//Metodo del repo Vehicle(Nico)
    if (!BookingVehicle) {
        return res.status(400).json({ "message": "UNREGISTERED_VEHICLE" })
    }
    if (!await bookings.parkedVehicle(BookingVehicle.id)) {//!Valido si Vehicle ya esta estacionado
        return res.status(400).json({ "message": "MISSING_VEHICLE_ACVTIVE_BOOKING" })
    }
    try {//Egreso Vehicle
        let egressTo = await bookings.vehicleEgress(req.body.vehicleId)
        res.status(201).json({
            "BOOKING_EGRESS_MODIFIED: ": BookingVehicle.patent,
            "egressTo": egressTo
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ "message": e })
    }
});

module.exports = router;