const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, (file.originalname).split(".")[0]+ new Date().getTime()+path.extname(file.originalname))
  },
  destination: function (req, file, cb) {
    cb(null, './uploads')
  }
})

const audioFileFilter = (req,file,cb)=>{
    var filetypes = /mp3/;
    const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = filetypes.test(file.mimetype);
    if(extname){
        return cb(null,true);
    } else {
        return cb("Error: filetype not audio");
    }
}

const imageFileFilter = (req,file,cb)=>{
    var filetypes = /png|jpg|jpeg|svg|gif/;
    const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    } else {
        return cb("Error: filetype not audio");
    }
}

const videoFileFilter = (req,file,cb)=>{
    var filetypes = /mp4/;
    const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = filetypes.test(file.mimetype);
    if(extname){
        return cb(null,true);
    } else {
        return cb("Error: filetype not video");
    }
}

module.exports.uploadAudio = multer(
    {   
        storage,
        fileFilter : audioFileFilter
    }
)

module.exports.uploadImage = multer(
    {   
        storage,
        fileFilter : imageFileFilter
    } 
)

module.exports.uploadVideo = multer(
    {   
        storage,
        fileFilter : videoFileFilter
    }
)