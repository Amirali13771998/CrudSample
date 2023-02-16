const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const bcrypt = require('bcrypt');

 var Schema = mongoose.Schema; // for adding method to model

 var authSchema = new Schema({
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
    tokens : [{
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
authSchema.methods.toJSON = function(){
    var user = this
    var userObject = user.toObject()                              // for showing in response just id & email
    return _.pick(userObject,['_id','email'])
}


authSchema.methods.generateAuthTocken = function(){
    var user = this
    var access = 'Auth-access'
    var token = jwt.sign({_id : user._id.toHexString(),access},'123abc').toString();      // Generate Token

    user.tokens.push({access,token})
    return user.save().then(()=>{
        return token
    })
}

authSchema.statics.findByToken = function(token){
    var User = this;
    var decod;
    try{
        decod = jwt.verify(token,'123abc')
    }catch{                                                         // FindByToken
        return Promise.reject();
    }
    return User.findOne({
        //'_id' : decod._id,
        'tokens.token' : token,
        'tokens.access' : 'Auth-access'
    })


}

authSchema.statics.findAuthUser = function(email,password){
    var User = this

    
    return User.findOne({email}).then((user)=>{
        
        if(!user){
            return Promise.reject()                                     // this part for check login 
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user)
                }else{
                    reject()
                }
            })
        })
    })

}

authSchema.statics.deleteToken = function(token){
    var user = this;
    console.log(token)
    return user.update({                                        // this part for check logOut 
        $pull:{
            tokens : {token}
        }
    })
}

authSchema.pre('save',function(next){
    var user = this
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{                 // Hashing Password
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
})

 module.exports = mongoose.model('Auth', authSchema);