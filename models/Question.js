const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({

    title : {
        type : String,
        required : [true,"Please provide a title"],
        minlength : [10,"Please provide a title at least 10 characters"],
        unique : true
    },
    content :{
        type : String,
        required : [true,"Please provide a content"],
        minlength : [20,"Please provide a content at least 15 characters"]
    },
    slug : String,

    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId, // Giris yapmis kullanicinin id'si
        required : true,
        ref : "User"
    }
});
QuestionSchema.pre("save",function(next){
    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});
QuestionSchema.methods.makeSlug = function(){
    return slugify(this.title, {
        replacement: '-', 
        remove: /[*+~.()'"!:@]/g, 
        lower: true
      });
};
module.exports = mongoose.model("Question",QuestionSchema);