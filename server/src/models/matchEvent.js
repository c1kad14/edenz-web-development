const mongoose = require('mongoose');

const matchEventSchema = mongoose.Schema({
    events: mongoose.Schema.Types.Mixed
},
{
    collection: 'matchEvents'
});

const MatchEvent = (module.exports = mongoose.model('MatchEvent', matchEventSchema));

module.exports.getMatchEvents = function (predicate, callback, limit) {
    let query = {};
    if (predicate) {
        if (predicate.regExp) {
            query[predicate.regExp.key] = new RegExp(predicate.regExp.value);
        } else {
            query = predicate;
        }
    }
    MatchEvent.find(query, callback).limit(limit);
};

module.exports.getMatchEventsById = function (id, callback) {
    MatchEvent.findOne({_id: id}, callback);
};
