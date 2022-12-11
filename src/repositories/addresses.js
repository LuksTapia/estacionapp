const {Address} = require('../../db/models')
const {Location} = require('../../db/models')


async function getById(id) {
    return await Address.findByPk(id,{
        attributes: ['streetName','streetNumber'],
        include: [{
            model: Location,
            attributes:['locationName']
    }]
        
})
}
/*
async function obtenerPorId(params = {}) {
    return await Address.findAll({
 
            where: {
                locationId: params
            }
        })

}*/

//al repositorio no le importa si el dato es hardcodeado o dinámico.
async function save(streetName,streetNumber,locationId) {

    
    return await Address.create ({
        streetName,
        streetNumber,
        locationId
    })
    

}





async function exist(streetName, streetNumber, locationId) {
    return await Address.findOne({
        where: {
            locationId,
            streetName,
            streetNumber,
        }

    })
}


async function getAllById(parametro){
    return await Address.findAll({
        where: {
            locationId: parametro
        },
    })

}



async function getAll() {
    return await Address.findAll({
        attributes: ['streetName','streetNumber'],
        include: [{
            model: Location,
            attributes:['locationName']
    }]
        
})

}

module.exports = {
    getById,
    getAll,
    getAllById,
    save,
    exist,
    
}


