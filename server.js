// server.js
// PU CLUSTER API v1 
//JSON file structure 
/*
	JSON file structure 
	
	mpiObject{
		Name: String, 
		file: String
	}
	
*/
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');      // call express
var multer     = require('multer');       // call multer 
var bodyParser = require('body-parser'); // required for POST req
var fs         = require('fs'); 
var app        = express();               // define our app using express   
var mpiObject  = require('./models/mpiObject');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // specifies the format for POST req 
var port = process.env.PORT || 8888;        // set our port
// uploads file to the local storage, will be switched to ram later for performance optimzation.
var storage = multer.memoryStorage(); // store each file uploaded within the RAM, I/O calls to the disk are too slow. will be cleane up by garbage collection if multer does its job right. 
var upload = multer({storage : storage }).any(); 

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
// upload a file to run by the cluster (accessed at POST http://localhost:8080/api/upload)
router.route('/upload').post(function(req, res) {
    upload(req,res,function(err){
	    if(err){
	    	console.log("error occured while uploading");
	    	return;
	    }
	    fs.open(req.files[0].originalname,'r',(err,fd) => {
	    	if(err){
			if(err.code == 'ENDENT'){
				console.error('myfile does not exist');
				return;
			}
			throw err;
			// BASH SCRIPT EXECUTION 
		}
	    });
	    
	//if file was uploaded successfully, then output message to client.
    	res.json({message: "file " + req.files[0].originalname + " has been uploaded."}); 
    });
      
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('API running on port ' + port);
