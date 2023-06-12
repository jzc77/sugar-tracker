const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  "id": { type: Number, unique: true },
  "name": { type: String },
  "foodEaten": [String],
  "quantity": [Number],
  "gramSugarPerServing": [Number],
  "__v": Number  // versionKey property set on each document when first created by Mongoose
})

module.exports = mongoose.model('childrenData', dataSchema)