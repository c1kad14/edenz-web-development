const mongoose = require('mongoose');

const matchScoreSchema = mongoose.Schema({
    attendance: Number,
    venueName: String,
    referee: mongoose.Schema.Types.Mixed,
    weatherCode: String,
    elapsed: String,
    startTime: String,
    score: String,
    htScore: String,
    ftScore: String,
    home: String,
    away: String
},
{
    collection: 'matchScores'
});

const MatchScore = (module.exports = mongoose.model('MatchScore', matchScoreSchema));

module.exports.getMatchScores = function (predicate, callback, limit) {
    let query = {};
    if (predicate) {
        if (predicate.regExp) {
            query[predicate.regExp.key] = new RegExp(predicate.regExp.value);
        } else {
            query = predicate;
        }
    }
    MatchScore.find(query, callback).limit(limit);
};

module.exports.getMatchScoreById = function (id, callback) {
    MatchScore.findOne({_id: id}, callback);
};