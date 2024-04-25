const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const database = require(__dirname + "/database.js");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.set("view engine" , "ejs");

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
});

app.get("/login" , (req,res) => {
    res.render("loginandsignup" , {type : "Log in"});
});

app.post("/login" , async (req,res) => {
    const {email,password} = req.body;  
    const result = await database.getPassword(email);
    console.log(result);
    if(!result[0].password)
    {
        res.send("You entered the wrong email");
    }
    const isValid = await  bcrypt.compare(password , result[0].password);
    if(isValid)
    {
        res.redirect("/home");
        return;
    }
    else
    {
        res.send("Login failed");
    }
});

app.get("/signup" , async (req,res) => {
    res.render("loginandsignup" , {type: "Sign up"});
});


app.post("/userchoice" , (req,res) => {
    console.log("received");
    res.redirect("/signup");
});


app.post("/signup" , (req,res) => {
    res.redirect("/login");
})

app.get("/home" , (req,res) => {
    res.render("home");
});