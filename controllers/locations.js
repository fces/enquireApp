/* 
 * Location Controller File
 * @date: 11/8/2017
 * @author: FC, ES 
*/

// Location Model Class init
const Location = require('../model/locations');
const field_names = {f1:"newName",f2:"newLat",f3:"newLon"}

/* Controllers */

// Location Home 
exports.getLocationHomeView = function (req, res) {
    Location.total(function(c) {
        res.render('location/home', {
            total: c,
            notNull: c>0 ? true : false,
            isBiggerThanOne: c>1 ? true : false
        });
    });
}

// Location List
exports.getLocationListView = function (req, res) {
    Location.elements(function(data) {
        res.render('location/list', {
            locations: data,
            total: data.length
        });
    });
}

// Add New Location - POST 
exports.postNewLocationView = function (req, res){
    console.log(req.body);
    var newName = req.body[field_names["f1"]];
    var newLat = req.body[field_names["f2"]];
    var newLon = req.body[field_names["f3"]];
    console.log('name: '+newName+' lat: '+newLat+' lon: '+newLon)
    var newLocation = new Location({name:newName, lat:newLat,lon:newLon});
    newLocation.save(function (err, newLocation) {
        if (err) {
            throw err;
        } else {
            console.log("Created ID: " + newLocation._id);
        }        
    });
    res.redirect('list');
}

// Add New Location - GET
exports.getLocationAddView = function (req, res) {
    res.render('location/add',field_names);
}

// Get Location ID
exports.getLocationIdView = function (req, res) {
    var aid = req.params["locationId"];
    console.log(aid);
    Location.find({_id: aid}, function(err, result) {
        if (err) {
            res.render('location/single-404',{id: aid});
        } else {
            if(result.length > 1) {
                console.log("ERROR: duplicated id!!!!");
                throw "DUPERR";
            }
            res.render('location/single', result[0]);
        }
    });
}

