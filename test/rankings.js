const { assert } = require("chai")
const superTest = require('supertest')
const app = require('../app')
const { Ranking, Booking, Parking, User, Address, Location, Vehicle, Place } = require('../db/models')

describe('Rankings', function () {

    let parkingPrueba;
    let vehiclePrueba1;
    let vehiclePrueba2;
    let bookingPrueba1;
    let bookingPrueba2;

    let tablasPruebas = async function () {

        let locationPrueba = await Location.create({
            "locationName": "locationPrueba"
        });

        let addressPrueba = await Address.create({
            "streetName": "addressPrueba",
            "streetNumber": 1234,
            "locationId": locationPrueba.id
        });

        let userPrueba = await User.create({
            "userName": "Gabriel",
            "lastName": "Arce",
            "email": "prueba@prueba.com",
            "password": "123456"
        });

        parkingPrueba = await Parking.create({
            "name": "parkingPrueba",
            "addressId": addressPrueba.id,
            "userId": userPrueba.id,
            "farePerHour": 1,
            "openHour": 1,
            "closeHour": 22,
            "fullCapacity": 1,
            "extraInfo": null
        })

        vehiclePrueba1 = await Vehicle.create({
            "patent": "AAA111",
            "userId": userPrueba.id
        })

        vehiclePrueba2 = await Vehicle.create({
            "patent": "AAA222",
            "userId": userPrueba.id
        })

        let placePrueba = await Place.create({
            "parkingId": parkingPrueba.id
        })

        var incomeTo = new Date();
        bookingPrueba1 = await Booking.create({
            "vehicleId": vehiclePrueba1.id,
            "incomeTo": incomeTo,
            "parkingId": parkingPrueba.id,
            "placeId": placePrueba.id
        })

        bookingPrueba2 = await Booking.create({
            "vehicleId": vehiclePrueba2.id,
            "incomeTo": incomeTo,
            "parkingId": parkingPrueba.id,
            "placeId": placePrueba.id
        })
    }

    let eliminarLocation = async function () {
        await Location.destroy({
            where: {
                locationName: "locationPrueba"
            }
        })
    }

    let eliminarAddress = async function () {
        await Address.destroy({
            where: {
                streetName: "addressPrueba",
                streetNumber: 1234
            }
        })
    }

    let eliminarUser = async function () {
        await User.destroy({
            where: {
                email: "prueba@prueba.com"
            }
        })
    }

    let eliminarPlace = async function () {
        await Place.destroy({
            where: {
                parkingId: parkingPrueba.id
            }
        })
    }

    let eliminarParking = async function () {
        await Parking.destroy({
            where: {
                name: "parkingPrueba"
            }
        })
    }

    let eliminarVehicle = async function () {
        await Vehicle.destroy({
            where: {
                patent: "AAA111"
            }
        })
        await Vehicle.destroy({
            where: {
                patent: "AAA222"
            }
        })
    }

    let eliminarBooking = async function () {
        await Booking.destroy({
            where: {
                parkingId: parkingPrueba.id,
                vehicleId: vehiclePrueba1.id
            }

        })

        await Booking.destroy({
            where: {
                parkingId: parkingPrueba.id,
                vehicleId: vehiclePrueba2.id
            }

        })
    }

    let eliminarRanking = async function () {
        await Ranking.destroy({
            where: {
                bookingId: bookingPrueba2.id
            }
        })
        await Ranking.destroy({
            where: {
                bookingId: bookingPrueba1.id
            }
        })
    }

    before(tablasPruebas);
    after(async () => {
        await eliminarLocation();
        await eliminarAddress();
        await eliminarUser();
        await eliminarPlace();
        await eliminarRanking();
        await eliminarBooking();
        await eliminarParking();
        await eliminarVehicle();
    });

    describe('Calificar a una reserva - NEGATIVO', function () {

        it('Requiere un valor de calification entre 1 y 5', async function () {
            return superTest(app)
                .post('/rankings/save')
                .send({
                    calification: "7",
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'INVALID_CALIFICATION')
                })
        })

        it('Requiere un valor de bookingId valido', async function () {
            return superTest(app)
                .post('/rankings/save')
                .send({
                    calification: "5",
                    bookingId: "",
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'INVALID_BOOKING')
                })
        })

        it('Requiere un booking existente', async function () {

            let idBookingNoExistente = bookingPrueba2.id + 1;

            return superTest(app)
                .post('/rankings/save')
                .send({
                    calification: "3",
                    bookingId: idBookingNoExistente
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'UNREGISTERED_BOOKING')
                })
        })

        it('Un booking calificado no puede volver a calificarse', async function () {

            await Ranking.create({
                "calification": "1",
                "bookingId": bookingPrueba1.id
            })

            return superTest(app)
                .post('/rankings/save')
                .send({
                    calification: "1",
                    bookingId: bookingPrueba1.id,
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'CALIFICATION_EXISTS')
                })
        })

        it('Un booking no puede ser calificado si el vehiculo sigue estacionado', async function () {

            return superTest(app)
                .post('/rankings/save')
                .send({
                    calification: "2",
                    bookingId: bookingPrueba2.id,
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'PARKED_BOOKING')
                })
        })

    })

    describe('Calificar una reserva - POSITIVO', function () {

        it('Calificacion exitosa', async function () {

            let egressTo = new Date();
            await Booking.update({
                "egressTo": egressTo
            }, {
                where: {
                    vehicleId: vehiclePrueba2.id,
                    parkingId: parkingPrueba.id
                }
            })

            return superTest(app)
                .post('/rankings/save')
                .send({
                    calification: "2",
                    bookingId: bookingPrueba2.id
                })
                .expect(201)
        })
    })

    describe('Recibiendo un id de ranking', function () {

        it('GetById rankings - NEGATIVE', async function () {

            var ranking = await Ranking.create({
                "calification": "5",
                "bookingId": bookingPrueba2.id
            })

            let idRankingInexistente = ranking.id + 1;

            return superTest(app)
                .get('/rankings/id')
                .query({ id: idRankingInexistente })
                .expect(404)
        })

        it('GetById rankings - POSITIVE', async function () {

            let ranking = await Ranking.findOne({
                where: {
                    bookingId: bookingPrueba2.id
                }
            })

            return superTest(app)
                .get('/rankings/id')
                .query({ id: ranking.id })
                .expect(200)
        })

    })

    describe('Recibiendo un bookingId por query', function () {

        it('GetAll rankings - NEGATIVE', async function () {

            let idBookingNoExistente = bookingPrueba2.id + 1;

            return superTest(app)
                .get('/rankings')
                .query({ bookingId: idBookingNoExistente })
                .expect(404)
        })

        it('GetAll rankings - POSITIVE', async function () {

            return superTest(app)
                .get('/rankings')
                .query({ bookingId: bookingPrueba2.id })
                .expect(200)
        })
    })
})