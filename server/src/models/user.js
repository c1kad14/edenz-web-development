const mongoose = require('mongoose');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    }
});

function hashPassword (next) {
    let user = this;
    const SALT_FACTOR = 8;

    if (!user.isModified('password')) return next();

    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.password, salt, null))
        .then(hash => {
            user.password = hash;
        });
}

userSchema.pre('save', hashPassword);

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareAsync(password, this.password);
};

const User = (module.exports = mongoose.model('User', userSchema));

module.exports.addUser = function (user, callback) {
    return User.create(user, callback);
};

module.exports.getUserByEmail = function (email, callback) {
    return User.findOne({email: email}, callback);
};