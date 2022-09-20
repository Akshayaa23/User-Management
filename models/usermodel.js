const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type:String,
        required:true,
        max:64
    },
    email: {
        type:String,
        trim:true,
        required:true,
        unique:true,
        lowercase: true
    },
    phone: {
        type:String,
        required:false,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    status:{
        type:Boolean,   
        default:true
    },
    role: {
        type: String,
        enum: ["admin","manager","user"],
        default:"admin"
    }
},{timestamps:true})

const User =new mongoose.model('user', userSchema)
module.exports = User