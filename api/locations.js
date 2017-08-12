/* 
 * Location API File
 * @date: 11/8/2017
 * @author: FC, ES 
*/

// Express init
const express = require('express')

// Route init
const router = express.Router()

// BodyParser init & config
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

// Location Model Class init
const Location = require('../model/locations');

// GET Location List
router.get('/list', apiReadLocationList)

// POST Create new Location
router.post('/create', apiCreateNewLocation)

// GET Read Location
router.get('/read/:locationId([0-9a-f]+)', apiReadLocation)

// PUT Update Location
router.put('/update/:locationId([0-9a-f]+)', apiUpdateLocation)

// DELETE Delete Location
router.delete('/delete/:locationId([0-9a-f]+)', apiDeleteLocation)

// Location List
function apiReadLocationList(req, res) {
    Location.elements(function(data) {
        res.json(data);
    });
}

// Create new Location
function apiCreateNewLocation(req, res){
    var newName = req.body["name"];
    if(!newName){console.log("ERROR: No newName");}
    var newLat = req.body["lat"];
    if(!newLat){console.log("ERROR: No newLat");}
    var newLon = req.body["lon"];
    if(!newLat){console.log("ERROR: No newLon");}
    console.log(newName);
    console.log(newLat);
    console.log(newLon);
    var newLocation = new Location({
        name:newName, 
        lat: newLat,
        lon: newLon
    });

    newLocation.save(function (err, newLocation) {
        if (err) {
            throw err;
        } else {
            console.log("Created ID: " + newLocation._id);
            res.status(201);
            res.end();
        }
    });
}

// Read Location
function apiReadLocation(req, res) {
    var locationId = req.params["locationId"];

    Location.find({_id: locationId}, function(err, result) {
        if (err) {
            //throw err;
            res.json({});
        } else {
            if(result.length > 1) {
                console.log("ERROR: duplicated id!!!!");
                throw "DUPERR";
            }
            res.json(result[0]);
        }
    });
}

// Update Location
function apiUpdateLocation(req, res) {
    var newName = req.body['name'];
    var newLat = req.body["lat"];
    var newLon = req.body["lon"];
    var locationId = req.params["locationId"];
    console.log('New name: '+newName+' New Lat: '+newLat+' New Lon: '+newLon);
    Location.findById(locationId, function (err, location) {
        if (err) {
            console.log('ERROR: Cannot find ID: ' + locationId);
            throw err;
        } else {
            location.update({
                name: newName,
                lat: newLat,
                lon: newLon
            }, function (err, id) {
                if (err) {
                    console.log('ERROR: Cannot update ID: ' + id);
                    throw err;
                } else {
                    console.log("Updated: "+id+" "+newName+" "+newLat+' '+newLon);
                    res.status(204);
                    res.end();
                }
            })
        }
    })
}

// Delete Location
function apiDeleteLocation(req, res) {
    var locationId = req.params["locationId"];

    Location.findById(locationId, function (err, location) {
        if (err) {
            console.log('ERROR: Cannot find ID: ' + locationId);
            throw err;
        } else {
            location.remove(function (err, data) {
                if (err) {
                    console.log('ERROR: Cannot delete ID: ' + data._id);
                    throw err;
                } else {
                    console.log("Deleted id: "+data._id);
                    res.status(204);
                    res.end();
                }
            })
        }
    })
}

// Module Export: Route
module.exports = router