const router = require('express').Router();
const {studentRegisterValidation,studentLoginValidation} = require('../validations/student_auth_validation')
const Student = require('../models/Student')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// registration tutor route
router.post('/register', async (req,res)=>{
    const data = req.body
    
    
    // validation error
    const {error} = studentRegisterValidation(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // check if user exists
    const emailExist = await Student.findOne({email : data.email})
    if(emailExist) return res.status(400).json({
        "error" : "email already exists"
    })

    // check for duplicate rollnumber
    const roll_number_exists = await Student.findOne({roll_number : data.roll_number})
    if(roll_number_exists) return res.status(400).json({
        "error" : "roll number already exists"
    })


    // password encrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password,salt)

    // create user object
    const user = new Student({
        name : data.name,
        email : data.email,
        password : hashedPassword,
        roll_number : data.roll_number
    })

    // save user
    try{
        const savedUser = await user.save()
        res.json({
            "_id" : savedUser.id,
            "name" : savedUser.name,
            "email" : savedUser.email,
            "roll_number" : savedUser.roll_number
        })

    }catch(err){
        res.status(400).send(err)
    }


})

router.post('/login', async(req,res) => {
    const data = req.body

    // validation error
    const {error} = studentLoginValidation(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // check if user exists
    const user = await Student.findOne({email : data.email})
    if(!user) return res.status(400).json({
        "error" : "email does not exist"
    })

    // check is password is valid
    const validPassword = await bcrypt.compare(data.password, user.password)
    if(!validPassword) return res.status(400).json({
        "error" : "password incorrect"
    }) 

    if(validPassword){
        // jwt token created and sent
        const token = jwt.sign({ _id: user._id, role : user.role}, process.env.JWT_SECRETE)
        res.status(200).json({
            "_id" : user._id,
            "roll_number" : user.roll_number,
            "name" : user.name,
            "email" : user.email,
            "token" : token
        })
    }

})

module.exports = router