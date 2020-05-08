const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
const todoRouter = require('./routes/todoRoutes');
const userRouter = require('./routes/userRoutes');

//1. MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from middleware!🤖');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 3. Routes.
app.use('/api/v1/todos', todoRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
