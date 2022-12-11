const {assert} = require ('chai')
const request = require('supertest')
const app = require('../app')
var {User,Location, Address, Parking} = require('../db/models')

describe('/GET', function(){
    describe('/GET by locationId', function(){
        
        let idLocation;

        let createDataTesting = async function () {
            let location = await Location.create({
                "locationName": "TestLocationName"
            });

            let addressTest=await Address.create({
                "streetName": "testAddress",
                "streetNumber": 6465,
                "locationId": location.id,
            });

            let userTest =await User.create({
                "userName": "Nicolas",
                "lastName": "Calabria",
                "email": "testParkingLocation@test.com",
                "password": "123456"
            });

            await Parking.create({
            "name": "TestParking",
            "addressId": addressTest.id,
            "userId": userTest.id,
            "farePerHour": 150,
            "openHour": 1,
            "closeHour": 22,
            "fullCapacity": 35,
            });
            
            idLocation = location.id
        }

        let deleteLocation = async function () {
            await Location.destroy({where: {locationName: "TestLocationName"}})
        }

        let deleteAddress = async function () {
            await Address.destroy({where: {
                    streetName: "testAddress",
                    streetNumber: 6465
                }
            })
        }

        let deleteUser = async function () {
            await User.destroy({where: {email: "testParkingLocation@test.com"}})
        }

        let deleteParking = async function(){
            await Parking.destroy({ where: {name: "TestParking"}})
        }

        before(createDataTesting);
        after(deleteLocation);
        after(deleteAddress);
        after(deleteUser);
        after(deleteParking);

        it('Si envio un locationId por query String me devuelve los parking con la locationId indicada', async function (){
            
            return request(app)
                .get('/Parkings')
                .query({locationId: idLocation})
                .then( res =>{
                    assert.equal(res.body[0].Address.Location.id,idLocation);
                })
        })
    })
})