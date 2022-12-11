const { Place, Parking } = require('../../db/models')

const includeParking = {
    model: Parking,
    attributes: {
        exclude: ['updatedAt', 'createdAt']
    },
}

async function getAll() {
    return await Place.findAll({
        attributes: ['id'],
        include: [includeParking]
    })
}

async function getById(id) {
    return await Place.findByPk(id, {
        attributes: ['id'],
        include: [includeParking]
    })
}

async function getByIdOld(id) {
    return await Place.findByPk(id, {
        attributes: {
                 exclude: ["createdAt"]
         },
         include: [
            {
                "model": Parking,
                attributes: {
                    exclude: ["createdAt"]
                }
            }
         ]
     })
}

async function savePlaces(capacity, parkingId) {
    for (let i = 0; i < capacity; i++) {
        await save(parkingId);
    }
}

async function save(parkingId) {
    return await Place.create({
        parkingId
    })
}

module.exports = {
    getAll,
    getById,
    savePlaces,
    getByIdOld
}