var mongoose = require('mongoose')
var Schema = mongoose.Schema;
EmpSchema = new Schema({
    text : {
        type : String
    },
    completed:{
        type : Boolean
    },
    comletedAt : {
        tyoe : Number
    }
});
module.exports = mongoose.model('Employee', EmpSchema);