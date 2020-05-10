const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A todo must have a name.'],
        unique: true
    },
    duration: {
        type: Number,
        default: 2
    },
    price: {
        type: Number,
        required: [true, 'A todo must have a price.']
    },
    summary: {
        type: String,
        required: [true, 'A todo must have a summary.']
    },
    description: {
        type: String,
        required: [true, 'A todo must have a discription.']
    }
});

const Todo = mongoose.model('Todo', todoSchema);


module.exports = Todo;
