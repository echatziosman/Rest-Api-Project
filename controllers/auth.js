const User = require('../models/User');
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const {validateUserInput,comparePassword} = require("../helpers/input/inputHelpers");
const CustomError = require('../helpers/error/CustomError');
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper(async (req,res,next) =>{
    
    // //Post
    // const name = "Enes Chatzi Osman";
    // const email = "e.chatziosman@yahoo.com";
    // const password = "123456";
     
         // async-await
        const {name,email,password,role} = req.body;//post ile gonderdigimiz veriler
        const user = await User.create({
            name,email,password,role
        });

        sendJwtToClient(user,res); //Kullaniciya token ver
  
});

const login = asyncErrorWrapper(async (req,res,next) => {
    
    const  {email,password} = req.body;
    // Istenilen alanlar girildi mi?
    if(!validateUserInput(email,password))
    {
       return next(new CustomError("Please Check Your Inputs..",400));
    }
    // User'i veritabanindan email ile sorgula
    const user = await User.findOne({email}).select("+password");
     if(user === null)
     {
         return next(new CustomError("Check your email, please",400));
     }
    //girilen password ile kayitli password'u karsilastir
    if(!comparePassword(password,user.password))
    {
        return next (new CustomError("Please check your credentials",400));
    }
    // Kullaniciya token ver
    sendJwtToClient(user,res);

});

const logout = asyncErrorWrapper(async (req,res,next) =>{
    
    const {NODE_ENV} = process.env;

    return res.status(200).  
    cookie({
        httpOnly : true,
        expires : new Date(Date.now()),  // Cookie'yi sifirlama
        secure : NODE_ENV === "development" ? false : true
    }).
    json({
        success : true,
        message : "Logout Successfull"
    });
});

const getUser = (req,res,next) =>{
    res.json({
        success : true,
        data : {
            id : req.user.id,
            name : req.user.name
        }
    });
};

const imageUpload = asyncErrorWrapper(async (req,res,next) =>{
    
    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true, // guncellenmesini belirtiyoruz
        runValidators : true
    });

    res.status(200).
    json({
        success : true,
        message : "Image Upload Successfull",
        data : user
    });
});
// Forgot Password
const forgotPassword = asyncErrorWrapper(async (req,res,next) =>{
     // Kullanicinin girdigi email'i aliyoruz 
    const resetEmail = req.body.email;
    const user = await User.findOne({email: resetEmail});
    
    if(!user)
    {
        return next(new CustomError("There is no user with that email",400));
    }
    //Olusturulmus hash'li token bu degiskende (resetPasswordToken)
    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();
    //Kullanicinin mail'de tiklayacagi link adresi
    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    // Mail icerigi(Baslik,link...)
    const emailTemplate = `
    <h3>Reset Your Password<h3/>
    <p>This <a href='${resetPasswordUrl}' target = '_blank'> link <a/> will expire in 1 hour <p/>

    `;
    //Hata olursa kendim yakalamak istiyorum
    try{
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset Your Password",
            html : emailTemplate
        });
        return res.status(200).json({
            success : true,
            message : "Token Sent To Your Email"
        });
    }
    catch(err)
    {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Sent",500));
    }

});
//Password Sifirlama
const resetPassword = asyncErrorWrapper(async (req,res,next) =>{
    
    const {resetPasswordToken} = req.query;
    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token",400));
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()} //bu token suresinin simdiki zamandan daha buyukse getir diyoruz.
    });
    // Eger token alinamadiysa veya suresi gectiyse user gelmeyecek,bunu kontrol ediyoruz
    if(!user)
    {
        return next(new CustomError("Invalid token or Session Expired",400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).
    json({
        success : true,
        message : "Reset Password Process Successfull"
    });
});

const editDetails = asyncErrorWrapper(async (req,res,next) =>{
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(req.user.id,editInformation,{
        new : true,
        runValidators : true
    });

    return res.status(200)
    .json({
        success : true,
        data : user
    });
});

module.exports = {
    register,login,logout,getUser,imageUpload,forgotPassword,resetPassword,editDetails
};