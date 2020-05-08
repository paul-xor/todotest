const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Hi from server!');
});

const port = process.env.PORT || 7777;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});