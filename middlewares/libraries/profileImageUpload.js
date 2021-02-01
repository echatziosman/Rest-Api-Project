const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

const storage = multer.diskStorage({
    
    // Dosyanin nereye kaydedilecegini belirler
    destination: function (req, file, cb) {
          
        const rootDir = path.dirname(require.main.filename); //main dosyamizin yani server.js yolunu aliyoruz
        cb(null,path.join(rootDir,"/public/uploads")); //Dosyanin nereye kaydedileceginin adresini veriyoruz
      
    },
    // Dosya(Resim) ismi hangi sekilde kaydedilecegini belirler 
    filename : function (req,file,cb){
                                    // image/png
        const extension  = file.mimetype.split("/")[1]; //png
        req.savedProfileImage = "image_" + req.user.id + "." + extension; //Veritabanina bu sekilde kaydedecek 
        cb(null,req.savedProfileImage);
    }  
});
// FileFilter : Hangi dosyalarin kabul edilecegini belirledigimiz
const fileFilter = (req,file,cb) =>{
           
    let allowedMimeTypes = ["image/jpg","image/jpeg","image/gif","image/png"];
    if(!allowedMimeTypes.includes(file.mimetype)) //file.mimetype: dosyanin uzantisini verir
    {
        return cb(new CustomError("Please provide a valid image file",400),false);
    }  
    return cb(null,true);
}
// Middleware
const profileImageUpload = multer({storage,fileFilter});

module.exports = profileImageUpload;