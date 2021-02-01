const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");

dotenv.config({
   path : "./config/env/config.env" 
});

// MongoDB Connection
connectDatabase();


const PORT = process.env.PORT;

const app = express();
// Express - body.req (Middleware)
app.use(express.json());
// Routers Middleware
app.use("/api",routers);
app.use(customErrorHandler);

// Static Files (images,css,html..) ornegin: localhost:5000/uploads/index.html sayfasina erismek icin
app.use(express.static(path.join(__dirname,"public")));

app.listen(PORT, () =>{
    console.log(`Server started on ${PORT}: ${process.env.NODE_ENV}`);
});
