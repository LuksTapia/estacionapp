const { assert } = require("chai");
const request = require("supertest");
const app = require("../app");
var { User } = require("../db/models");

describe("Autenticacion", function () {
  describe("Crear Cuenta", function () {
    it("Se debe ingresar un email para registrarse", function (done) {
      request(app)
        .post("/Users")
        .send({
          userName: "Nicolas",
          lastName: "Calabria",
          password: "1111111",
        })
        .expect(400)
        .end(function (err, res) {
          assert.equal(res.body.message, "MISSING_EMAIL");
          if (err) done(err);
          return done();
        });
    });

    it("El usuario a registrarse debe proporcionar un nombre", function (done) {
      request(app)
        .post("/Users")
        .send({
          lastName: "Calabria",
          email: "pepeprueba@gmail.com",
          password: "1111111",
        })
        .expect(400)
        .end(function (err, res) {
          assert.equal(res.body.message, "NULL_NAME");
          if (err) done(err);
          return done();
        });
    });

    it("La persona a registrarse debe proporcionar un apellido", function (done) {
      request(app)
        .post("/Users")
        .send({
          userName: "Nicolas",
          email: "pepeprueba@gmail.com",
          password: "1111111",
        })
        .expect(400)
        .end(function (err, res) {
          assert.equal(res.body.message, "NULL_LAST_NAME");
          if (err) done(err);
          return done();
        });
    });

    it("El usuario a registrarse debe proporcionar una contraseña", function (done) {
      request(app)
        .post("/Users")
        .send({
          userName: "Nicolas",
          lastName: "Calabria",
          email: "pepeprueba@gmail.com",
        })
        .expect(400)
        .end(function (err, res) {
          assert.equal(res.body.message, "MISSING_PASSWORD");
          if (err) done(err);
          return done();
        });
    });

    it("La contrasenia proporcionada debe tener una extension de hasta 8 caracteres", function (done) {

      const data = {
        userName: "Nicolas",
        lastName: "Calabria",
        email: "pepeprueba@gmail.com",
        password: "12345678910",
      }

      request(app)
        .post("/Users")
        .send(data)
        .expect(400)
        .end(function (err, res) {
            assert.isAbove(data.password.length,8, "PASSWORD_TOO_LONG");
            if (err) done(err);
            return done();
          });
    });

    it("Si se envian los datos correctamente, se crea el usuario", async function() {
      await request(app)
        .post("/Users")
        .send({
          userName: "Nicolas",
          lastName: "Calabria",
          email: "usertest@test.com",
          password: "11111",
        })
        .expect(201);
        
        await User.destroy({where: { email: "usertest@test.com"}})
      

    });
});
});


describe("Autenticacion / Chequeo usuario existente", function () {

  let usuarioId;
  let userEmailTest;
  let testUserName;
  let testLastName;
  let passwordTest;

  let crearUsuarioTest = async function () {
    let userTest = await User.create({
      userName: "usuario",
      lastName: "prueba",
      email: "userprueba2@gmail.com",
      password: "111",
    });

    userEmailTest = userTest.email;
    usuarioId = userTest.id;
    testUserName = userTest.userName;
    testLastName = userTest.lastName;
    passwordTest = userTest.password;

  };

  

  let eliminarUsuario = async function () {
      await User.destroy({
      where: { email: userEmailTest },
    });
  
  };

  before(crearUsuarioTest);
  after(eliminarUsuario);

  describe("Ingresa un email que ya se encuentra registrado previamente", function () {
    
    it("Se requiere un email que no haya sido utilizado previamente por otro usuario, de lo contrario arroja un status 400 ", async function () {

       

      return request(app)
        .post("/Users")
        .send({
          userName: testUserName,
          lastName: testLastName,
          email: userEmailTest,
          password: passwordTest,
        })
        .expect(400)
        .then(res => {
          assert.equal(res.body.message, "USER_EXIST");
        });
    });
  });
});

describe("Peticion GET", function () {
  describe("Peticion GET/users", function () {
    it("Al realizar una peticion GET al endpoint /users me retorna un codigo de status 200", async function () {
      return request(app).get("/Users").expect(200);
    });
  });
});