const authController = require('./controllers/authController');
const authControllerPolicy = require('./policies/authControllerPolicy');
const matchesController = require('./controllers/matchesController');

module.exports = (app) => {
    //auth
    app.post('/register', authControllerPolicy.register, authController.register);
    app.post('/login', authController.login);
    //matches
    app.get('/matches', matchesController.getMatchScores);
    app.get('/matches/:id', matchesController.getMatchDetailsById);
    app.post('/filterMatches', matchesController.getMatchScoresWithPredicate);
    //event types
    //

};