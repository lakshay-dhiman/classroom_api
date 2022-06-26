const Joi = require('@hapi/joi')

// creation validation
const createdClassroomValidate = (data)=>{
    const schema =  Joi.object({
        title:Joi.string().min(6).required()
    })

    return schema.validate(data)
}

// add students validation
const addStudentValidate = (data)=>{
    const schema =  Joi.object({
        roll_number:Joi.string().required(),
        class_id : Joi.string().required()
    })

    return schema.validate(data)
}


const addFilesValidate = (data)=>{
    const schema =  Joi.object({
        class_id:Joi.string().required(),
        name : Joi.string().required(),
        url: Joi.string().uri(),
        file: Joi.allow(),
        description : Joi.allow()
    })

    return schema.validate(data)
}

const deleteFilesValidate = (data)=>{
    const schema =  Joi.object({
        class_id:Joi.string().required(),
        name : Joi.string().required(),
        url: Joi.string().uri(),
        file: Joi.allow()
    })

    return schema.validate(data)
}
module.exports.createdClassroomValidate = createdClassroomValidate;
module.exports.addStudentValidate = addStudentValidate;
module.exports.addFilesValidate = addFilesValidate;
module.exports.deleteFilesValidate = deleteFilesValidate;



