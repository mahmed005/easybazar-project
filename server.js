const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const database = require(__dirname + "/database.js");
const multer = require("multer");

const app = express();
const upload = multer({dest: __dirname + "/public/uploads"});

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

app.post("/signup" , (req,res) => {
    res.redirect("/login");
})


app.post("/userchoice" , (req,res) => {
    console.log("received");
    res.redirect("/signup");
});


app.get("/home" , async (req,res) => {
    // res.render("home");
    const categories = await database.getCategories();
    if(categories.length != 0)
    {
        for(let  i = 0 ; i < categories.length; i++ )
        {
            const category = categories[i].cat_id;
            const products = await database.getCategoryProducts(category , 3);
            for(let j = 0; j < products.length ; j++)
            {
                products[j].pic_path = "/uploads/" + products[j].pic_path;
            }
            categories[i]["products"] = products;
        }
    }
    res.render("home" , {categories});
});

// app.get("/test" , upload.single("./Images/delivery.jpg" ,  async (req,res) => {
//     const result = await database.addProduct(req.file.path);
//     console.log(result);
// }));

app.get("/products" , (req,res) => {
    res.render("product-list");

});

app.get("/products/:id" , async (req,res) => {
    const {id} = req.params;
    const result = await database.getProduct(id);
    console.log(result);
})