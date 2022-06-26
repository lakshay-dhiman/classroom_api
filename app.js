const express = require('express')
const app = express()

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const multer = require('multer')


dotenv.config()
// db connection
mongoose.connect(process.env.MONGO_CONNECT,
  ()=>{console.log('db connected')}
)

const port = process.env.PORT || 3000

// middlewares
app.use(express.json())

const tutorAuthRoute = require('./app/routes/tutor_auth')
const studentAuthRoute = require('./app/routes/student_auth')
const classroomRoute = require('./app/routes/classroom')
const uploadRoute = require('./app/routes/fileUpload')


// route middlewares
app.use('/api/tutor', tutorAuthRoute)
app.use('/api/student', studentAuthRoute)
app.use('/api/classroom',classroomRoute)
app.use('/api/classroom/upload_files',uploadRoute)


app.get('/',(req,res)=>{
  return res.send("welcom to the toddle challenge app")
})

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`)
})


