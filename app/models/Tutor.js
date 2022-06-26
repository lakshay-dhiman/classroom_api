const mongoose = require('mongoose')

const tutorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 6
    },
    email : {
        type : String,
        required : true,
        min : 6
    },
    password : {
        type : String,
        required : true,
        min : 6        
    }, 
    role : {
        type : Number,
        required : true,
        default : 0
    },
    classrooms : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Classroom'
        }          
    ]
})

module.exports = mongoose.model('Tutor', tutorSchema)