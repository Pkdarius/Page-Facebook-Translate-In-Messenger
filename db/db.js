const mongoose = require('mongoose');

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

mongoose.connect('mongodb://' + username + ':' + password + '@ds121105.mlab.com:21105/heroku_sdhdjlnx', { useNewUrlParser: true } );

module.exports.mongoose = mongoose;