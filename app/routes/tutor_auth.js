const router = require('express').Router();
const {tutorRegisterValidation,tutorLoginValidation} = require('../validations/tutor_auth_validation')
const Tutor = require('../models/Tutor')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// registration tutor route
router.post('/register', async (req,res)=>{
    const data = req.body
    
    
    // validation error
    const {error} = tutorRegisterValidation(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // check if user exists
    const emailExist = await Tutor.findOne({email : data.email})
    if(emailExist) return res.status(400).json({
        "error" : "email already exists"
    })

    // password encrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password,salt)

    // create user object
    const tutor = new Tutor({
        name : data.name,
        email : data.email,
        password : hashedPassword,
    })

    // save user
    try{
        const savedUser = await tutor.save()
        res.json({
            "_id" : savedUser.id,
            "name" : savedUser.name,
            "email" : savedUser.email,
        })

    }catch(err){
        res.status(400).send(err)
    }


})

router.post('/login', async(req,res) => {
    const data = req.body

    // validation error
    const {error} = tutorLoginValidation(data)
    if(error) return res.status(400).json({
        "error" : error.details[0].message
    })

    // check if user exists
    const tutor = await Tutor.findOne({email : data.email})
    if(!tutor) return res.status(400).json({
        "error" : "email does not exist"
    })

    // check is password is valid
    const validPassword = await bcrypt.compare(data.password, tutor.password)
    if(!validPassword) return res.status(400).json({
        "error" : "password incorrect"
    }) 

    if(validPassword){
        // jwt token created and sent
        const token = jwt.sign({ _id: tutor._id, role : tutor.role}, process.env.JWT_SECRETE)
        res.status(200).json({
            "_id" : tutor._id,
            "_id" : tutor.id,
            "name" : tutor.name,
            "email" : tutor.email,
            "token" : token
        })
    }

})

module.exports = router