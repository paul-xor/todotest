const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);


// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).
//   catch(error => handleError(error));

mongoose
    .connect(process.env.DATABASE_LOCAL, {
        // .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).catch(err => console.log(err))
    .then(con => {
        //console.log(con.connections);
        console.log('DB connection successful!');
    });

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

const testTodo = new Todo({
    "name": "Visit the Home Sweet Home",
    "duration": 12,
    "price": 397,
    "summary": "Breathtaking hike through the Canadian Banff National Park",
    "description": "Ut enim blah-blah"
});

testTodo
    .save()
    .then(doc => {
        console.log(doc);
    })
    .catch(err => {
        console.log('ERROR ☠️:', err);
    });



// console.log(process.env);
if (process.env.NODE_ENV === 'development') {
    console.log('NODE_ENV is on development mode');
}


const port = process.env.PORT || 7777;
app.listen(port, () => {
    console.log(`Server running on PORT:${port} ...`);
});
