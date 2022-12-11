const { DATE } = require('sequelize')
const { Booking, Parking, Vehicle } = require('../../db/models')
const { Op } = require("sequelize")

const queryAttributes = {
    attributes: {
        exclude: ['updatedAt', 'createdAt', 'VehicleId', 'ParkingId', 'PlaceId']
    }
}

const includeParking = {
    model: Parking,
    attributes: ['name']
}

const includeVehicle = {
    model: Vehicle,
    attributes: ['patent'],
}

async function getById(id) {//GET Booking: http://localhost:3000/bookings/2
    return await Booking.findByPk(id, {
        attributes: queryAttributes.attributes,
        include: [includeParking, includeVehicle]
    })
}

async function getAll(params = {}) {
    let query = {
        where: {
            egressTo: null
        },
        attributes: queryAttributes.attributes,
        include: [includeParking, includeVehicle]
    }
    if (params.parkingId) {//GET Parking Active Bookings: http://localhost:3000/bookings?parkingId=1
        query.where.parkingId = params.parkingId
    }
    if (params.vehicleId) {//GET Vehicle Active Booking: http://localhost:3000/bookings?patent=abc123
        query.where.vehicleId = params.vehicleId
    }
    return await Booking.findAll(query)//GET Active Bookings: http://localhost:3000/bookings
}

async function countBusy(parkingId) {//Para contar los Places ocupados
    let busyPlaces = await getBusyPlaces(parkingId)
    return busyPlaces.length
}

async function getBusyPlaces(parkingId) {//Para obtener Places ocupados en el Parking
    return await Booking.findAll({
        where: {// SELECT * FROM bookings WHERE parkingId = 1 AND egressTo is null
            [Op.and]: [
                { parkingId: parkingId },
                { egressTo: { [Op.is]: null } }
            ]
        }
    })
}

async function vehicleEntry(vehicleId, parkingId, placeId) {//Ingreso Vehiculo
    let incomeTo = new Date();
    return await Booking.create({//POST bookings: http://localhost:3000/bookings/ + body
        vehicleId,
        incomeTo,
        parkingId,
        placeId
    })
}

async function vehicleEgress(vehicleId) {//Egreso Vehiculo
    let egressTo = new Date();
    await Booking.update({//PATCH bookings: http://localhost:3000/bookings/ + body
        egressTo: egressTo,
    }, {
        where: {// select * FROM bookings WHERE vehicleId = 2 AND egressTo is null
            [Op.and]: [
                { vehicleId: vehicleId },
                { egressTo: { [Op.is]: null } }
            ]
        }
    })
    return egressTo
}

async function parkedVehicle(vehicleId) {//Valido si Vehicle ya esta estacionado
    return await Booking.findOne({
        where: {// select * FROM bookings WHERE vehicleId = 2 AND egressTo is null
            [Op.and]: [
                { vehicleId: vehicleId },
                { egressTo: { [Op.is]: null } }
            ]
        }
    })
}

async function existBooking(vehicleId, parkingId) {//(DEPRECADO)Utilizado por Ranking para confirmar que el usuario estuvo en el parking
    return await Booking.findOne({
        where: {// select * FROM bookings WHERE vehicleId = 2 AND egressTo is null
            [Op.and]: [
                { vehicleId: vehicleId },
                { parkingId: parkingId },
                { egressTo: { [Op.not]: null } }
            ]
        }
    })
}

async function busyPlace(placeId) {//Valido si hay otro Vehicle en el Place
    return await Booking.findOne({
        where: {// select * FROM bookings WHERE placeId = 2 AND egressTo is null
            [Op.and]: [
                { placeId: placeId },
                { egressTo: { [Op.is]: null } }
            ]
        }
    })
}

module.exports = {
    getById,
    getAll,
    countBusy,
    getBusyPlaces,
    vehicleEntry,
    vehicleEgress,
    parkedVehicle,
    busyPlace,
    existBooking
}