const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const database = require(__dirname + "/database.js");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage });

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
    const { email, password , option} = req.body;
    const result = await database.getPassword(email);
    const userId = result[0].u_id;
    if (!result[0].password) {
        res.send({message: "no"});
    }
    const isValid = await bcrypt.compare(password, result[0].password);
    if (isValid) {
        if(option === "buyer") {
            const response = await database.getCustomer(userId);
            res.send(response);
            return;
        } else {
            const response = await database.getSeller(userId);
            res.send(response);
            return;
        }
    }
    else {
        res.send({message: "no"});
    }
});

app.get("/signup", async (req, res) => {
    res.render("loginandsignup", { type: "Sign up" });
});

app.post("/signup", async (req, res) => {
    const {option,firstName,lastName,email,phNum,password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const response = await database.enterUser(option,firstName,lastName,email,phNum,hashPassword);
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

app.post("/buynow", async (req, res) => {
    const products = JSON.parse(req.body.products);
    const cid = req.body.cid;
    const todayDate = new Date();
    const formattedDate = todayDate.toISOString().split('T')[0];
    let totalAmount = 0;
    for (let i = 0; i < products.length; i++) {
        totalAmount += Number(products[i].price) * Number(products[i].quantity);
    }
    const response = await database.addOrder(cid, formattedDate, totalAmount);
    const orderID = response.insertId;
    for (let i = 0; i < products.length; i++) {
        const subTotal = Number(products[i].price) * Number(products[i].quantity);
        const result = await database.addOrderDetail(orderID, products[i].p_id, products[i].quantity, subTotal);
    }
    res.send("Done");
});

app.get("/mypurchases", (req, res) => {
    res.render("mypurchases");
})

app.post("/mypurchasesfetch", async (req, res) => {
    const cid = req.body.cid;
    const response = await database.getOrders(cid);
    for (let i = 0; i < response.length; i++) {
        if (typeof response[i].o_date === 'object' && response[i].o_date instanceof Date) {
            response[i].o_date = response[i].o_date.toISOString().split("T")[0];
        }
    }
    res.send(response);
});

app.get("/order-details", async (req, res) => {
    const orderID = req.query.oid;
    const response = await database.getOrderDetails(orderID);
    for (let i = 0; i < response.length; i++) {
        response[i].pic_path = "/uploads/" + response[i].pic_path;
    }
    res.render("order-details", { response });
});

app.post("/removeorder", async (req, res) => {
    const { oid } = req.body;
    const result = await database.removeOrder(oid);
    res.send(result);
})

app.get("/wishlist", (req, res) => {
    res.render("wishlist");
});

app.post("/wishlistret", async (req, res) => {
    const cid = req.body.cid;
    const response = await database.getWishlist(cid);
    for (let i = 0; i < response.length; i++) {
        response[i].pic_path = "/uploads/" + response[i].pic_path;
    }
    res.send(response);
});

app.post("/wishlistremove", async (req, res) => {
    const { cid, pid } = req.body;
    const response = await database.removeFromWishlist(cid, pid);
    res.send(response);
});

app.get('/sellerhome' , async (req,res) => {
    res.render("sellerhome");
});

app.post("/sellerhome" , async (req,res) => {
    const {sid} = req.body;
    const lowStockReport = [];
    const sellerOrders = await database.getSellerOrders(sid);
    const sellerDetails = await database.getSellerDetails(sid);
    const StockReport = await database.getLowStockReport(sid);
    for(let i = 0; i <  StockReport.length; i++)
        {
            if(StockReport[i].stock <= 10)
                {
                    lowStockReport.push(StockReport[i]);
                }
        }
    const response = [sellerOrders,sellerDetails,lowStockReport];
    console.log(response);
    res.send(response);
})

app.get("/sellerorders", (req, res) => {
    res.render("sellerorders");
});

app.post("/sellerorders", async (req, res) => {
    const { sid } = req.body;
    const response = await database.getSellerOrders(sid);
    for (let i = 0; i < response.length; i++) {
        if (typeof response[i].o_date === 'object' && response[i].o_date instanceof Date) {
            response[i].o_date = response[i].o_date.toISOString().split("T")[0];
        }
    }
    res.send(response);
});

app.post("/sellerpaymentdetails", async (req, res) => {
    const { oid } = req.body;
    const response = await database.getSellerPaymentDetails(oid);
    res.send(response);
});

app.get("/sellerproducts", (req, res) => {
    res.render("sellerproducts");
});

app.post("/sellerproducts", async (req, res) => {
    const { sid } = req.body;
    const response = [];
    const categories = await database.getCategories();
    const products = await database.getSellerProducts(sid);
    response.push(categories, products);
    res.send(response);
})

app.post("/productsadd", upload.single('picture'), async (req, res, next) => {
    const picPath = req.file.filename;
    const { pname, price, stock, desc, sid, category } = req.body;
    console.log(category);
    const categories = await database.getCategories();
    let categoryID;
    for (let i = 0; i < categories.length; i++) {
        if (category == categories[i].name) {
            categoryID = categories[i].cat_id;
            break;
        }
    }
    const sellerCategories = await database.getSellerCategories(sid);
    let isOldCategory = false;
    if (sellerCategories.length == 2) {
        for (let i = 0; i < sellerCategories.length; i++) {
            if (sellerCategories[i].cat_id == categoryID) {
                isOldCategory = true;
            }
        }
    } else {
        const response = await database.addProduct(pname, price, stock, desc, categoryID, sid, picPath);
    }
    if (isOldCategory) {
        const response = database.addProduct(pname, price, stock, desc, categoryID, sid, picPath);
    }
    res.redirect("/sellerproducts");
});

app.post("/productremove", (req, res) => {
    const { sid, pid } = req.body;
    const response = database.removeProduct(sid, pid);
    res.redirect("/sellerproducts");
});

app.get('/stock', (req, res) => {
    res.render("stock");
});

app.post('/stock', async (req, res) => {
    const { sid } = req.body;
    const response = await database.getSellerProducts(sid);
    res.send(response);
});

app.post('/updatestock', async (req, res) => {
    const { sid, pid, pqty } = req.body;
    const response = await database.updateStock(sid, pid, pqty);
    if (response.serverStatus == 2)
        res.redirect("/stock");
});

app.post("/updatesellerpayment", async (req, res) => {
    const { oid, cid } = req.body;
    const response = await database.updateSellerPayment(oid, cid);
    res.send(response);
});

app.post("/updatesellerorderstatus", async (req, res) => {
    const { oid, status, cid } = req.body;
    const response = await database.updateSellerOrderStatus(oid, status);
    const paymentResponse = await database.updateSellerPayment(oid, cid);
    res.send(response);
});

app.get('/category', (req, res) => {
    res.render("admincategory");
});

app.get('/getcategories', async (req, res) => {
    const response = await database.getCategories();
    res.send(response);
});

app.post('/category', async (req, res) => {
    const { cat_name } = req.body;
    const response = await database.addCategory(cat_name);
    res.redirect('/category');
});

app.get('/adminhome', async (req, res) => {
    const response = await database.getAdminData();
    res.render("adminhome", { response });
});

app.post('/adminhome', async (req, res) => {
    const { button } = req.body;
    if (button === "upload") {
        const { percentage } = req.body;
        const response = await database.addDiscount(percentage);
    } else {
        const response = await database.removeDiscount(button);
    }
    res.redirect("/adminhome");
});





