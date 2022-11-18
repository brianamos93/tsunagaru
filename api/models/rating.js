const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
	rating: {
		type: Number,
		required: true
	},
	beer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Beer'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
})

ratingSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Rating', ratingSchema)