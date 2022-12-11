const { assert } = require('chai')
const request = require('supertest')
const app = require('../app')
const { Booking, Parking, Vehicle, Place } = require('../db/models');

const idError = 9999;
const vehiclePatentTest = "ABC123";
const parkingNameTest = "Estacionamiento Test";
const userId = 0;
const addressId = 0;

describe('Bookings', async function () {
    let parkingId
    let placeId
    let vehicleId
    let datosBeforeTest = async function () {
        var parkingCreado = await Parking.create({
            name: parkingNameTest,
            addressId: addressId,
            userId: userId,
            farePerHour: 150,
            openHour: 1,
            closeHour: 22,
            fullCapacity: 1,
            extraInfo: "Extra Info Planes",
        });
        var placeCreado = await Place.create({
            parkingId: parkingCreado.id
        })
        var vehicleCreado = await Vehicle.create({
            patent: vehiclePatentTest,
            userId: userId,
        })
        parkingId = parkingCreado.id;
        vehicleId = vehicleCreado.id;
        placeId = placeCreado.id;
    }
    before(datosBeforeTest);
    after(async function () {
        await Parking.destroy({
            where: { id: parkingId },
        })
        await Place.destroy({
            where: { id: placeId },
        })
        await Vehicle.destroy({
            where: { id: vehicleId },
        })
    });
    describe('POST/bookings [Vehicle IncomeTo Parking]', function () {
        after(async function () {
            await Booking.destroy({
                where: { vehicleId: vehicleId },
            })
        });
        it('Requiere un id de Vehiculo para crear un booking [MISSING_VEHICLE_ID]', async function () {
            return request(app)
                .post('/bookings')
                .send({ parkingId: parkingId, placeId: placeId })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "MISSING_VEHICLE_ID");
                })
        })
        it('Requiere un id de Parking para crear un booking [MISSING_PARKING_ID]', async function () {
            return request(app)
                .post('/bookings')
                .send({ vehicleId: vehicleId, placeId: placeId })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "MISSING_PARKING_ID");
                })
        })
        it('Requiere un id de Place para crear un booking [MISSING_PLACE_ID]', async function () {
            return request(app)
                .post('/bookings')
                .send({ vehicleId: vehicleId, parkingId: parkingId })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "MISSING_PLACE_ID");
                })
        })
        it('Requiere un Vehiculo Registrado para crear un booking [UNREGISTERED_VEHICLE]', async function () {
            return request(app)
                .post('/bookings')
                .send({ vehicleId: idError, parkingId: parkingId, placeId: placeId })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "UNREGISTERED_VEHICLE");
                })
        })
        it('Requiere un Place Registrado para crear un booking [UNREGISTERED_PLACE]', async function () {
            return request(app)
                .post('/bookings')
                .send({ vehicleId: vehicleId, parkingId: parkingId, placeId: idError })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "UNREGISTERED_PLACE");
                })
        })
        it('Requiere un Parking Registrado para crear un booking [UNREGISTERED_PARKING]', async function () {
            return request(app)
                .post('/bookings')
                .send({ vehicleId: vehicleId, parkingId: idError, placeId: placeId })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "UNREGISTERED_PARKING");
                })
        })
        describe('Before/After [INVALID_PLACE]', function () {
            var placeError
            before(async function () {
                placeError = await Place.create({
                    parkingId: idError
                })
            })
            after(async function () {
                await placeError.destroy()
            })
            it('El Place debe tener una asociacion con el Parking [INVALID_PLACE]', async function () {
                return request(app)
                    .post('/bookings')
                    .send({ vehicleId: vehicleId, parkingId: parkingId, placeId: placeError.id })
                    .expect(400)
                    .then(res => {
                        assert.equal(res.body.message, "INVALID_PLACE");
                    })
            })
        })
        describe('Before/After [DUPLICATE_VEHICLE_BOOKING]', function () {
            var booking
            var placeAdicional
            before(async function () {
                var incomeTo = new Date()
                booking = await Booking.create({
                    vehicleId: vehicleId,
                    incomeTo: incomeTo,
                    parkingId: parkingId,
                    placeId: placeId
                })
                placeAdicional = await Place.create({
                    parkingId: parkingId
                })
            })
            after(async function () {
                await placeAdicional.destroy()
                await booking.destroy()
            })
            it('El Vehicle no debe estar en otro Booking activo [DUPLICATE_VEHICLE_BOOKING]', async function () {
                return request(app)
                    .post('/bookings')
                    .send({ vehicleId: vehicleId, parkingId: parkingId, placeId: placeAdicional.id })
                    .expect(400)
                    .then(res => {
                        assert.equal(res.body.message, "DUPLICATE_VEHICLE_BOOKING");
                    })
            })
        })
        describe('Before/After [DUPLICATE_PLACE_BOOKING]', function () {
            var booking
            var vehicleAdicional
            before(async function () {
                var incomeTo = new Date();
                booking = await Booking.create({
                    vehicleId: vehicleId,
                    incomeTo: incomeTo,
                    parkingId: parkingId,
                    placeId: placeId
                })
                vehicleAdicional = await Vehicle.create({
                    patent: "DEF456",
                    userId: userId
                })
            })
            after(async function () {
                await vehicleAdicional.destroy()
                await booking.destroy()
            })
            it('El Place no debe estar en otro Booking activo [DUPLICATE_PLACE_BOOKING]', async function () {
                return request(app)
                    .post('/bookings')
                    .send({ vehicleId: vehicleAdicional.id, parkingId: parkingId, placeId: placeId })
                    .expect(400)
                    .then(res => {
                        assert.equal(res.body.message, "DUPLICATE_PLACE_BOOKING");
                    })
            })
        })
        describe('Before/After [PARKING_WITHOUT_CAPACITY]', function () {
            var placeAdicional
            var vehicleAdicional
            var booking
            before(async function () {
                placeAdicional = await Place.create({
                    parkingId: parkingId
                })
                vehicleAdicional = await Vehicle.create({
                    patent: "GHI789",
                    userId: userId
                })
                var incomeTo = new Date();
                booking = await Booking.create({
                    vehicleId: vehicleId,
                    incomeTo: incomeTo,
                    parkingId: parkingId,
                    placeId: placeId
                })
            })
            after(async function () {
                await placeAdicional.destroy();
                await Vehicle.destroy({ where: { id: vehicleAdicional.id } });
                await booking.destroy();
            })
            it('El Parking debe tener disponibilidad [PARKING_WITHOUT_CAPACITY]', async function () {
                return request(app)
                    .post('/bookings')
                    .send({ vehicleId: vehicleAdicional.id, parkingId: parkingId, placeId: placeAdicional.id })
                    .expect(400)
                    .then(res => {
                        assert.equal(res.body.message, "PARKING_WITHOUT_CAPACITY");
                    })
            })
        })
        describe('Before/After [BOOKING_REGISTERED]', function () {
            it('El Booking es creado [BOOKING_REGISTERED]', async function () {
                return request(app)
                    .post('/bookings')
                    .send({ vehicleId: vehicleId, parkingId: parkingId, placeId: placeId })
                    .then(res => {
                        assert.equal(res.status, 201);
                    })
            })
        })
    })
    describe('GET/bookings ', function () {
        let booking
        before(async function () {
            var incomeTo = new Date();
            booking = await Booking.create({
                vehicleId: vehicleId,
                incomeTo: incomeTo,
                parkingId: parkingId,
                placeId: placeId
            })
        })
        after(async function () {
            await Booking.destroy({
                where: { id: booking.id },
            })
        });
        it('Requiere un Parking Registrado para obtener los bookings [UNREGISTERED_PARKING]', async function () {
            return request(app)
                .get('/bookings')
                .query({ parkingId: idError })//POR QUERY y NO POR BODY
                .then(res => {
                    assert.equal(res.status, 400);
                })
        })
        it('Recibo los Bookings activos del Parking [QUERY: Parking Active Bookings]', async function () {
            return request(app)
                .get('/bookings')
                .query({ parkingId: parkingId })//POR QUERY y NO POR BODY
                .then(res => {
                    assert.equal(res.status, 200);
                })
        })
        it('Requiere un Vehiculo Registrado para obtener un booking [UNREGISTERED_VEHICLE]', async function () {
            return request(app)
                .get('/bookings')
                .query({ patent: idError })//POR QUERY y NO POR BODY
                .then(res => {
                    assert.equal(res.status, 400);
                })
        })
        it('Recibo el Booking activo del Vehiculo [QUERY: Vehicle Active Booking]', async function () {
            return request(app)
                .get('/bookings')
                .query({ patent: vehiclePatentTest })//POR QUERY y NO POR BODY
                .then(res => {
                    assert.equal(res.status, 200);
                })
        })
        it('Recibo los Bookings activos [System Active Booking]', async function () {
            return request(app)
                .get('/bookings')//SIN PARAMETROS
                .then(res => {
                    assert.equal(res.status, 200);
                })
        })
    })
    describe('PATCH/bookings [Vehicle egressTo Parking]', function () {
        it('Requiere un id de Vehiculo para editar un booking [MISSING_VEHICLE_ID]', async function () {
            return request(app)
                .patch('/bookings')
                .send({})
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "MISSING_VEHICLE_ID");
                })
        })
        it('Requiere un Vehiculo Registrado para editar un booking [UNREGISTERED_VEHICLE]', async function () {
            return request(app)
                .patch('/bookings')
                .send({ vehicleId: idError })
                .expect(400)
                .then(res => {
                    assert.equal(res.body.message, "UNREGISTERED_VEHICLE");
                })
        })
        describe('Before/After [MISSING_VEHICLE_ACVTIVE_BOOKING]', function () {
            var booking
            before(async function () {
                var incomeTo = new Date();
                var egressTo = new Date();
                booking = await Booking.create({
                    vehicleId: vehicleId,
                    incomeTo: incomeTo,
                    egressTo: egressTo,//Marco el booking como inactivo
                    parkingId: parkingId,
                    placeId: placeId
                })
            })
            after(async function () {
                await Booking.destroy({
                    where: { id: booking.id },
                })
            })
            it('Requiere un Vehiculo Registrado para editar un booking [MISSING_VEHICLE_ACVTIVE_BOOKING]', async function () {
                return request(app)
                    .patch('/bookings')
                    .send({ vehicleId: vehicleId })
                    .expect(400)
                    .then(res => {
                        assert.equal(res.body.message, "MISSING_VEHICLE_ACVTIVE_BOOKING");
                    })
            })
        })
        describe('Before/After [MISSING_VEHICLE_ACVTIVE_BOOKING]', function () {
            var booking
            before(async function () {
                var incomeTo = new Date();
                booking = await Booking.create({
                    vehicleId: vehicleId,
                    incomeTo: incomeTo,
                    parkingId: parkingId,
                    placeId: placeId
                })
            })
            after(async function () {
                await Booking.destroy({
                    where: { id: booking.id },
                })
            })
            it('El Booking es modificado [BOOKING_EGRESS_MODIFIED]', async function () {
                return request(app)
                    .patch('/bookings')
                    .send({ vehicleId: vehicleId })
                    .then(res => {
                        assert.equal(res.status, 201);
                    })
            })
        })
    })
})