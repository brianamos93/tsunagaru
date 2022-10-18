const beersRouter = require('express').Router()
const Beer = require('../models/beer')

beersRouter.get('/', (req, res) => {
	Beer.find({}).then(beers => {
		res.json(beers)
	})
})

beersRouter.get('/:id', (req, res, next) => {
	Beer.findById(req.params.id)
		.then(beer => {
			if (beer) {
				res.json(beer)
			} else {
				res.status.apply(404).end()
			}
		})
		.catch(error => next(error))
})

beersRouter.post('/', (req, res, next) => {
	const body = req.body

	const beer = new Beer({
		name: body.name,
		brewery: body.brewery,
		style: body.style,
		abv: body.abv,
		ibu: body.ibu,
		color: body.color,
		producedNow: body.producedNow || true
	})

	beer.save()
		.then(savedBeer => {
			res.json(savedBeer)
		})
		.catch(error => next(error))
})

beersRouter.delete('/:id', (req, res, next) => {
	Beer.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
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
