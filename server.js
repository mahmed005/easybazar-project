const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine" , ejs);

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
});

app.get("/login" , (req,res) => {

})

app.post("/login" , (req,res) = > {
    
})