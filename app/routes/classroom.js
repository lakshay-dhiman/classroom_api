const router = require('express').Router();
const authorize = require('../authorize');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const Files = require('../models/Files');
const mongoose = require('mongoose')

const {createdClassroomValidate,addStudentValidate} = require('../validations/clasroom_validation'); 


// creation of classroom
router.post('/create', authorize, async (req,res)=>{
    const data = req.body

    const {error} = createdClassroomValidate(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })
    
    if(req.user.role != 0) return res.status(401).json({
        "error" : "students cannot create a classroom"
    })
    
    classroom = new Classroom({
        title : data.title,
        tutor : req.user._id
    })

    try{
        const createdClassroom  = await classroom.save()
        await Tutor.updateOne({_id : req.user._id},{
            $push : {
                classrooms : createdClassroom._id
            }
        })
        return res.send(createdClassroom)        
    }catch(err){
        return res.send(err) 
    }


})

// addition of student to classroom
router.post('/add_student', authorize, async (req,res) => {
    const data = req.body
    if(req.user.role != 0) return res.status(401).json({
        "error" : "students cannot create a classroom"
    })

    const {error} = addStudentValidate(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // find student
    const student = await Student.findOne({roll_number : data.roll_number})
    if(!student) return res.status(404).json({
        "error" : "student not found"
    })

    const student_id = student._id

    // find classroom
    if(! mongoose.Types.ObjectId.isValid(data.class_id)) return res.status(404).json({
        "error" : "invalid classroom id"
    })

    const classroom = await Classroom.findOne({_id : data.class_id})
    if(!classroom) return res.status(404).json({
        "error" : "classroom does not exist"
    })

    all_students = classroom.students
    if (all_students.indexOf(student_id) != -1) return res.status(400).json({
            "error" : "student already in class"
        })
        
    try{
        const updated_classroom = await Classroom.updateOne({_id : data.class_id}, {
            $push : {
                students : student_id
            }
        })

        const updated_student = await Student.updateOne({_id : student_id},{
            $push : {
                classrooms : data.class_id
            }
        })
        
        return res.json({
            "success" : "student successfully added"
        })
    }
    catch(err){
        return res.send(err) 
    }


})

// feed endpoint
router.post('/feed',authorize, async (req,res) => {
    user = req.user

    if(user.role == 0){
        // teacher feed
        tutor = await Tutor.findOne(_id = user.id)

        classrooms = tutor.classrooms
        console.log(tutor.name);
        feed = {}
        for await (classobject of classrooms) {
            classroom = await Classroom.findOne({_id : classobject})
            files = classroom.files
            feed_class = {
                "title" : classroom.title,
                "files" : []
            }            
            for await (fileobject of files){
                file = await Files.findOne({_id : fileobject})
                feed_file  = {
                    fileobject : {
                        "name" : file.name,
                        "location" : file.location,
                        "type" : file.type
                    }
                }
                feed_class["files"].push(feed_file)
            }
            feed[classobject] = feed_class;
            
        };
        return res.send(feed)
    }

    if(user.role == 1){
        // student feed
        student = await Student.findOne(_id = user.id)
        classrooms = student.classrooms
        feed = {}
        for await (classobject of classrooms) {
            classroom = await Classroom.findOne({_id : classobject})
            files = classroom.files

            feed_class = {
                "title" : classroom.title,
                "files" : []
            }          
            for await (fileobject of files){
                file = await Files.findOne({_id : fileobject})
                feed_file  = {
                    fileobject : {
                        "name" : file.name,
                        "location" : file.location,
                        "type" : file.type
                    }
                }
                feed_class["files"].push(feed_file)
            }
            
            feed[classobject] = feed_class;
            
        };
        return res.send(feed)
    }
})

// query search
router.post('/feed/search', authorize, async (req,res) => {
    query_parama = req.query
    data = req.body
    user = req.user
    if(user.role == 1){


        classroom = await Classroom.findOne({_id : data.class_id})
        student = await Student.findOne({_id : user._id})  

        student_classes = student.classrooms
        if (student_classes.indexOf(classroom) != -1) return res.status(400).json({
            "error" : "you are not part of this classroom"
        })
        
        if(query_parama.name){ name_regex = new RegExp(query_parama.name)}
        else{name_regex = new RegExp(".*")}

        if(query_parama.type) {
            files = await Files.find({
                classroom : classroom,
                type : query_parama.type ,
                name : { $regex: name_regex, $options: 'i' }
            })            
        }else{
            files = await Files.find({
                classroom : classroom, 
                name : { $regex: name_regex, $options: 'i' }
            })              
        }
        return res.send(files)
    }

    if(user.role == 0){
        
        if(! mongoose.Types.ObjectId.isValid(data.class_id)) return res.status(404).json({
            "error" : "invalid classroom id"
        })

        classroom = await Classroom.findOne({_id : data.class_id})
        if(!classroom) return res.status(404).json({
            "error" : "class does not exist"
        })

        if(classroom.tutor != user._id){
            if (student_classes.indexOf(classroom) != -1) return res.status(400).json({
                "error" : "you dont own the classroom"
            })            
        }
        if(query_parama.name){ name_regex = new RegExp(query_parama.name)}
        else{name_regex = new RegExp(".*")}

        if(query_parama.type) {
            files = await Files.find({
                classroom : classroom,
                type : query_parama.type ,
                name : { $regex: name_regex, $options: 'i' }
            })            
        }else{
            files = await Files.find({
                classroom : classroom, 
                name : { $regex: name_regex, $options: 'i' }
            })              
        }
        return res.send(files)
    }
})

module.exports = router