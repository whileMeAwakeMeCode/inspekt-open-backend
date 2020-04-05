const Env = require('dotenv').config() 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const cors = require('cors')
const log = require('./utils').log

const port = process.env.PORT || 3001

aws.config.update({
    accessKeyId:process.env.S3_ACCESS_KEY_ID,  
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, 
    region:process.env.S3_REGION        
})

const s3 = new aws.S3();
const upload = multer({
    storage:multerS3({
        s3,
        bucket:process.env.S3_MEDIAS_BUCKET,    
        contentType:multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
        metadata:function(req,file,callback){callback(null,{fieldName:file.fieldname})},
        key:function(req,file,callback){callback(null,'inspekt_'+Date.now())},
    })
});

app.use((req,res,next)=>{
    if(req.originalUrl === '/favicon.ico'){
        res.status(204).json({nope:true});
    }else{
        next();
    }
})

/// enable CORS ///
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*"); 
    res.header('Access-Control-Allow-Headers', "Content-Type, X-Requested-With, Origin, Accept");
    next()
})

app.use(bodyParser.urlencoded({
    parameterlimit:100000,
    limit:'50Mb',
    extended:true
}))

app.post('/upload',upload.array('filedata'),function(req,res){
    console.log('reqfiles : ',req.files);
    res.status(200).send('upload ok')
})

app.all('*', (req, res) => {
    log(`ERROR 404 : page not found`, "yellow")
    res.status(404).send("Oups! Il n'y a rien ici")
})

app.listen(port,function(){
    log(`
    === Inspekt Open Server running on ${port} ===
    `, "green")
})