const beersRouter = require('express').Router()
const Beer = require('../models/beer')
const User = require('../models/user')

beersRouter.get('/', async (req, res) => {
	const beers = await Beer.find({})
	res.json(beers)
})

beersRouter.get('/:id', async (req, res) => {
	const beer = await Beer.findById(req.params.id)
	if (beer) {
		res.json(beer)
	} else {
		res.status(404).end()
	}
})

beersRouter.post('/', async (req, res) => {
	const body = req.body

	const user = await User.findById(body.userId)

	const beer = new Beer({
		name: body.name,
		brewery: body.brewery,
		style: body.style,
		abv: body.abv,
		ibu: body.ibu,
		color: body.color,
		producedNow: body.producedNow || true,
		user: user._id
	})

	const savedBeer = await beer.save()
	user.beers = user.beers.concat(savedBeer._id)
	await user.save()

	res.json(savedBeer)

})

beersRouter.delete('/:id', async (req, res) => {
	await Beer.findByIdAndRemove(req.params.id)
	res.status(204).end()
})

beersRouter.put('/:id', (req, res, next) => {
	const body = req.body

	const beer = {
		name: body.name,
		brewery: body.brewery,
		style: body.style,
		abv: body.abv,
		ibu: body.ibu,
		color: body.color,
		producedNow: body.producedNow
	}

	Beer.findByIdAndUpdate(req.params.id, beer, { new: true })
		.then(updatedBeer => {
			res.json(updatedBeer)
		})
		.catch(error => next(error))
})

module.exports = beersRouter