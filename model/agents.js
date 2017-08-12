/* 
 * Agent Model File
 * @date: 10/8/2017
 * @author: FC, ES 
*/ 

// Mongoose init
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// Agent Schema: Fields
var agentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "Default Agent's name"
    },
    surname: {
        type: String,
        required: true,
        default: "Default Agent's surname"
    }
});

// Agent Schema: Instance Methods
agentSchema.methods.prettyStr = function() {
    return this.name + " " + this.surname;
};

// Agent compiled Model (from Agent Schema)
var Agent =  mongoose.model('Agent', agentSchema);

// Module Export: Agent Model Class
module.exports = Agent;

// Module Export: Agent Model Class Methods
module.exports.elements = function(callback) {
    Agent.find({}, function(err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};

module.exports.total = function(callback) {
    return Agent.count({}, function(err, c) {
        if (err) {
            throw err;
        } else {
            callback(c);
        }
    });
};