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

// console.log(process.env);
if (process.env.NODE_ENV === 'development') {
    console.log('NODE_ENV is on development mode');
}


const port = process.env.PORT || 7777;
const server = app.listen(port, () => {
    console.log(`Server running on PORT:${port} ...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
