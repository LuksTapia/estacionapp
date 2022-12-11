const { assert } = require("chai")
const superTest = require('supertest')
const app = require('../app')
const { Place, Parking, User, Address, Location } = require('../db/models')


describe('Places', function () {

    let buscarParking

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

        buscarParking = await Parking.create({
            "name": "parkingPrueba",
            "addressId": addressPrueba.id,
            "userId": userPrueba.id,
            "farePerHour": 1,
            "openHour": 1,
            "closeHour": 22,
            "fullCapacity": 1,
            "extraInfo": null
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
                parkingId: buscarParking.id
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

    before(tablasPruebas);
    after(async () => {
        await eliminarLocation();
        await eliminarAddress();
        await eliminarUser();
        await eliminarPlace();
        await eliminarParking();
    });


    describe('Crear los places del parking - NEGATIVO', function () {

        it('Requiere un valor de capacidad mayor a 0', async function () {
            return superTest(app)
                .post('/places/save')
                .send({
                    capacity: "-1",
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'INVALID_FULL_CAPACITY')
                })
        })

        it('Requiere un valor de parkingId valido', async function () {

            return superTest(app)
                .post('/places/save')
                .send({
                    capacity: "10",
                    parkingId: "",
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'INVALID_PARKING')
                })
        })

        it('Requiere un parking existente', async function () {

            let idParkingInexistente = buscarParking.id + 1;

            return superTest(app)
                .post('/places/save')
                .send({
                    capacity: "20",
                    parkingId: idParkingInexistente,
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'UNREGISTERED_PARKING')
                })
        })

    })

    describe('Crear los places del parking- POSITIVO', function () {

        it('Calificacion exitosa', async function () {

            return superTest(app)
                .post('/places/save')
                .send({
                    capacity: "1",
                    parkingId: buscarParking.id
                })
                .expect(201)
        })

    })

    describe('Get places recibiendo un id existente', function () {

        let placePrueba
        let crearPlace = async function () {
            placePrueba = await Place.create({
                "parkingId": buscarParking.id
            })
        }
        before(crearPlace);

        it('Get places - NEGATIVE', async function () {

            idPlaceInexistente = placePrueba.id + 1;

            return superTest(app)
                .get('/places/id')
                .query({ id: idPlaceInexistente })
                .expect(404)
        })

        it('Get places - POSITIVE', async function () {

            return superTest(app)
                .get('/places/id')
                .query({ id: placePrueba.id })
                .expect(200)
        })
    })

})