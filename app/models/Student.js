const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 6
    },
    roll_number : {
        type : String,
        required : true,      
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
    classrooms : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Classroom'
        }
    ],
    role : {
        type : Number,
        required : true,
        default : 1
    }
})

module.exports = mongoose.model('Student', studentSchema)