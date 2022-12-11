const { assert } = require('chai')
const request = require('supertest')
const app = require('../app')
const { Location } = require('../db/models');

const idError = 9999;
const locationNameTest = "Location Test";

describe('Locations', function () {
    let datosBeforeTest = async function () {
        console.log("**********COMIENZO LOCATION**********");
        await Location.create({
            locationName: locationNameTest
        })
    }
    let eliminarLocationsTest = async function () {
        console.log("**********FIN LOCATION**********");
        var location = await Location.findOne({
            where: {locationName: locationNameTest}
        })
        if(location){
            await location.destroy()
        }
    }
    before(datosBeforeTest);
    after(eliminarLocationsTest);

    describe('GET/locations/:id ', function () {
        it('Requiere una Location Registrada [Error 404 Not Found]', async function () {
            return request(app)
                .get('/locations/' + idError)
                .then(res => {
                    assert.equal(res.status, 404);
                })
        })
        it('Recibo una Location Registrada [ById Location]', async function () {
            var location = await Location.findOne({
                where: { locationName: locationNameTest }
            })
            return request(app)
                .get('/locations/' + location.id)
                .then(res => {
                    assert.equal(res.status, 200);
                })
        })
    })
    describe('GET/locations ', function () {
        it('Recibo una Location Registrada [QUERY: locationName]', async function () {
            return request(app)
                .get('/locations')
                .query({ locationName: locationNameTest })
                .then(res => {
                    assert.equal(res.status, 200);
                })
        })
        it('Recibo las Locations del sistema [System Locations]', async function () {
            return request(app)
                .get('/locations')
                .then(res => {
                    assert.equal(res.status, 200);
                })
        })
    })
})