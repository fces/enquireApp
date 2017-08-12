/* 
 * Agent Route File
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
const Agent = require('../model/agents')

const agentsViewController = require('../controllers/agents')

// GET Agent Home
router.get('/', agentsViewController.getAgentHomeView)

// GET Agent List
router.get('/list', agentsViewController.getAgentListView)

// POST new Agent
router.post('/add', agentsViewController.postNewAgentView)

// GET Agent Add
router.get('/add', agentsViewController.getAgentAddView)

// GET Agent ID
router.get('/:agentId([0-9a-f]+)', agentsViewController.getAgentIdView)

// Module Export: Route
module.exports = router