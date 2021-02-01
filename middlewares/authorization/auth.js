const jwt = require("jsonwebtoken");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");
const User = require("../../models/User");
const getAccessToRoute = (req,res,next) => {
    const {JWT_SECRET_KEY} = process.env;
    // Token gelmediyse bir hata mesaji donduruyoruz
    //401 UnAuthorized
    //403 Forbidden (Sadece belirli kisilerin eristigi sayfa hatasi, ornegin admin)
    if(!isTokenIncluded(req))
    {
       return next(new CustomError("You are not authorized to access this page",401));
    }
    // Token geldi ve gecerli olup olmadigini kontrol et
    const accessToken = getAccessTokenFromHeader(req);

    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded) =>{
        if(err)
        {
            return next(new CustomError("You are not authorized to access this page",401));
        }
       req.user = {
           id : decoded.id,
           name : decoded.name
       };
        next();
    })
   
};

const getAdminAccess = asyncErrorWrapper(async (req,res,next) =>{
    const {id} = req.user;

    const user = await User.findById(id);
    if(user.role !== "admin"){
        return next(new CustomError("Bu sayfaya erisim hakkiniz yok",403));
    }
    next();
});

module.exports = {
    getAccessToRoute,getAdminAccess
};