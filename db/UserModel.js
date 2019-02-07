const mongoose = require('./db').mongoose;

const userSchema = new mongoose.Schema({
    psid: String,
    language: String
});

const User = mongoose.model('User', userSchema);
module.exports.User = User;

module.exports.update = function (psid, language) {
    this.User.replaceOne({
        psid: psid
    }, {
        psid: psid,
        language: language
    }, (err) => {
        if (err) {
            console.log('UPDATE ERROR: ' + err)
        } else {
            console.log('updated!');
        }
        // mongoose.connection.close();
    });
};

module.exports.save = function (psid, language) {
    let user = new User({
        psid: psid,
        language: language
    });
    user.save(function (err, user) {
        if (err) {
            console.log('SAVE ERROR: ' + err);
        } else {
            console.log('saved!')
            // mongoose.connection.close();
        }
    });
};