/* 
 * Location Route File
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
const Location = require('../model/locations')

const locationsViewController = require('../controllers/locations')

// GET Location Home
router.get('/', locationsViewController.getLocationHomeView)

// GET Location List
router.get('/list', locationsViewController.getLocationListView)

// POST new Location
router.post('/add', locationsViewController.postNewLocationView)

// GET Location Add
router.get('/add', locationsViewController.getLocationAddView)

// GET Location ID
router.get('/:locationId([0-9a-f]+)', locationsViewController.getLocationIdView)

// Module Export: Route
module.exports = router