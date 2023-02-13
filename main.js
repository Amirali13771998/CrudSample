var express  = require('express');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)

var {ObjectId}  = require('mongodb')

var methodOverride = require('method-override');
var port  = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var Todo = require('./model/sample');
mongoose.connect(database.url);
app.listen(port,()=>{
    console.log("App listening on port : " + port);
});

app.post('/sample', function(req, res){
    var todo = new Todo({
        text : req.body.text,
        completed : true,
        comletedAt : 172 
    });
    todo.save().then((doc)=>{
        res.send(doc)
    },(e)=>{
        console.log(e)
    })
})

// app.get('/sample', (req,res)=>{
//     Todo.find().then((todos)=>{
//         res.send({todos})
//     },(e)=>{
//         res.status(400).send(e)
//     })
// })

// app.get('/sample/:id', (req,res)=>{
//     var id = req.params.id
    
//     if(!ObjectId.isValid(id)){
//         return res.status(404).send()
//     }

//     Todo.findById(id).then((todos)=>{
//         if(!todos){
//             return res.status(404).send()
//         }
//         res.send({todos})
//     }).catch((e)=>{
//         res.status(400).send()
//     })

// })

// app.delete('/sample/:id',(req,res)=>{
//     var id = req.params.id

//     if(!ObjectId.isValid(id)){
//         return res.status(404).send()
//     }
//     Todo.findByIdAndRemove(id).then((todos)=>{
//         if(!todos){
//             return res.status(404).send()
//         }
//         res.send({todos})
//     }).catch((e)=>{
//         res.status(400).send()
//     })
// })

module.exports = app