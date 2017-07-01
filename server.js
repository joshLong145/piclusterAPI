// server.js
// PU CLUSTER API v1 
//JSON file structure 
/*
	JSON file structure 
	
	mpiObject{
		fileName: String, 
		mimeType: String, 
		body: var
	}
	
*/
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mpiObject  = require('./models/mpiObject');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('request sent.');
    next(); // make sure we go to the next routes and don't stop here
});

// Defailt API route. Sends a welcome message with help on how to access functionality within the API
router.get('/', function(req, res) {
    res.json({ 
    	message: 'Welcome to the Pi cluster API! For help with commands please send a GET req to /api/help.' 
    });   
});
// Help routing sends a list of api routes with specfic req params for users to refrence.
router.get('/help', function(req, res) {
    res.json({ 
    	message: 'Functionality comming soon.' 
    });   
});
// create a bear (accessed at POST http://localhost:8080/api/bears)
router.route('/upoad').post(function(req, res) {
    // get the JSON from the request body 
    var mpiObj = new mpiObject(req.body);
    // we need to decode the string passed to use in the mpiObj
    var b64string = mpiObj["body"];
	var buf = new Buffer(b64, 'base64').toString("ascii"); // Ta-da
	// **** add bash script to run mpi commands **** 
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('API running on port ' + port);