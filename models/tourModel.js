/* eslint-disable */
const mongoose = require('mongoose');
const slugify = require('slugify');
//const User = require('./userModel');
//const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      /* validate: [
        validator.isAlpha,
        'Tour name must only contain characters'
      ]*/
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 //4.66666. 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only points to current doc on New documento creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [{
      date: {
          type: Date,
          required: [true, 'A tour must have a start date']
      },
      participants: {
          type: Number,
          default: 0
      },
      soldOut: {
          type: Boolean,
          default: false
      }
  }],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    //Child Referencing
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//tourSchema.index({ price: -1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

//DOCUMENT MIDDLEWARE: runs befor .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true }); //"this" is the currently processed document
  next();
});

/*Embedding
tourSchema.pre('save', async function(next) {
  const guidesPromises = this.guides.map(async id => await User.findById(id));
  //Promise.all devolve uma única Promise quando todas as promises do argumento iterável forem resolvidas
  this.guides = await Promise.all(guidesPromises);

  next();
});*/

/*
tourSchema.pre('save', function(next) {
  console.log('Will save document....');
  next();
});

tourSchema.post('save', function(doc, next) {
  next();
});
*/

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  //tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } }); //"this" is a query object

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  //this allways points to the current query
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt -retry'
  });
  next();
});

/*tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milleseconds!`);
  next();
});*/

//AGGREGATION MIDDLEWARE:
/*tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }
  }); //unshift adds a value to the beginnin of array
  console.log(this.pipeline());
  next();
});*/

//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
