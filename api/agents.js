/* 
 * Agent API File
 * @date: 10/8/2017
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

// Agent Model Class init
const Agent = require('../model/agents');

/* Routes */

// GET Agent List
router.get('/list', apiReadAgentList)

// POST Create new Agent
router.post('/create', apiCreateNewAgent)

// GET Read Agent
router.get('/read/:agentId([0-9a-f]+)', apiReadAgent)

// PUT Update Agent
router.put('/update/:agentId([0-9a-f]+)', apiUpdateAgent)

// DELETE Delete Agent
router.delete('/delete/:agentId([0-9a-f]+)', apiDeleteAgent)

/* Controllers */

// Agent List
function apiReadAgentList(req, res) {
    Agent.elements(function(data) {
        res.json(data);
    });
}

// Create Agent
function apiCreateNewAgent(req, res){
    var newName = req.body["name"];
    if(!newName){console.log("ERROR: No newName");}
    var newSurname = req.body["surname"];
    if(!newSurname){console.log("ERROR: No newSurname");}
    console.log(newName);
    console.log(newSurname);
    var newAgent = new Agent({
        name:newName, 
        surname:newSurname
    });

    newAgent.save(function (err, newAgent) {
        if (err) {
            throw err;
        } else {
            console.log("Created ID: " + newAgent._id);
            res.status(201);
            res.end();
        }
    });
}

// Read Agent
function apiReadAgent(req, res) {
    var agentId = req.params["agentId"];

    Agent.find({_id: agentId}, function(err, result) {
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

// Update Agent
function apiUpdateAgent(req, res) {
    var newName = req.body['name'];
    var newSurname = req.body['surname'];
    var agentId = req.params["agentId"];
    console.log('New name: '+newName+' New Surname: '+newSurname);
    Agent.findById(agentId, function (err, agent) {
        if (err) {
            console.log('ERROR: Cannot find ID: ' + agentId);
            throw err;
        } else {
            agent.update({
                name: newName,
                surname: newSurname
            }, function (err, id) {
                if (err) {
                    console.log('ERROR: Cannot update ID: ' + id);
                    throw err;
                } else {
                    console.log("Updated: "+id+" "+newName+" "+newSurname);
                    res.status(204);
                    res.end();
                }
            })
        }
    })
}

// Delete Agent
function apiDeleteAgent(req, res) {
    var agentId = req.params["agentId"];

    Agent.findById(agentId, function (err, agent) {
        if (err) {
            console.log('ERROR: Cannot find ID: ' + agentId);
            throw err;
        } else {
            agent.remove(function (err, data) {
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