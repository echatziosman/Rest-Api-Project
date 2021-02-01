const User = require("../../models/User");
const Question = require("../../models/Question");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const checkUserExist = asyncErrorWrapper(async (req,res,next) =>{

    const {id} = req.params;

    const user = await User.findById(id);
    if(!user){
        return next(new CustomError("Boyle Bir Kullanici Bulunamadi..",400));
    }
    // req.data = user (boyle de yapabiliriz controller sinifindan veritabani sorgusu yapmadan req icinden veriye ulasabiliriz)
    next();
    
});
const checkQuestionExist = asyncErrorWrapper(async (req,res,next) =>{

    const {id} = req.params;

    const question = await Question.findById(id);
    if(!question){
        return next(new CustomError("Boyle Bir Soru Bulunamadi..",400));
    }
    // req.data = user (boyle de yapabiliriz controller sinifindan veritabani sorgusu yapmadan req icinden veriye ulasabiliriz)
    next();
    
});

module.exports = {checkUserExist,checkQuestionExist};