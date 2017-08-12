/* 
 * Location Model File
 * @date: 10/8/2017
 * @author: FC, ES 
*/ 

// Mongoose init
const mongoose = require('mongoose');
mongoose.Promise = global.Promise

// Location Schema: Fields
var locationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "Default Location's name"
    },
    lat: {
        type: Number,
        required: true,
        default: 0.0,
        min: -90, // South
        max: 90 // North
    },
    lon: {
        type: Number,
        required: true,
        default: 0.0,
        min: -180, // East
        max: 180 // West
    }
});

// Location Schema: Instance Methods
locationSchema.methods.prettyStr = function() {
    return this.name + " " + this.lat + ' ' + this.lon;
};

// Location compiled Model (from Location Schema)
var Location =  mongoose.model('Location', locationSchema);

// Module Export: Location Model Class
module.exports = Location;

// Module Export: Location Model Class Methods
module.exports.elements = function(callback) {
    Location.find({}, function(err, data) {
        if (err) {
            throw err;
        } else {
            callback(data);
        }
    });
};

module.exports.total = function(callback) {
    return Location.count({}, function(err, c) {
        if (err) {
            throw err;
        } else {
            callback(c);
        }
    });
};