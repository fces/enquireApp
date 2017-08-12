/* 
 * Agent Controller File
 * @date: 11/8/2017
 * @author: FC, ES 
*/

// Agent Model Class init
const Agent = require('../model/agents');
const field_names = {f1:"newName",f2:"newSurname"}

/* Controllers */

// Agent Home 
exports.getAgentHomeView = function (req, res) {
    Agent.total(function(c) {
        res.render('agent/home', {
            total: c,
            notNull: c>0 ? true : false,
            isBiggerThanOne: c>1 ? true : false
        });
    });
}

// Agent List
exports.getAgentListView = function (req, res) {
    Agent.elements(function(data) {
        res.render('agent/list', {
            agents: data,
            total: data.length
        });
    });
}

// Add New Agent - POST 
exports.postNewAgentView = function (req, res){
    console.log(req.body);
    var newName = req.body[field_names["f1"]];
    var newSurname = req.body[field_names["f2"]];
    console.log('name: '+newName+' surname: '+newSurname)
    var newAgent = new Agent({name:newName, surname:newSurname});
    newAgent.save(function (err, newAgent) {
        if (err) {
            throw err;
        } else {
            console.log("Created ID: " + newAgent._id);
        }        
    });
    res.redirect('list');
}

// Add New Agent - GET
exports.getAgentAddView = function (req, res) {
    res.render('agent/add',field_names);
}

// Get Agent ID
exports.getAgentIdView = function (req, res) {
    var aid = req.params["agentId"];
    console.log(aid);
    Agent.find({_id: aid}, function(err, result) {
        if (err) {
            res.render('agent/single-404',{id: aid});
        } else {
            if(result.length > 1) {
                console.log("ERROR: duplicated id!!!!");
                throw "DUPERR";
            }
            res.render('agent/single', result[0]);
        }
    });
}

