/* 
 * Main Nodejs File
 * @date: 9/8/2017
 * @author: FC, ES 
*/

// Express init
const express = require('express')
const the_server = express()

// Server Configuration loading
const config = require('./server-config')

// Dependencies init
const handlebars = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// DB Connections init
mongoose.connect(config.dbUrl, {
    useMongoClient: true
});
var db = mongoose.connection;

// DB Models init
const Agent = require(config.agentModelPath);
const Location = require(config.locationModelPath);
const Event = require(config.eventModelPath);

// Static File Routes
the_server.use(express.static('public'))

// API Routes init
const agentsApiRoutes = require(config.agentsApiRoutesPath);
const locationsApiRoutes = require(config.locationsApiRoutesPath);

// Routes init
const agentRoutes = require(config.agentRoutesPath)
//const eventRoutes = require(config.eventRoutesPath)
const locationRoutes = require(config.locationRoutesPath)

// Configure Handlebars as template engine
the_server.set("views", config.viewsPath)
the_server.engine('handlebars', handlebars({defaultLayout: config.handlebarsMainLayout}))
the_server.set("view engine", 'handlebars')

/* ROUTES */ 
the_server.get('/', function (req, res) {
    res.send('Hello World!');
});

// Load API Routes
the_server.use(config.agentsApiUrl, agentsApiRoutes);
the_server.get('/crud/agents', function (req, res) {
    res.render('crud/agents', {
        viewPages: [
            { name: "home", url: "agent" }, 
            { name: "add", url: "agent/add" },
            { name: "list", url: "agent/list" }
        ]
    }); 
});
the_server.use(config.locationsApiUrl, locationsApiRoutes);
the_server.get('/crud/locations', function (req, res) {
    res.render('crud/locations', {
        viewPages: [
            { name: "home", url: "agent" }, 
            { name: "add", url: "agent/add" },
            { name: "list", url: "agent/list" }
        ]
    }); 
});

// Load Routes
the_server.use(config.agentUrl, agentRoutes);
// the_server.use('/event', eventRoutes);

// Start Nodejs Server
the_server.listen(config.port, function () {
    console.log('Motherfucker listening on port ' + config.port + '!');
});
