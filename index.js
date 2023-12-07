require("dotenv").config();
const express= require('express');
const fileupload = require('express-fileupload');
const cloudinary = require("cloudinary").v2;

const app = express();


cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
})


//view engine middlewares
app.set('view engine', 'ejs');


//middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileupload({
    useTempFiles: true,
    tempFileDir:"/tmp/"
}));

app.get("/myget", (req,res)=>{
    console.log(req.query);

    res.send(req.query);
})
 
app.post("/mypost", async (req,res)=>{
    console.log(req.body);
    console.log(req.files);

    let result;
    let imageArray = [];

    //case - multiple images, samplefile is array now as multiple flag is passed in form
    if(req.files){
        for (let index = 0; index < req.files.samplefile.length; index++) {
            result = await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath,{ folder:"users"})

            imageArray.push({
                public_id: result.public_id,
                secure_url: result.secure_url
            })
        }

        
    }



    //## use case for single use-case
    // let file = req.files.samplefile

    // result = await cloudinary.uploader.upload(file.tempFilePath,{
    //     folder:'users'
    // })

    console.log(result);

    details = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        result,
        imageArray
    }

    console.log(details);

    res.send(details);
})

// just to render the forms- GET OF POST froms have to be rendered on .get
app.get("/mygetform", (req, res) => {
    res.render("getform");
  });
app.get("/mypostform", (req, res) => {
    res.render("postform");
  });

app.listen(4000, ()=> {console.log(`Server running on PORT 4000`)});