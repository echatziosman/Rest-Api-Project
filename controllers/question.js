const Question = require("../models/Question");
const asyncErrorWrapper = require("express-async-handler");



const askNewQuestion =asyncErrorWrapper(async (req,res,next)   =>{
    
    const information = req.body;
    const question = await Question.create({
        ...information, // Diger turlu: title: information.title olur
        user : req.user.id // Kullanici giris yaptigi icin user, req'in icinde
    });
});

   
/*
const getSingleQuestion = asyncErrorWrapper(async (req,res,next)   =>{
    
   const { id }  = req.params;
   const question = await Question.findById(id);

    res.status(200).json({
        success: true,
        data : question
    });
});   */

module.exports = {
    askNewQuestion,getAllQuestions
};