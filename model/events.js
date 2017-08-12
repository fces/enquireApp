/* 
 * Event Model File
 * @date: 10/8/2017
 * @author: FC, ES 
*/ 

// Mongoose init
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

//const Agent = require(config.agentModelPath);
//const Location = require(config.locationModelPath);

// Event Schema: Fields
var eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: "Default Event's title"
    },
    what: {
        type: String,
        required: true,
        default: "Default Event's What"
    },
    why: {
        type: String,
        required: true,
        default: "Default Event's Why"
    },
    how: {
        type: String,
        required: true,
        default: "Default Event's How"
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
        alias: "when"
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        alias: "where"
    },
    agents: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        alias: "who"
    }
});

// Event Schema: Instance Methods
eventSchema.methods.prettyStr = function() {
    return this.title;
};

// Event compiled Model (from Event Schema)
var Event =  mongoose.model('Event', eventSchema);

// Module Export: Event Model Class
module.exports = Event;

// Module Export: Event Model Class Methods
module.exports.elements = function(callback) {
    Event.find({}, function(err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};

module.exports.total = function(callback) {
    return Event.count({}, function(err, c) {
        if (err) {
            throw err;
        } else {
            callback(c);
        }
    });
};