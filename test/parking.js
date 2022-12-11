const { assert } = require('chai');
const { after } = require('mocha');
const request = require('supertest')
const app = require('../app')
const { Parking, Address, User, Location, Place } = require('../db/models')


describe('POST Parking', function () {

    describe('URL /parkings test', function () {

        let idDeLocation;
        let idDelAddress;
        let idDelUser;

        let locationAddressUser = async function () {
            let location = await Location.create({
                "locationName": "Caballito"
            });

            let address = await Address.create({
                "streetName": "Planes",
                "streetNumber": 1010,
                "locationId": location.id
            });
            let user = await User.create({
                "userName": "Lucas",
                "lastName": "Hola",
                "email": "hola@hotmail.com",
                "password": "12345"
            });

            idDeLocation = location.id;
            idDelUser = user.id;
            idDelAddress = address.id;

        }

        let eliminarLocation = async function () {   
            await Location.destroy({where: {id : idDeLocation}})
        }

        let eliminarAddress = async function () {
            await Address.destroy({where: {id : idDelAddress}})
        }

        let eliminarUser = async function () {
            await User.destroy({where: {id : idDelUser}})

        }

        before(locationAddressUser);
        after(eliminarUser);
        after(eliminarAddress);
        after(eliminarLocation);

        it('Name required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "userId": idDelUser,
                    "farePerHour": 150,
                    "openHour": 1,
                    "closeHour": 22,
                    "fullCapacity": 1,
                    "streetName": "Planes",
                    "streetNumber": 1011,
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_NAME')
                });
        });

        it('UserId required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "name": "BuenDIA",
                    "farePerHour": 150,
                    "openHour": 1,
                    "closeHour": 22,
                    "fullCapacity": 1,
                    "streetName": "Planes",
                    "streetNumber": 1010,
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_USER_ID')
                });
        });

        it('FarePerHour required', async function () {
          
            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hola",
                    "userId": idDelUser,
                    "openHour": 1,
                    "closeHour": 22,
                    "fullCapacity": 1,
                    "streetName": "Gaona",
                    "streetNumber": 1000,
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_FARE_PARE_HOUR')
                });
        })

        it('OpenHour required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hola",
                    "userId": idDelUser,
                    "farePerHour": 150,
                    "closeHour": 22,
                    "fullCapacity": 35,
                    "streetName": "Gaona",
                    "streetNumber": 1000,
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_OPEN_HOUR')
                });

        })

        it('CloseHour required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hola",
                    "userId": idDelUser,
                    "farePerHour": 150,
                    "openHour": 22,
                    "fullCapacity": 35,
                    "streetName": "Gaona",
                    "streetNumber": 1000,
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_CLOSE_HOUR')
                });

        })

        it('FullCapacity required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hola",
                    "userId": idDelUser,
                    "farePerHour": 150,
                    "openHour": 2,
                    "closeHour": 15,
                    "streetName": "Gaona",
                    "streetNumber": 1000,
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_FULL_CAPACITY')
                });

        })

        it('StreetName required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hola",
                    "userId": idDelUser,
                    "farePerHour": 150,
                    "openHour": 2,
                    "closeHour": 15,
                    "fullCapacity": 35,
                    "streetNumber": 1000,
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_STREET_NAME')
                });

        })

        it('StreetNumber required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hola",
                    "userId": idDelUser,
                    "farePerHour": 150,
                    "openHour": 2,
                    "closeHour": 15,
                    "fullCapacity": 35,
                    "streetName": "Gaona",
                    "locationId": idDeLocation
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_STREET_NUMBER')
                });
        })

        it('LocationId required', async function () {

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hola",
                    "userId": idDelUser,
                    "farePerHour": 150,
                    "openHour": 2,
                    "closeHour": 15,
                    "fullCapacity": 35,
                    "streetName": "Gaona",
                    "streetNumber": 1010
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'MISSING_LOCATION_ID')
                });
        })

        let datosOblig = {name: "Hola",
        userId: idDelUser,
        streetName: "Gaona",
        locationId: idDeLocation}

        it('FarePerHour must be bigger than 0', async function () {

            const data = {
                datosOblig,
                farePerHour: -150,
                openHour: 9,
                closeHour: 22,
                fullCapacity: 10,
                streetNumber: 1010,
            }
            return request(app)
                .post('/parkings')
                .send(data)
                .expect(400)
                .then(res => {
                    assert.isBelow(data.farePerHour, 0, 'INVALID_FARE_PER_HOUR')
                });
        });

        it('OpenHour must be bigger than 0', async function () {

            const data = {
                datosOblig,
                farePerHour: 150,
                openHour: -9,
                closeHour: 22,
                fullCapacity: 10,
                streetNumber: 1010,

            }

            return request(app)
                .post('/parkings')
                .send(data)
                .expect(400)
                .then(res => {
                    assert.isBelow(data.openHour, 0, 'INVALID_OPEN_HOUR')
                });
        });

        it('OpenHour must be smaller than 23', async function () {

            const data = {
                datosOblig,
                farePerHour: 150,
                openHour: 29,
                closeHour: 22,
                fullCapacity: 10,
                streetNumber: 1010,
            }

            return request(app)
                .post('/parkings')
                .send(data)
                .expect(400)
                .then(res => {
                    assert.isAbove(data.openHour, 23, 'INVALID_OPEN_HOUR')
                });
        });

        it('CloseHour must be bigger than 0', async function () {

            const data = {
                datosOblig,
                farePerHour: 150,
                openHour: 9,
                closeHour: -9,
                fullCapacity: 10,
                streetNumber: 1010,
            }

            return request(app)
                .post('/parkings')
                .send(data)
                .expect(400)
                .then(res => {
                    assert.isBelow(data.closeHour, 0, 'INVALID_CLOSE_HOUR')
                });
        });

        it('CloseHour must be smaller than 23', async function () {

            const data = {
                datosOblig,
                farePerHour: 150,
                openHour: 2,
                closeHour: 29,
                fullCapacity: 10,
                streetNumber: 1010,
            }

            return request(app)
                .post('/parkings')
                .send(data)
                .expect(400)
                .then(res => {
                    assert.isAbove(data.closeHour, 23, 'INVALID_CLOSE_HOUR')
                });
        });

        it('FullCapacity must be bigger than 0', async function () {
            
            const data = {
                datosOblig,
                farePerHour: 150,
                openHour: 1,
                closeHour: 22,
                fullCapacity: -10,
                streetNumber: 1001,
            }
            return request(app)
                .post('/parkings')
                .send(data)
                .expect(400)
                .then(res => {
                    assert.isBelow(data.fullCapacity, 0, 'INVALID_FULL_CAPACITY')
                });
        });

        it('StreetNumber must be bigger than 0', async function () {
           
            const data = {
                datosOblig,
                openHour: 1,
                closeHour: 22,
                fullCapacity: 10,
                streetNumber: -1001, 
            }
            return request(app)
                .post('/parkings')
                .send(data)
                .expect(400)
                .then(res => {
                    assert.isBelow(data.streetNumber, 0, 'INVALID_STREET_NUMBER')
                });
        });


        it('Si envío un userId que no está en la BD, retorna un 400', async function () {

            let idNoExistente = idDelUser + 1;

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hol",
                    "userId": idNoExistente,
                    "farePerHour": 550,
                    "openHour": 9,
                    "closeHour": 22,
                    "fullCapacity": 5,
                    "streetName": "San Blas",
                    "streetNumber": 3050,
                    "locationId": idDeLocation,
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'INVALID_USER')
                });

        });

        it('Si envio un locationId que no existe, retorna un 400', async function () {

            let idLocationNoExiste =  idDeLocation + 1;

            return request(app)
                .post('/parkings')
                .send({
                    "name": "Hol",
                    "userId": idDelUser,
                    "farePerHour": 550,
                    "openHour": 9,
                    "closeHour": 22,
                    "fullCapacity": 5,
                    "streetName": "Vieytes",
                    "streetNumber": 3010,
                    "locationId": idLocationNoExiste,
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'INVALID_LOCATION')
                });

        });

        it('Si le envío los datos de un domicilio ya creado, me devuelve un 400', async function () {

            let addressNuevo = await Address.findOne({
                where: {
                    streetName: "Planes",
                    streetNumber: 1010
                }
            })

            await request(app)
                .post('/parkings')
                .send({
                    "name": "Dia",
                    "userId": idDelUser,
                    "farePerHour": 550,
                    "openHour": 9,
                    "closeHour": 22,
                    "fullCapacity": 5,
                    "streetName": addressNuevo.streetName,
                    "streetNumber": addressNuevo.streetNumber,
                    "locationId": addressNuevo.locationId,
                })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, 'DUPLICATED_ADDRESS')
                });

        })

        it('Parking created', async function () {

            await Parking.destroy({where: { "name": "Hol" }})

            await request(app)
                .post('/parkings')
                .send({
                    "name": "Hol",
                    "userId": idDelUser,
                    "farePerHour": 550,
                    "openHour": 9,
                    "closeHour": 22,
                    "fullCapacity": 1,
                    "streetName": "San Jorge",
                    "streetNumber": 1010,
                    "locationId": idDeLocation,
                })
                .expect(201)

                let park = await Parking.findOne({where: {"name": "Hol"}})
                await Place.destroy({where: {parkingId : park.id}})
                await Parking.destroy({where: { "name": "Hol" }})
                await Address.destroy({where: {"streetName": "San Jorge"}})

        })

    });

});

describe("GET Parkings Order by Price", function () {
    describe("Peticion GET /parkings/price", function () {
        it("/parkings/price returns status 200", async function () {
            return request(app).get("/parkings/price").expect(200);
        });
    });
});

describe('PATCH Parking', function () {

    let idDeLocation;
    let idDelAddress;
    let idDelUser;
    let idDeParking;

    let locationUserAddressParking = async function () {
        let location = await Location.create({
            "locationName": "Caballito"
        });

        let user = await User.create({
            "userName": "Lucas",
            "lastName": "Hola",
            "email": "hola@hotmail.com",
            "password": "12345"
        });

        let address = await Address.create({
            "streetName": "Planes",
            "streetNumber": 1010,
            "locationId": location.id
        });

        let parking = await Parking.create({
            "name": "TestPatch",
            "addressId" : address.id,
            "userId": user.id,
            "farePerHour": 550,
            "openHour": 9,
            "closeHour": 22,
            "fullCapacity": 5,
        });

        idDeParking = parking.id,
        idDeLocation = location.id,
        idDelAddress = address.id,
        idDelUser = user.id

    };

    let eliminarLocation = async function () {   
        await Location.destroy({where: {id : idDeLocation}})
    }

    let eliminarAddress = async function () {
        await Address.destroy({where: {id : idDelAddress}})
    }

    let eliminarUser = async function () {
        await User.destroy({where: {id : idDelUser}})

    }

    let eliminarParking = async function () {   
        await Parking.destroy({where: {id : idDeParking}})
    }

    before(locationUserAddressParking)
    after(eliminarLocation)
    after(eliminarAddress)
    after(eliminarUser)
    after(eliminarParking)


    describe('PATCH /parkings/editFarePerHour', function () {

        it('idParking required', async function () {
            return request(app)
            .patch('/parkings/editFarePerHour')
            .send({
                "farePerHour" : 900
            })
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'MISSING_PARKING_ID')
            });
        })

        it('farePerHour required', async function() {

            return request(app)
            .patch('/parkings/editFarePerHour')
            .send({"id" : idDeParking})
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'MISSING_FARE_PER_HOUR')
            });
        })
         
        it('invalid FarePerHour', async function() {

            const data = {
                id: idDeParking,
                farePerHour: -150,
            }

            return request(app)
            .patch('/parkings/editFarePerHour')
            .send(data)
            .expect(400)
            .then(res => {
                assert.isBelow(data.farePerHour, 0, 'INVALID_FARE_PER_HOUR')
            });

        })

        it('parking not found', async function() {

            let idParkingNoExistente = idDeParking +1;

            return request(app)
            .patch('/parkings/editFarePerHour')
            .send({
                "id" : idParkingNoExistente,
                "farePerHour" : 590
            })
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'PARKING_NOT_FOUND')
            });
        })

        it('success farePerHour Patch', async function() {

            return request(app)
            .patch('/parkings/editFarePerHour')
            .send({
                "id" : idDeParking,
                "farePerHour" : 590
            })
            .expect(200)
        })
    });

    describe('PATCH /parkings/editOpenHour', function () {

        it('idParking required', async function () {
            return request(app)
            .patch('/parkings/editOpenHour')
            .send({
                "openHour" : 9
            })
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'MISSING_PARKING_ID')
            });
        })

        it('openHour required', async function() {

            return request(app)
            .patch('/parkings/editOpenHour')
            .send({"id" : idDeParking})
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'MISSING_OPEN_HOUR')
            });
        })
         
        it('openHour must be bigger than 0', async function() {

            const data = {
                id: idDeParking,
                openHour: -1,
            }
            return request(app)
            .patch('/parkings/editOpenHour')
            .send(data)
            .expect(400)
            .then(res => {
                assert.isBelow(data.openHour, 0, 'INVALID OPEN HOUR')
            });

        })

        it('openHour must be smaller than 23', async function() {
            const data = {
                id: idDeParking,
                openHour: 26,
            }
            return request(app)
            .patch('/parkings/editOpenHour')
            .send(data)
            .expect(400)
            .then(res => {
                assert.isAbove(data.openHour, 23, 'INVALID OPEN HOUR')
            });

        })

        it('parking not found', async function() {

            let idParkingNoExistente = idDeParking +1;

            return request(app)
            .patch('/parkings/editOpenHour')
            .send({
                "id" : idParkingNoExistente,
                "openHour" : 9
            })
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'PARKING_NOT_FOUND')
            });
        })

        it('success openHour Patch', async function() {
            return request(app)
            .patch('/parkings/editOpenHour')
            .send({
                "id" : idDeParking,
                "openHour" : 3
            })
            .expect(200)
        })
    });

    describe('PATCH /parkings/editCloseHour', function () {

        it('idParking required', async function () {
            return request(app)
            .patch('/parkings/editCloseHour')
            .send({
                "closeHour" : 20
            })
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'MISSING_PARKING_ID')
            });
        })

        it('closeHour required', async function() {

            return request(app)
            .patch('/parkings/editCloseHour')
            .send({"id" : idDeParking})
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'MISSING_CLOSE_HOUR')
            });
        })
         
        it('closeHour must be bigger than 0', async function() {
            const data = {
                id: idDeParking,
                closeHour: -1,
            }
            return request(app)
            .patch('/parkings/editCloseHour')
            .send(data)
            .expect(400)
            .then(res => {
                assert.isBelow(data.closeHour, 0, 'INVALID_CLOSE_HOUR')
            });

        })

        it('closeHour must be smaller than 23', async function() {
            const data = {
                id: idDeParking,
                closeHour: 26,
            }
            return request(app)
            .patch('/parkings/editCloseHour')
            .send(data)
            .expect(400)
            .then(res => {
                assert.isAbove(data.closeHour, 23, 'INVALID_CLOSE_HOUR')
            });

        })

        it('parking not found', async function() {

            let idParkingNoExistente = idDeParking +1;

            return request(app)
            .patch('/parkings/editCloseHour')
            .send({
                "id" : idParkingNoExistente,
                "closeHour" : 22
            })
            .expect(400)
            .then(res => {
                assert.equal(res.body.message, 'PARKING_NOT_FOUND')
            });
        })

        it('success closeHour Patch', async function() {

            return request(app)
            .patch('/parkings/editCloseHour')
            .send({
                "id" : idDeParking,
                "closeHour" : 22
            })
            .expect(200)
        })
    });

});