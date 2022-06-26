const router = require('express').Router();
const {addFilesValidate,deleteFilesValidate} = require('../validations/clasroom_validation') 
const authorize = require('../authorize');
const Files = require('../models/Files')
const {uploadAudio,uploadImage, uploadVideo} = require('../multer')
const Classroom = require('../models/Classroom');
const Tutor = require('../models/Tutor');

const mongoose = require('mongoose')
var fs = require('fs');

// add image files to a class
router.post('/image', authorize, uploadImage.single('file'), async (req, res) => {
    const data = req.body

    if(req.user.role != 0) return res.status(401).json({
        "error" : "students cannot create a classroom"
    })

    const {error} = addFilesValidate(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // find classroom
    if(! mongoose.Types.ObjectId.isValid(data.class_id)) return res.status(404).json({
        "error" : "invalid classroom id"
    })

    const classroom = await Classroom.findOne({_id : data.class_id})
    if(!classroom) return res.status(404).json({
        "error" : "classroom does not exist"
    })

    if(!classroom.tutor == req.user.id) return res.status(404).json({
        "error" : "classroom not owned by you"
    })
      

    const file = new Files({
        name : data.name,
        classroom : data.class_id,
        type : 0,
        location : req.file.path,
        description : data.description,
        uploaded_at : Date.now(),
        owner : req.user._id
    })
    
    try{
        file.save() 
        await Classroom.updateOne({_id : data.class_id},{
            $push : {
                files : file._id
            }
        })
        return res.json({
            "success" : "file uploaded succesfully"
        })
    }catch(err){
        return res.send(err)
    }
   
})

// add audi files to a class
router.post('/audio', authorize, uploadAudio.single('file'), async (req, res) => {
    const data = req.body

    if(req.user.role != 0) return res.status(401).json({
        "error" : "students cannot create a classroom"
    })

    const {error} = addFilesValidate(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // find classroom
    if(! mongoose.Types.ObjectId.isValid(data.class_id)) return res.status(404).json({
        "error" : "invalid classroom id"
    })

    const classroom = await Classroom.findOne({_id : data.class_id})
    if(!classroom) return res.status(404).json({
        "error" : "classroom does not exist"
    })

    if(!classroom.tutor == req.user.id) return res.status(404).json({
        "error" : "classroom not owned by you"
    })
      

    const file = new Files({
        name : data.name,
        classroom : data.class_id,
        type : 1,
        location : req.file.path,
        description : data.description,
        uploaded_at : Date.now(),
        owner : req.user._id
    })
    
    try{
        file.save() 
        await Classroom.updateOne({_id : data.class_id},{
            $push : {
                files : file._id
            }
        })
        return res.json({
            "success" : "file uploaded succesfully"
        })
    }catch(err){
        return res.send(err)
    }
   
})

// add video files to a classadd
router.post('/video', authorize, uploadVideo.single('file'), async (req, res) => {
    const data = req.body

    if(req.user.role != 0) return res.status(401).json({
        "error" : "students cannot create a classroom"
    })

    const {error} = addFilesValidate(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // find classroom
    if(! mongoose.Types.ObjectId.isValid(data.class_id)) return res.status(404).json({
        "error" : "invalid classroom id"
    })

    const classroom = await Classroom.findOne({_id : data.class_id})
    if(!classroom) return res.status(404).json({
        "error" : "classroom does not exist"
    })

    if(!classroom.tutor == req.user.id) return res.status(404).json({
        "error" : "classroom not owned by you"
    })
      

    const file = new Files({
        name : data.name,
        classroom : data.class_id,
        type : 2,
        location : req.file.path,
        description : data.description,
        uploaded_at : Date.now(),
        owner : req.user._id
    })
    
    try{
        file.save() 
        await Classroom.updateOne({_id : data.class_id},{
            $push : {
                files : file._id
            }
        })
        return res.json({
            "success" : "file uploaded succesfully"
        })
    }catch(err){
        return res.send(err)
    }
   
})

// add links
router.post('/link', authorize, async (req,res) => {
    const data = req.body

    if(req.user.role != 0) return res.status(401).json({
        "error" : "students cannot create a classroom"
    })

    const {error} = addFilesValidate(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // find classroom
    if(! mongoose.Types.ObjectId.isValid(data.class_id)) return res.status(404).json({
        "error" : "invalid classroom id"
    })

    const classroom = await Classroom.findOne({_id : data.class_id})
    if(!classroom) return res.status(404).json({
        "error" : "classroom does not exist"
    })

    if(!classroom.tutor == req.user.id) return res.status(404).json({
        "error" : "classroom not owned by you"
    }) 

    const file = new Files({
        name : data.name,
        classroom : data.class_id,
        type : 3,
        location : data.url,
        description : data.description,
        uploaded_at : Date.now(),
        owner : req.user._id
    })

    try{
        file.save() 
        await Classroom.updateOne({_id : data.class_id},{
            $push : {
                files : file._id
            }
        })
        return res.json({
            "success" : "file uploaded succesfully"
        })
    }catch(err){
        return res.send(err)
    }
    
    
})

// delete files
router.delete('/delete',authorize,async (req,res) =>{
    data = req.body

    if(req.user.role != 0) return res.status(401).json({
        "error" : "you are astudent"
    })

    if(! mongoose.Types.ObjectId.isValid(data.class_id)) return res.status(404).json({
        "error" : "invalid classroom id"
    })

    const {error} = deleteFilesValidate(data)

    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })
    const file = await Files.findOne({_id : data.file_id})

    if (!(file.owner == req.user._id)) return res.status(400).json({
        "error" : "you don't own this file"
    })

    await Files.findOneAndDelete({_id : data.file_id})    
    
    location = file.location
    fs.unlinkSync(location)

    return res.send("deleted")
})

module.exports = router