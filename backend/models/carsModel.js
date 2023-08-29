// {
//     "title": "Honda",
//     "year": "2023",
//     "color": "white",
//     "price": "30000"
// }

const { model, Schema } = require('mongoose');

const carsSchema = new Schema({
  title: {
    type: String,
    required: [true, 'DB: Title is required'],
  },
  year: {
    type: Number,
    default: 2010,
  },
  color: {
    type: String,
    default: 'white',
  },
  price: {
    type: Number,
    required: [true, 'DB: Price is required'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  }
});

module.exports = model('cars', carsSchema);
