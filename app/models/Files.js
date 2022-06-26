const mongoose = require('mongoose')

const filesSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        min : 6
    },
    classroom :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Classroom'
    },       

    type: {
        type : Number,
        required : true
    },

    location : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true,
        default : "This is a file"
    },

    uploaded_at : {
        type : Date,
        required : true       
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tutor'
    }
})

module.exports = mongoose.model('Files', filesSchema)