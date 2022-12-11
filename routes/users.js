var express = require('express');
var router = express.Router();
var User = require('../src/repositories/users')



 router.get('/', async function(req, res, next) {
  res.json(await User.getAll());
}); 


router.get('/:id', async function(req, res) {
     let user = await User.getById(req.params.id)
     if(user){
         return res.json(user)
     }
     //Devuelvo error si no existe
     res.status(404).end()
     
  });
  

router.post('/', async function (req,res,next){

  if(req.body.email == undefined ){
    return res.status(400).json({
      "message" : "MISSING_EMAIL",
      "description" : "se debe ingresar un email",
    })
  }

    let userEmail = await User.exist(req.body.email)


    if(userEmail != null){
      return res.status(400).json({
        "message" : "USER_EXIST",
        "description" : "El usuario ya existe",
      })
    }

    if(req.body.userName == null ){
      return res.status(400).json({
        "message" : "NULL_NAME",
        "description" : "se debe ingresar un nombre",
      })
    }


    if(req.body.lastName == null){
      return res.status(400).json({
        "message" : "NULL_LAST_NAME",
        "description" : "se debe ingresar un apellido",
      })
    }

    if(req.body.password == null ){
      return res.status(400).json({
        "message" : "MISSING_PASSWORD",
        "description" : "Es necesaria un password para dar de alta un usuario",
      })
    }

    if(req.body.password.length >8){
      return res.status(400).json({
        "message" : "PASSWORD_TOO_LONG",
        "description" : "El password no debe superar los 8 caracteres",
      })
    }


    try{

      let usuarioAGuardar = await User.save(req.body.userName,req.body.lastName,req.body.email,req.body.password)
      res.status(201).json({ "message" : usuarioAGuardar});
    } catch (e){
      res.status(404)
    }


}),



module.exports = router;