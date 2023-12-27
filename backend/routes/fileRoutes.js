const multer = require("multer");
const path = require('path');

const express = require("express");

const router = express.Router();

const multerStorageFile = multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log(req.originalUrl);
      var destination = "../static/images/";
      req.destination=path.join(__dirname, destination);
      // console.log(req);
      cb(null, req.destination);
        
    },
    filename: (req, file, cb) => {
    //   const ext = file.mimetype.split('/')[1];
    
      const ext=file.originalname.split(".")[file.originalname.split(".").length-1];

      
        var name = `${Date.now()}.${ext}`;
        req.name=name;
        console.log(req.name);
        cb(null, name);
    }
  });

  const multerFilterFile = (req, file, cb) => {
      // console.log("file mimetype:" + file.mimetype);
    cb(null, true);
  };



var uploadFiles = multer({
  storage: multerStorageFile,
  fileFilter: multerFilterFile,
});

 // route : {root}/shopping/

router.post("/image_upload",uploadFiles.single('file'), async (req, res, next) => {

    if(req.name){
        console.log("image is saved");
        console.log(req.name);
        res.status(200).json({status:"success",data:req.name});
    }
    else{
        console.log("failed");
        res.status(200).json({status:"failed"});
    }


});


module.exports = router;

 

