const mongoose = require('mongoose');

// Callback-Promise
const connectDatabase = () => {

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:false
    })
    .then( () =>{
        console.log("MongoDb Connection Successfull");
    })
    .catch( err => {
        console.error(err);
    }); 
};

module.exports = connectDatabase;