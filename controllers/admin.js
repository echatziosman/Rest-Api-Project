const User = require('../models/User');
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const blockUser = asyncErrorWrapper(async (req,res,next) =>{

    const {id} = req.params;
    const user = await User.findById(id);

    user.blocked = !user.blocked;
    await user.save();

    res.status(200)
    .json({
        success : true,
        message : "Block - Unblock Process Successfull"
    });
});

const deleteUser = asyncErrorWrapper (async (req,res,next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    await user.remove();

    res.status(200)
    .json({
        success : true,
        message : `${user.name} veritabanindan basariyla silindi `
    });
})

module.exports = {blockUser,deleteUser};