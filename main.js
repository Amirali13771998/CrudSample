var express  = require('express');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);


var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)

var methodOverride = require('method-override');
var port  = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());



var Employee = require('./model/employee');
mongoose.connect(database.url);
app.listen(port);
console.log("App listening on port : " + port);


//get all employee data from db
app.get('/todos', function(req, res) {
    // use mongoose to get all todos in the database
    Employee.find(function(err, employees) {
        // if there is an error retrieving, send the error otherwise send data
        if (err)
            res.send(err)
        res.json(employees); // return all employees in JSON format
    });
});