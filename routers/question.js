const express = require("express");
const router = express.Router();
const {askNewQuestion,getAllQuestions} = require("../controllers/question");
const {getAccessToRoute} = require("../middlewares/authorization/auth");

router.get("/",getAllQuestions);



module.exports = router;