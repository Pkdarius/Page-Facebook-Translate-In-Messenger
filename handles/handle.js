const request = require('request');
const translation = require('../api/translate').translate;
const UserModel = require('../db/UserModel');

let text, target, psid;
let languages = [
    'af', 'am', 'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'co', 'cs', 'cy',
    'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'fy', 'ga',
    'gd', 'gl', 'gu', 'ha', 'haw', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig',
    'is', 'it', 'iw', 'ja', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'la',
    'lb', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my',
    'ne', 'nl', 'no', 'ny', 'pa', 'pl', 'ps', 'pt', 'ro', 'ru', 'sd', 'si', 'sk',
    'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg',
    'th', 'tl', 'tr', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo', 'zh', 'zh-TW', 'zu'
]

function changeTarget(users) {
    // if user is not in database, save it
    if (users.length === 0) {
        UserModel.save(psid, target);
    }
    // else, update it
    else {
        UserModel.update(psid, target);
    }
}

function checkTarget(users) {
    // if user is not in database, default language is Vietnamese
    if (users.length === 0) {
        target = 'vi';
    }
    // else, get the language from database
    else {
        target = users[0]['language'];
    }
    console.log('TARGET 1 : ' + target)
}

module.exports.handleMessage = function (sender_psid, received_message) {
    let response;
    psid = sender_psid;
    // Check if the message contains text
    if (received_message.text) {
        text = received_message.text;
        // message select language start with #
        if (text[0] === '#') {
            target = text.substring(1);
            if (languages.indexOf(target) >= 0) {
                let p = new Promise((resolve, reject) => {
                        UserModel.User.find({
                            psid: sender_psid
                        }, (err, users) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(users);
                            }
                        })
                    })
                    .then(changeTarget)
                    .catch((error) => {
                        console.error(error)
                    });
            } else {
                response = {
                    'text': 'Wrong code of language, for more information, please visit home page'
                }
                callSendAPI(sender_psid, response);
            }
        } else if (text.toLowerCase() === 'help') {
            response = {
                'text': 'To choose language, enter # + language code, for example:' +
                    '\nEnglish: #en\nKorean: #kor\nFor more information, please visit homepage.'
            }
            callSendAPI(sender_psid, response);
        } else if (text.toLowerCase() === 'info' || text.toLowerCase() === 'information') {
            response = {
                'text': 'Create by Trinh Duy Hai.\n' +
                    'Facebook: ultra.magnus.21' +
                    'Email: pkdarius98@gmail.com'
            }
            callSendAPI(sender_psid, response);
        } else {
            let p = new Promise((resolve, reject) => {
                    UserModel.User.find({
                        psid: sender_psid
                    }, (err, users) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(users);
                        }
                    })
                })
                .then(checkTarget)
                .then(() => {
                    console.log('TARGET 2 : ' + target);
                    translation.translate(text, target)
                        .then(results => {
                            response = {
                                'text': results[0]
                            }
                        })
                        .then(() => {
                            callSendAPI(sender_psid, response)
                        }).catch((err) => {
                            console.log(err);
                        });
                })
                .catch((error) => {
                    console.error(error)
                });
        }
    };

}

const handlePostback = function (sender_psid, received_postback) {}

const callSendAPI = function (sender_psid, response) {
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
            console.log("body: " + body);
        } else {
            console.error("Unable to send message: " + err);
        }
    });
}