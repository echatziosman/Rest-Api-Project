const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err,req,res,next) => {
    
    let customError = err;
    if (err.name === "MongoError" && err.code === 11000) {
        customError = new CustomError("Boyle bir kullanici mevcut",400);
        };
    if(err.name === "CastError"){ 
        customError = new CustomError("Lutfen dogru bir kullanici id'si giriniz.",400);
    }
   
    res.status(customError.status || 500).json({
        success : false,
        name : customError.name,
        message: customError.message
    });
};

module.exports = customErrorHandler;