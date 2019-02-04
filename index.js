const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

// middleware
const webhook = require('./middlewares/webhook.middleware');

app.get('/webhook', webhook.webhookGet);

app.post('/webhook', webhook.webhookPost);

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));