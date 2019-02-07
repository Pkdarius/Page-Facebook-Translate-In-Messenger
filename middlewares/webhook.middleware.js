const handle = require('../handles/handle');

module.exports.webhookGet = (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
}

module.exports.webhookPost = (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('SENDER PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handle.handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handle.handlePostback(sender_psid, webhook_event.postback);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}