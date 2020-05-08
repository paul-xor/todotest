const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');


// console.log(process.env);
if (process.env.NODE_ENV === 'development') {
    console.log('NODE_ENV is on development mode');
}

const port = process.env.PORT || 7777;
app.listen(port, () => {
    console.log(`Server running on PORT:${port} ...`);
});
