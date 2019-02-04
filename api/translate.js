const {
    Translate
} = require('@google-cloud/translate');

const projectId = 'translate-1540900296733';

module.exports.translate = new Translate({
    projectId: projectId,
    key: process.env.API_KEY
});