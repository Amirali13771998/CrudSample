var express  = require('express');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const _ = require('lodash')
const {authenticate} = require('./middleware/authenticate')
var {ObjectId}  = require('mongodb')

var methodOverride = require('method-override');
var port  = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var Todo = require('./model/auth');
mongoose.connect(database.url);
app.listen(port,()=>{
    console.log("App listening on port : " + port);
});

// *****************************CRUD******************************************************
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

app.get('/sample', (req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos})
    },(e)=>{
        res.status(400).send(e)
    })
})

app.get('/sample/:id', (req,res)=>{
    var id = req.params.id
    
    if(!ObjectId.isValid(id)){
        return res.status(404).send()
    }

    Todo.findById(id).then((todos)=>{
        if(!todos){
            return res.status(404).send()
        }
        res.send({todos})
    }).catch((e)=>{
        res.status(400).send()
    })

})

app.delete('/sample/:id',(req,res)=>{
    var id = req.params.id

    if(!ObjectId.isValid(id)){
        return res.status(404).send()
    }
    Todo.findByIdAndRemove(id).then((todos)=>{
        if(!todos){
            return res.status(404).send()
        }
        res.send({todos})
    }).catch((e)=>{
        res.status(400).send()
    })
})

app.patch('/sample/:id',(req,res)=>{
    var id = req.params.id
    var body = _.pick(req.body,['text','completed'])

    if(!ObjectId.isValid(id)){
        return res.status(404).send()
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.comletedAt = new Date().getTime()
    }else{
        body.completed = false
        body.comletedAt = 189
    }

    Todo.findByIdAndUpdate(id,{$set : body},{new : true}).then((todo)=>{
        if(!todo){
            return res.status(404).send()
        }
        res.send({todo})
    }).catch((e)=>{
        res.status(400).send()
    })
})
// *****************************CRUD******************************************************


//************************************Sending Data ****************************************
app.post('/auth',(req,res)=>{
    var body = _.pick(req.body,['email','password'])
    var user = new Todo(body)

    user.save().then(()=>{
       return user.generateAuthTocken();
    }).then((token)=>{
        res.header('x-auth',token).send(user)
    })
    .catch((e)=>{
        res.status(400).send(e)
    })
})

//************************************Sending Data ****************************************

app.get('/user/me',authenticate,(req,res)=>{
    res.send(req.user)
})


// *************************************this post for login**********************
app.post('/user/login',(req,res)=>{
    var body = _.pick(req.body,['email','password'])
    

    Todo.findAuthUser(body.email,body.password).then((user)=>{               
        return user.generateAuthTocken().then((token)=>{
            res.header('x-auth',token).send(user)
        })
    }).catch((err)=>{
        res.status(400).send()
    })
})

// ***********************************this post for login**********************


// ***********************************this post for logOut**********************

app.delete('/user/token/delete',authenticate,(req,res)=>{
    console.log(req)
    Todo.deleteToken(req.token).then(()=>{
        res.status(200).send()
    }).catch((err)=>{
        res.status(400).send()
    })
})

module.exports = app