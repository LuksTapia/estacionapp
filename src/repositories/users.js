const { User, Vehicle } = require('../../db/models')



async function getById(id) {
    return await User.findByPk(id, {
        attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
        },
        include: [{
            model: Vehicle,
            attributes: ['patent', 'userId'],

        }]
    })
}

async function getAll() {
    return await User.findAll({
        attributes: ['userName', 'lastName', 'email'],
        include: [{
            model: Vehicle,
            attributes: ['patent', 'userId'],

        }]
    })
}

async function save(userName, lastName, email, password) {

    return await User.create({
        userName,
        lastName,
        email,
        password

    })
}

async function exist(email) {
    return await User.findOne({ where: { email: email } })
}

module.exports = {
    getById,
    getAll,
    save,
    exist
}

