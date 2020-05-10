const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const todoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A todo must have a name.'],
            unique: true,
            trim: true,
            maxlength: [40, 'A todo name must have less or equal then 40 characters'],
            minlength: [10, 'A todo name must have more or equal then 10 characters']
            //validate: [validator.isAlpha, 'Todo name must only contain characters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A todo must have a duration.']
        },
        difficulty: {
            type: String,
            required: [true, 'A todo must have a difficulty.'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
        ratingAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },
        ratingQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A todo must have a price.']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'A todo must have a discription.']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

todoSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
todoSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// todoSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// todoSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// todoSchema.pre('find', function(next) {
todoSchema.pre(/^find/, function (next) {
    this.find({ secretTodo: { $ne: true } });

    this.start = Date.now();
    next();
});

todoSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});

// AGGREGATION MIDDLEWARE
todoSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTodo: { $ne: true } } });

    console.log(this.pipeline());
    next();
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
