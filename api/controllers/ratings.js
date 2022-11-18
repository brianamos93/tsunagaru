const ratingsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Rating = require('../models/rating')
const User = require('../models/user')
const beer = require('../models/beer')

const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

ratingsRouter.get('/', async (req, res) => {
	const ratings = await Rating
		.find({}).populate('user', { username: 1, name: 1 })
	res.json(ratings)
})

ratingsRouter.get('/:id', async (req, res) => {
	const rating = await Rating.findById(req.params.id)
	if (rating) {
		res.json(rating)
	} else {
		res.status(404).end()
	}
})

ratingsRouter.post('/', async (req, res) => {
	const body = req.body
	const token = getTokenFrom(req)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if(!decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	const rating = new Rating({
		rating: body.rating,
		beer: beer._id,
		user: user._id
	})

	const savedRating = await rating.save()
	user.ratings = user.ratings.concat(savedRating._id)
	await user.save()

	res.json(savedRating)

})

ratingsRouter.delete('/:id', async (req, res) => {
	const token = getTokenFrom(req)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	const ratingsearch = await Rating.findById(req.params.id, { _id: 0, user: 1 }).exec()
	const ratinguserid = ratingsearch.user.toString()
	const userid = decodedToken.id
	if (ratinguserid === userid) {
		await Rating.findByIdAndRemove(req.params.id)
		res.status(204).end()
	} else if (!decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' })
	} else if (ratingsearch.user === null) {
		return res.status(401).json({ error: 'Rating does not exist.' })
	} else {
		return res.status(401).json({ error: 'Error' })
	}
})

ratingsRouter.put('/:id', async (req, res, next) => {
	const body = req.body

	const rating = {
		rating: body.rating
	}

	Rating.findByIdAndUpdate(req.params.id, rating, { new: true })
		.then(updatedRating => {
			res.json(updatedRating)
		})
		.catch(error => next(error))
	const token = getTokenFrom(req)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	const userid = decodedToken.id
	const ratingsearch = await Rating.findById(req.params.id, { _id: 0, user: 1 }).exec()
	const ratinguserid = ratingsearch.user.toString()
	if (ratinguserid === userid) {
		Rating.findByIdAndUpdate(req.params.id, rating, { new: true })
			.then(updatedRating => {
				res.json(updatedRating)
			})
	} else {
		res.status(404).end()
	}
})

module.exports = ratingsRouter