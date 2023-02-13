const mongoose = require('mongoose');

 var Schema = mongoose.Schema;

// mongoose.Promise = global.Promise;

// mongoose.set('strictQuery', false);

// mongoose.connect('mongodb://127.0.0.1:27017/myDb')


// var sample = mongoose.model('sample',{
//     text : {
//         type : String,
//         required : true,
//         minLength : 1,
//         trim : true
//     },
//     completed:{
//         type : Boolean,
//         default : false
//     },
//     comletedAt : {
//         tyoe : Number
//     }
// })

EmpSchema = new Schema({
    text : {
        type : String,
        required : true,
        minLength : 1,
        trim : true
    },
    completed:{
        type : Boolean
    },
    comletedAt : {
        tyoe : Number
    }
});

 module.exports = mongoose.model('Sample', EmpSchema);