const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Beer = require('../models/beer')

beforeEach(async () => {
	await Beer.deleteMany({})

	let beerObject = new Beer(helper.initialBeers[0])
	await beerObject.save()

	beerObject = new Beer(helper.initialBeers[1])
	await beerObject.save()
})

test('beers are returned as json', async () => {
	await api
		.get('/api/beers')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('beers are returned as json', async () => {
	await api
		.get('/api/beers')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('all beers are returned', async () => {
	const res = await api.get('/api/beers')

	expect(res.body).toHaveLength(helper.initialBeers.length)
})

test('a specific beer is within the returned notes', async () => {
	const res = await api.get('/api/beers')

	const beername = res.body.map(r => r.name)

	expect(beername).toContain(
		'testbeername2'
	)
})

test('a vaild beer can be added', async () => {
	const newBeer = {
		name: 'testbeername3',
		brewery: 'testbrewery1',
		style: 'IPL',
		abv: 8,
		ibu: 30,
		color: 'blue',
		producedNow: true
	}

	await api
		.post('/api/beers')
		.send(newBeer)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const beersAtEnd = await helper.beersInDb()
	expect(beersAtEnd).toHaveLength(helper.initialBeers.length + 1)

	const beername = beersAtEnd.map(n => n.name)

	expect(beername).toContain(
		'testbeername3'
	)
})

test('beer without required data is not added', async () => {
	const newBeer = {
		style: 'Red Ale'
	}

	await api
		.post('/api/beers')
		.send(newBeer)
		.expect(400)

	const beersAtEnd = await helper.beersInDb()

	expect(beersAtEnd).toHaveLength(helper.initialBeers.length)
})

afterAll(() => {
	mongoose.connection.close()
})