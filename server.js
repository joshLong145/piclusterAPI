// server.js
// Pi CLUSTER API v1
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');      // call express
var multer     = require('multer');       // call multer
var fs         = require('fs');
var app        = express();               // define our app using express
var server     = require('http').createServer(app);
var mpiObject  = require('./models/mpiObject');
var exec       = require('child_process').exec,child;
var os         = require('os');
// initilize middleware and set up storage options for multer.
app.use(express.static(__dirname + "/frontend"));
var port = process.env.PORT || 8080;// set our port
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage }).any();

// ROUTES FOR OUR API
// ============================================================================
var router = express.Router(); // get an instance of the express Router
// middle ware for express api
router.use(function(req, res, next) {
    // do logging
    console.log('request sent.');
    next(); // make sure we go to the next routes and don't stop here
});

// Defailt API route. Sends a welcome message with help on how to access functionality within the API
router.get('/', function(req, res) {
    res.json({
    message: 'Welcome to PiBuddy! For help with commands please send a GET req to /api/help.'
 });
});

// servers the html file for front end use.
router.get('/index',function(req, res){
        fs.sendFile(__dirname + '/frontend/index.html');
});

// Help routing sends a list of api routes with specfic req params for users to refrence.
router.get('/help', function(req, res) {
    res.json({
    	message: 'Wlecome to PiBuddy, PiBuddy lets you run scripts on our parallel computing device' +
      '\n simply upload the file you wish to run and you will see your output in this window.' +
      "\n COMMAND LIST:" +
      "\n /resources/ -gives you the current cpu and ram usage" +
      "\n /clear/ -clears the output window \n"
    });
});

// get cpu and ram usage of the pies
router.get('/resources', function(req, res) {
    res.json({
    	message: 'CPU: ' + os.loadavg() + '\n' + 'RAM free: ' + os.freemem() / 1000000000 + "\n"
    });
});

// POST req for uploading files to the server2
router.route('/upload').post(function(req, res) {
  upload(req,res,function(err){
     if(err){
        res.json( {message: "an error has occured: " + err} );
        return;
     }
     // check file extension to make sure its valid
     var regex = new RegExp(/^.*\.(py)$/);
     var matches = req.files[0].originalname.match(regex);
     // if matches is a valid object then continue in execution.
     // if matches is null, then no matches were found, return an error message to the user.
     if(matches === null){
       res.json({message: "cannot execute files with that extension." });
       fs.unlinkSync(__dirname + "/uploads/" + req.files[0].originalname);
       return;
     }
     //use node functionality to execute command to execute mpi command
     child = exec("cd /srv/public/python2_venv/ && . bin/activate && cd /srv/public && mpiexec -f machinefile -n 5 python  " + __dirname + '/uploads/' + req.files[0].originalname + " && deactivate", function (error, stdout, stderr) {
        if (error !== null) {
          res.json({message: stderr });
        }
        //if not errors, output the
        res.json({message: "output: " + "\n" + stdout });
        //delete the file after execution, wihtin the call back to exec the file
        fs.unlinkSync(__dirname + '/uploads/' + req.files[0].originalname);
     });
     // send a response back to the client on successful upload
  });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
server.listen(port);
console.log('API running on port ' + port);
