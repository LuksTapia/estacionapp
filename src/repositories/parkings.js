const {
    where
} = require('sequelize')
const {
    Parking,
    Sequelize
} = require('../../db/models')
const {
    User
} = require('../../db/models')
const {
    Address
} = require('../../db/models')
const {
    Location
} = require('../../db/models')
const {
    Op
} = require("sequelize");

const parkingQuery = {
    attributes: ['name', 'farePerHour', 'openHour', 'closeHour', 'fullCapacity', 'extraInfo']
}

const includeUser = {
    model: User,
    attributes: ['userName', 'lastName']
}

const queryAttributes = { 
    attributes: {
    exclude: ['updatedAt','createdAt','UserId','id','AddressId']
    }}


async function getById(id) {
    return await Parking.findByPk(id,{
        attributes: {
            exclude: ['updatedAt','createdAt','UserId','id','AddressId']
        },
        include: [{
            model: User,
            attributes:['userName','lastName']
        },{
            model: Address,
            attributes:['streetName','streetNumber'],
            include: [{
                model: Location,
                attributes:['locationName']

            }]
        } ]
        
})

}

async function getAll(params ={}) {

    let locationQuery = {
        model: Location,
        attributes:['id','locationName']
    }

    let adressQuery = {
        model: Address,
        where: { },
        attributes:['streetName','streetNumber'],
        include: [locationQuery]
    }

    let query = {
        where:{},
        attributes: queryAttributes.attributes,
        include: [adressQuery]
    }

    if (params.locationId){
        adressQuery.where.locationId = params.locationId
    }


    return await Parking.findAll(query)
        
    
}

async function getByIdPrice(id) {
    return await Parking.findByPk(id, {
        attributes: parkingQuery.attributes,
        include: [
            includeUser,
            {
                model: Address,
                attributes: ['streetName', 'streetNumber'],
                include: [{
                    model: Location,
                    attributes: ['locationName']
                }]
            }
        ]
    })

}


async function getAllPrice(params = {}) {
    let locationQuery = {
        model: Location,
        attributes: ['locationName'],
        required: true,
    }

    let addressQuery = {
        model: Address,
        attributes: ['streetName', 'streetNumber'],
        required: true,
        where: {
        },
        include: [locationQuery]
    }

    let query = {
        attributes: parkingQuery.attributes,
        order: [
            ['farePerHour', 'ASC']
        ],
        include: [
            addressQuery
        ]
    }

    if (params.locationId) {
        addressQuery.where.locationId = params.locationId
    }

    return await Parking.findAll(query);
}


async function save(name, addressId, userId, farePerHour, openHour, closeHour, fullCapacity, extraInfo) {
    return await Parking.create({
        name,
        addressId, //address.id
        userId,
        farePerHour,
        openHour,
        closeHour,
        fullCapacity,
        extraInfo
    })
}


async function exist(addressId) {

    return await Address.getByIdPrice(addressId)

    
}

async function updateFare(id, newfare){


    await Parking.update(
        { farePerHour: newfare},
        {where : {id:id}
 })
}


async function updateOpenH(id, newOpenH){


    await Parking.update(
        { openHour: newOpenH},
        {where : {id:id}
 })
}


async function updateCloseH(id, newCloseH){


    await Parking.update(
        { closeHour: newCloseH},
        {where : {id:id}
 })
}

async function getByIdOld(id) {
    return await Parking.findByPk(id, {/* 2022-10-09 */
        attributes: {
            exclude: ["createdAt"]
        },
        include: [Address]
        })
}

module.exports = {
    getAllPrice,
    save,
    getByIdPrice,
    exist,
    updateFare,
    updateOpenH,
    updateCloseH,
    getById,
    getAll,
    getByIdOld

}