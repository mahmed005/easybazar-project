const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const database = require(__dirname + "/database.js");
const multer = require("multer");

const app = express();
const upload = multer({ dest: __dirname + "/public/uploads" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/login", (req, res) => {
    res.render("loginandsignup", { type: "Log in" });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await database.getPassword(email);
    console.log(result);
    if (!result[0].password) {
        res.send("You entered the wrong email");
    }
    const isValid = await bcrypt.compare(password, result[0].password);
    if (isValid) {
        res.redirect("/home");
        return;
    }
    else {
        res.send("Login failed");
    }
});

app.get("/signup", async (req, res) => {
    res.render("loginandsignup", { type: "Sign up" });
});

app.post("/signup", (req, res) => {
    res.redirect("/login");
})


app.post("/userchoice", (req, res) => {
    console.log("received");
    res.redirect("/signup");
});


app.get("/home", async (req, res) => {
    const categories = await database.getCategories();
    if (categories.length != 0) {
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i].cat_id;
            const products = await database.getCategoryProducts(category, 3);
            for (let j = 0; j < products.length; j++) {
                products[j].pic_path = "/uploads/" + products[j].pic_path;
            }
            categories[i]["products"] = products;
        }
    }
    res.render("home", { categories });
});


app.get("/products", async (req, res) => {
    const catId = req.query.category;
    const products = await database.getCategoryProducts(catId);
    for (let j = 0; j < products.length; j++) {
        products[j].pic_path = "/uploads/" + products[j].pic_path;
    }
    res.render("product-list", { products });
});


app.post("/wishlist", async (req, res) => {
    const answerObject = {
        message: "",
        result: {}
    };

    const { c_id, p_id } = req.body;
    const result = await database.addToWishlist(p_id, c_id);
    if (!result) {
        answerObject.message = "fail";
    }
    else {
        answerObject.message = "ok";
        answerObject.result = result;
    }
    res.send(JSON.stringify(answerObject));
});

app.get("/buynow", async (req, res) => {
    let { cart, pid } = req.query;
    const products = [];
    if (cart) {
        cart = JSON.parse(decodeURIComponent(cart));
        for (let i = 0; i < cart.length; i++) {
            const result = await database.getProduct(cart[i].pid);
            result[0].pic_path = "/uploads/" + result[i].pic_path;
            result[0]["quantity"] = cart[i].quantity;
            products.push(result[0]);
        }
    }
    else if (pid) {
        const result = await database.getProduct(pid);
        result[0].pic_path = "/uploads/" + result[i].pic_path;
        result[0]["quantity"] = 1;
        products.push(result[0]);
    }
    res.render("buypage", { products });
});

app.get("/cart-page", (req, res) => {
    res.render("cart");
})

app.post("/cart", async (req, res) => {
    const products = [];
    const cart = req.body;
    for (let i = 0; i < cart.length; i++) {
        const result = await database.getProduct(cart[i].pid);
        result[0].pic_path = "/uploads/" + result[i].pic_path;
        products.push(result[0]);
    }
    res.send(products);
});

app.post("/buynow" , async (req,res) => {
    const products = JSON.parse(req.body.products);
    const cid = req.body.cid;
    const todayDate = new Date();
    const formattedDate = todayDate.toISOString().split('T')[0];
    let totalAmount = 0;
    for(let i = 0; i < products.length ; i++)
        {
            totalAmount += Number(products[i].price) * Number(products[i].quantity);
        }
    const response = await database.addOrder(cid , formattedDate , totalAmount);
    const orderID = response.insertId;
    for(let i = 0; i < products.length ; i++)
        {
            const subTotal = Number(products[i].price) * Number(products[i].quantity);
            const result = await database.addOrderDetail(orderID , products[i].p_id ,products[i].quantity , subTotal);
        }
        res.send("Done");
});

app.get("/mypurchases" , (req,res) => {
    res.render("mypurchases");
})

app.post("/mypurchasesfetch" , async (req,res) => {
    const cid = req.body.cid;
    const response = await database.getOrders(cid);
    for(let i = 0; i < response.length ; i++)
        {
            if (typeof response[i].o_date === 'object' && response[i].o_date instanceof Date) {
                response[i].o_date = response[i].o_date.toISOString().split("T")[0];
            }            
        }
    res.send(response);
});

app.get("/order-details" , async (req,res) => {
    const orderID = req.query.oid;
    const response = await database.getOrderDetails(orderID);
    for(let i = 0; i < response.length ; i++)
        {
            response[i].pic_path = "/uploads/" + response[i].pic_path;
        }
        console.log(response);
        res.render("order-details" , {response});
})

