const mongoose = require('mongoose')
const User = require('./Tutor')

const classroomSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
        min : 6
    },
    tutor: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tutor'
    },
    students : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Student'
        }       
    ],
    files : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Files'
        }       
    ]
})

module.exports = mongoose.model('Classroom', classroomSchema)