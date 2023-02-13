const mongoose = require('mongoose');
const validator = require('validator')

 var Schema = mongoose.Schema;

 EmpSchema = new Schema({
    email : {
        type : String,
        required : true,
        minLength : 1,
        trim : true,
        validate : {
            validator : validator.isEmail,
            message : '{VALUE} این ایمیل معتبر نیست'
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    token : [{
        access : {
            type : String,
            require : true
        },
        token : {
            type : String,
            require : true
        }
    }]

});

 module.exports = mongoose.model('Auth', EmpSchema);