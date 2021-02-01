const bcrypt = require("bcryptjs");

const validateUserInput = (email,password) =>{
    
    // burada email veya password alani bos oldugunda, bize false degeri dondurecektir
    return (email && password);
};

const comparePassword = (password,hashedPassword) => {
     
    return bcrypt.compareSync(password,hashedPassword);// karsilastiriyor,esit ise true dondurecek
};

module.exports = {
    validateUserInput,comparePassword
};