const Beer = require('../models/beer')

const initialBeers = [
	{
		name: 'testbeername1',
		brewery: 'testbrewery',
		style: 'IPA',
		abv: 6,
		ibu: 40,
		color: 'yellow',
		producedNow: true
	},
	{
		name: 'testbeername2',
		brewery: 'testbrewery',
		style: 'IPA',
		abv: 6,
		ibu: 40,
		color: 'yellow',
		producedNow: false
	}
]

const nonExisitingId = async () => {
	const beer = new Beer({
		name: 'testbeername3',
		brewery: 'testbrewery',
		style: 'IPA',
		abv: 6,
		ibu: 40,
		color: 'yellow',
		producedNow: false
	})
	await beer.save()
	await beer.remove()

	return beer._id.toString()
}

const beersInDb = async () => {
	const beers = await Beer.find({})
	return beers.map(beer => beer.toJSON())
}

module.exports = {
	initialBeers, nonExisitingId, beersInDb
}