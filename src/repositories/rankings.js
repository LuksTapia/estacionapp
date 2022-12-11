const { Ranking, Booking, Parking, Sequelize } = require('../../db/models')


const rankingQuery = {
    attributes: ['id', 'calification']
}

const includeBooking = {
    model: Booking,
    attributes: {
        exclude: ['updatedAt', 'createdAt']
    },
}

async function getAll(params = {}) {
    if (!params.bookingId) {
        return await Ranking.findAll({
            attributes: rankingQuery.attributes,
            include: [includeBooking]
        })
    }
    let rankingBooking = await Ranking.findOne({
        where: {
            bookingId: params.bookingId
        }
    })

    if (rankingBooking) {
        query = {
            where: {},
            attributes: rankingQuery.attributes,
            include: [includeBooking]
        }

        if (params.bookingId) {
            query.where.bookingId = params.bookingId
        }
        return await Ranking.findAll(query)
    }
}

async function getAverage() {
    return await Ranking.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('calification')), 'calification'],],
        order: Sequelize.literal('calification DESC'),
        include: {
            model: Booking,
            attributes: ['parkingId'],
            required: true,
            include: {
                model: Parking,
                attributes: ['name'],
                required: true,
            }
        },
        group: ['parkingId'],
    })
}

async function getById(id) {
    return await Ranking.findByPk(id, {
        attributes: rankingQuery.attributes,
        include: [includeBooking]
    }
    )
}

async function save(calification, bookingId) {
    return await Ranking.create({
        calification,
        bookingId,
    })
}

async function exists(bookingId) {
    return await Ranking.findOne({
        where: {
            bookingId: bookingId,
        }
    })
}

module.exports = {
    getAll,
    getById,
    save,
    exists,
    getAverage,
}