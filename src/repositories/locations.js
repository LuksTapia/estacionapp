const {Location} = require('../../db/models')

const queryAttributes = { 
    attributes: {
    exclude: ['updatedAt','createdAt', 'id']
    }}

async function getById(id) {
    return await Location.findByPk(id,{
        attributes: queryAttributes.attributes
    })
}
async function getAll(params = {} ) {
    let query = {
        where: {},
        attributes: queryAttributes.attributes
    }
    if(params.locationName){
        query.where.locationName = params.locationName
    }
    return await Location.findAll(query)
}
//NO ES LOGICA DE NEGOCIO:
//Las location son provistas por el sistema y no pueden crearse ni modificarse
/*
async function save(locationName){
    return await Location.create({
        locationName,
    })
}
*/
async function exist(locationName) {
    return await Location.findOne({
        where : {
            locationName: locationName
        },
        attributes: queryAttributes.attributes
    })
}

module.exports = {
    getById,
    getAll,
    exist
}