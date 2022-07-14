const express = require('express');
const responseTime = require('response-time')

const app = express();

app.use(responseTime()) // middleware

app.get('/ping', (request, response) => {
    response.send('pong');
});

app.listen(8080, 'localhost');