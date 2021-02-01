const sendJwtToClient = (user,res) =>{
    // Token Olusturma(Uretme)
    const token = user.generateJwtFromUser();
    
    const {JWT_COOKIE,NODE_ENV} = process.env;
   
    return res.
    status(200).
    cookie("access_token",token,{
        httpOnly : true,
        expires : new Date(Date.now() + parseInt(JWT_COOKIE * 1000 * 60)),//Cookie suresini : Simdiki zamandan + 10 saniye ekliyoruz
        secure : NODE_ENV === "development" ? false : true
    })
    .json({
       success : true,
       access_token : token,
       data : {
           name :user.name,
           email : user.email
       }
    });
}
// Token'i barindiriyor mu diye kontrol eden fonksiyon(Token var mi yok mu)
const isTokenIncluded = req => {
   
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer:");
};
// Access Token'i req.header'den almak
const getAccessTokenFromHeader = (req) =>
{
    const authorization = req.headers.authorization;
    const access_token = authorization.split(" ")[1];//[0]:Bearer,[1]:token var
    return access_token;
}
module.exports = {
    sendJwtToClient,isTokenIncluded,getAccessTokenFromHeader
};