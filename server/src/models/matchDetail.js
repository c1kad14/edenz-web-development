const mongoose = require('mongoose');

const matchDetailSchema = mongoose.Schema({
    playerIdNameDictionary: mongoose.Schema.Types.Mixed,
    periodMinuteLimits: mongoose.Schema.Types.Mixed,
    timeStamp: String,
    attendance: Number,
    venueName: String,
    referee: mongoose.Schema.Types.Mixed,
    weatherCode: String,
    elapsed: String,
    startTime: String,
    startDate: String,
    score: String,
    htScore: String,
    ftScore: String,
    etScore: String,
    pkScore: String,
    statusCode: Number,
    periodCode: Number,
    home: mongoose.Schema.Types.Mixed,
    away: mongoose.Schema.Types.Mixed,
    maxMinute: Number,
    minuteExpanded: Number,
    maxPeriod: Number,
    expandedMinutes: mongoose.Schema.Types.Mixed,
    expandedMaxMinute: Number,
    periodEndMinutes: mongoose.Schema.Types.Mixed,
    commonEvents: mongoose.Schema.Types.Mixed,
    timeoutInSeconds: Number
},
{
    collection: 'matchDetails'
});

const MatchDetail = (module.exports = mongoose.model('MatchDetail', matchDetailSchema));

module.exports.getMatchDetails = function (predicate, callback, limit) {
    let query = {};
    if (predicate) {
        if (predicate.regExp) {
            query[predicate.regExp.key] = new RegExp(predicate.regExp.value);
        } else {
            query = predicate;
        }
    }
    MatchDetail.find(query, callback).limit(limit);
};

module.exports.getMatchDetailsById = function (id, callback) {
    MatchDetail.findOne({_id: id}, callback);
};