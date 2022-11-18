const mongoose = require('mongoose')

const beerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	brewery: {
		type: String,
		required: true
	},
	style: {
		type: String,
	},
	abv: Number,
	ibu: Number,
	color: {
		type: String,
		required: true
	},
	producedNow: {
		type: Boolean,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
})

beerSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Beer', beerSchema)