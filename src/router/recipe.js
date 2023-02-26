let express =require("express")
let router = express.Router()
let Receipe = require("../connectionAndSchemas/recipeSchemas")
router.use(express.json())
let multer = require("multer")
router.use("/", express.static("uploads"));

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./uploads")
    },
    filename: (req, file, callback) => {
      callback(null, `imgae-${Date.now()}.${file.originalname}`)
    }
  })
  

  const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
      callback(null, true)
    } else {
      callback(new Error("only images is allowd"))
    }
  }
  
  const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
  });

router.get("/newrecipe", async(req, res)=>{
    try{
        let recipe = await Receipe.find()
        res.status(200).json({
            status:"Success",
            data:recipe
        })

    }catch(error){
        res.status(500).json({
            status:"Failed",
        })
    }
})

router.get("/newrecipe/:title", async(req, res) => {
    try {
      let data = await Receipe.find({title:req.params.title});
      res.send(data);
    } catch (e) {
      res.status(404).json({
        status: "Failed",
        message: e.message,
      });
    }
  });

router.post("/newrecipe", upload.single("image"), (req, res) => {
    const { filename } = req.file;
    const saveImage = Receipe({
        ...req.body,
        image: filename
    });
    saveImage
      .save()
      res.send("data uploaded succefully")
  });






module.exports=router