const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

const ONE_MONTH = 60 * 60 * 24 * 30;

let getJwt = (user) => jwt.sign(user, config.auth.secret, {expiresIn: ONE_MONTH});

module.exports = {
    async register (req, res) {
        try {
            let newUser = await User.addUser(req.body);
            res.send(newUser.toJSON());
        } catch (error) {
            console.log(error);
            res.status(400).send({error: error});
        }
    },
    async login (req, res) {
        try {
            const {email, password} = req.body;
            const currentUser = await User.getUserByEmail(email);

            if (!currentUser) {
                res.status(403).send({error: 'Check user information.'});
            }

            const valid = await currentUser.comparePassword(password);
            if (!valid) {
                res.status(403).send({error: 'Check password and try again. '});
            } else {
                res.send({user: currentUser.toJSON(), token: getJwt(currentUser.toJSON())});
            }
        } catch (error) {
            console.log('hello error');
            console.log(error);
            res.status(400).send({error: error});
        }
    }
};
