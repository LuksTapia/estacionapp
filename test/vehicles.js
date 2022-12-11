const { assert } = require("chai");
const request = require("supertest");
const app = require("../app");
var { Vehicle, User } = require("../db/models");

describe("Vehicles", function () {
  describe("creacion vehicle/Validaciones", function () {

    let userTestId;
    let userTestEmail;
    let testPatent;

    let crearUsuarioVehiculoTest = async function(){
      let userCreado= await User.create({
      userName: "usuario",
      lastName: "testing",
      email: "usertesting@gmail.com",
      password: "111",
      });
  
      let testVehicle = await Vehicle.create({
        patent: "TEST123",
        userId: userCreado.id,
        
      });

      userTestId=userCreado.id;
      userTestEmail= userCreado.email;
      testPatent= testVehicle.patent;
    };
  
  
    let eliminarVehiculoTest = async function () {
     await Vehicle.destroy({where: { patent: testPatent}})
    };
  
    let eliminarUsuarioTest = async function (){
      await User.destroy({where: { email: userTestEmail }});
    }
  
    before(crearUsuarioVehiculoTest);
    after(eliminarVehiculoTest);
    after(eliminarUsuarioTest);
  
    
    it("Se requiere ingresar una patente para la creacion de un vehiculo", async function () {

      
      
      return request(app)
        .post("/vehicles")
        .send({
          userId: userTestId,
        })
        .expect(400)
        .then(res => {
          assert.equal(res.body.message, 'MISSING_PATENT')
      })
    });

    it("Se requiere que al enviar una patente con un largo menor a 6 caracteres no permita dar de alta un vehiculo", async function () {

      const data ={
        userId: userTestId,
        patent: "12345",
      }
      
      return request(app)
        .post("/vehicles")
        .send(data)
        .expect(400)
        .then(res => {
          assert.isBelow(data.patent.length,6, 'INVALID_SHORT_PATENT')
      })
    });

    it("Se requiere que al enviar una patente con un largo mayor a 7 caracteres no permita dar de alta un vehiculo", async function () {
      
      

      const data ={
        userId: userTestId,
        patent: "12345678",
      }
      
      return request(app)
        .post("/vehicles")
        .send(data)
        .expect(400)
        .then(res => {
          assert.isAbove(data.patent.length,7, 'INVALID_LARGE_PATENT')
      })
    });
  
    it("Se requiere validar que no exista un vehiculo con la patente ingresada", async function () {
      
      
  
      return request(app)
        .post("/vehicles")
        .send({
          patent: testPatent,
          userId: userTestId,
        })
        .expect(400)
        .then(res => {
          assert.equal(res.body.message, 'PATENT_EXIST')
      })
    });

    it("Se requiere proporcionar un id de usuario para dar de alta un vehiculo", async function () {
  
      return request(app)
        .post("/vehicles")
        .send({
          patent: "TESTPAT", 
        })
        .expect(400)
        .then(res => {
          assert.equal(res.body.message, 'MISSING_ID')
      })
    });

    it("Se requiere proporcionar un id de usuario existente para dar de alta un vehiculo", async function () {
  
      let invalidUserId = userTestId+1

      return request(app)
        .post("/vehicles")
        .send({
          patent: "TESTPAT", 
          userId: invalidUserId
        })
        .expect(400)
        .then( function (res) {
          assert.equal(res.body.message, 'MISSING_USER')
      })
      
    });

    it("Se requiere que al enviar datos validos, se cree el vehiculo y retorne un status 201", async function () {
    

      await request(app)
        .post("/vehicles")
        .send({
          patent: "TESTPAT", 
          userId: userTestId
        })
        .expect(201);


      
      await Vehicle.destroy({where: {patent: "TESTPAT"} });


    
    })
})
})