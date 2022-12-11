const {Vehicle} = require ('../../db/models')
const {User} = require('../../db/models')


async function getById (id){
    return await Vehicle.findByPk(id, {
        attributes: {
                 exclude: ["createdAt", "updatedAt","UserId", "userId"]
         },
         include: [
            {
                model: User,
                attributes: {
                    include: ["userName","lastName"],
                    exclude:["email","password","createdAt", "updatedAt"]
                }
            }
         ]
     })
}


async function getAll(){
    return await Vehicle.findAll({
        attributes: {
                 exclude: ["createdAt", "updatedAt","UserId", "userId"]
         },
         include: [
            {
                model: User,
                attributes: {
                    include: ["userName","lastName"],
                    exclude:["email","password","createdAt", "updatedAt"]
                }
            }
         ]
     })
}

async function exist (patent){
    
    return await Vehicle.findOne({ where: {patent : patent} })

}

async function save(patent,userId){

    return await Vehicle.create({
        patent,
        userId,

    })

}


async function exist (patent){
    
    return await Vehicle.findOne({ where: {patent : patent} })

}



module.exports = {
    getById,
    getAll,
    save,
    exist,
}