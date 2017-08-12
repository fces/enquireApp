/* 
 * Server Configuration File
 * @date: 9/8/2017
 * @author: FC, ES 
*/

const path = require('path')
    
// Server & DB configs
exports.port = 3000
exports.dbUrl = 'mongodb://localhost/enquireDB'
exports.handlebarsMainLayout = 'main'

// API
exports.apiRoutesPath = path.join(__dirname, 'api');
exports.agentsApiRoutesPath = path.join(exports.apiRoutesPath, 'agents');
exports.agentsApiUrl = '/api/agents';
exports.locationsApiRoutesPath = path.join(exports.apiRoutesPath, 'locations');
exports.locationsApiUrl = '/api/locations';

// Views Directory Paths
exports.viewsPath = path.join(__dirname, "views");

// Models Directory Paths
exports.modelsPath = path.join(__dirname, "model");
exports.agentModelPath = path.join(exports.modelsPath, 'agents');
exports.locationModelPath = path.join(exports.modelsPath, 'locations');
exports.eventModelPath = path.join(exports.modelsPath, 'events');

// Routes Directory Paths
exports.routesPath = path.join(__dirname, "routes");
exports.agentRoutesPath = path.join(exports.routesPath, 'agents');
exports.locationRoutesPath = path.join(exports.routesPath, 'locations');
exports.eventRoutesPath = path.join(exports.routesPath, 'events');

// Routes urls
exports.agentUrl = '/agent';
exports.eventUrl = '/event';
