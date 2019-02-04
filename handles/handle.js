const request = require('request');
const translation = require('../api/translate');

module.exports.handleMessage = function (sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {
        let text = received_message.text;
        let target = 'vi';

        translation.translate
            .translate(text, target)
            .then(results => {
                response = {
                    'text': results[0]
                }
                console.log('results[0]: ' + results[0]);
            })
            // .then(this.callSendAPI(sender_psid, response))
            .then(() => {
                this.callSendAPI(sender_psid, response)
            })
            .catch(err => {
                response = {
                    'text': err
                }
            })
    };

}

module.exports.handlePostback = function (sender_psid, received_postback) {

}

module.exports.callSendAPI = function (sender_psid, response) {
    console.log('response: ' + response['text']);
    // Contruct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Semd the HTTP request to the Message Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": process.env.PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log(body);
        } else {
            console.error("Unable to send message: " + err);
        }
    });
}