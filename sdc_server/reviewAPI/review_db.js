const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/review-db',  { maxPoolsize: 10 })
  .then(result => console.log(`Connected to ${result.connections[0]._connectionString}`, result.connections[0].models))
  .catch(error => console.log(error))

const ReviewPhotosSchema = new Schema({
  url: String
});
mongoose.model('Photo', ReviewPhotosSchema);

const ReviewSchema = new Schema({
  product_id: Number,
  rating: Number,
  recommend: Boolean,
  response: String,
  summary: String,
  body: String,
  date: Date,
  reviewer_name: String,
  reviewer_email: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [{
    type: Schema.Types.ObjectId,
    ref: 'Photos'
  }]
});
mongoose.model('Review', ReviewSchema);

const MetadataSchema = new Schema({
  product_id: Number,
  Recommended: {
    false: Number,
    true: Number,
  },
  Ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  Characteristics: {
    Size: {
      value: Number
    },
    Width: {
      value: Number
    },
    Comfort: {
      value: Number
    },
    Quality: {
      value: Number
    },
    Fit: {
      value: Number
    },
    Length: {
    value: Number
    }
  }
})

mongoose.model('MetaData', MetadataSchema);