const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
    const token = req.header('auth-token')
    if(!token) return res.status(401).json({
        "error" : "token not provided"
    })

    try{
        const verified = jwt.verify(token,process.env.JWT_SECRETE)
        req.user = verified
        next()
    }catch(err){
        res.status(400).json({
            "error" : err
        })
    }
}