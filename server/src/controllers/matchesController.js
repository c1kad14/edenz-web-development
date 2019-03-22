const MatchScore = require('../models/matchScore');
const MatchDetail = require('../models/matchDetail');

module.exports = {
    getMatchScores (req, res) {
        MatchScore.getMatchScores(null, (err, matches) => {
            if (err) {
                throw err;
            }
            res.json(matches);
        });
    },
    getMatchDetailsById (req, res) {
        MatchDetail.getMatchDetailsById(req.params.id, (err, matches) => {
            if (err) {
                throw err;
            }
            res.json(matches);
        });
    },
    getMatchScoresWithPredicate (req, res) {
        MatchScore.getMatchScores(req.body.predicate, (err, matches) => {
            if (err) {
                throw err;
            }
            res.json(matches);
        });
    },
    getMatchDetailsWithPredicate (req, res) {
        MatchDetail.getMatchDetails(req.body.predicate, (err, matches) => {
            if (err) {
                throw err;
            }
            res.json(matches);
        });
    },
};

