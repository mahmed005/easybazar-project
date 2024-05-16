const mysql2 = require("mysql2");

const pool = mysql2.createPool(
    {
        host: "localhost",
        user: "root",
        password: "easybazaar",
        database: "easybazar"
    }
).promise();


exports.getPassword = async function getPassword(email) {
    const [result] = await pool.query(`SELECT password
    FROM customer
    WHERE email = ?` , [email]);
    return result;
}

exports.enterRecord = async function enterRecord(password) {
    const [result] = await pool.query(`
    INSERT INTO customer
    VALUES ("c3" , "Muhammad" , "Ahmed" , "mahmed@gmail.com" , "03655356353" , ?)` , [password]);
    return result;
}

exports.getCategoryProducts = async function (categoryID, limit) {
    const [result] = await pool.query(`
    SELECT p_id, p_name, pic_path
    FROM products
    WHERE cat_id = ?
     LIMIT ?` , [categoryID, limit]);
    return result;
}

exports.getCategoryProducts = async function (categoryID) {
    const [result] = await pool.query(`
    SELECT p_id, p_name, pic_path, p_description, price
    FROM products
    WHERE cat_id = ?` , [categoryID]);
    return result;
}

exports.getCategories = async function () {
    const [result] = await pool.query(`
    SELECT *
    FROM category`);
    return result;
}

// async function addProduct()
// {
//     const result = await pool.query(`
//     INSERT INTO products
//     VALUES ("p1" , "Laptop" , 3 , "delivery.jpg" , "s1" , "cat1" , "Hello") `); 
//     return result;
// }
// addProduct();

exports.getProduct = async function (id) {
    const [result] = await pool.query(`
    SELECT p_id,p_name,stock,pic_path,p_description,price
    FROM products
    WHERE p_id = ?` , [id]);
    return result;
}

exports.addToWishlist = async function (productId, customerId) {
    let  result;
    try {
        [result] = await pool.query(`
    INSERT INTO wishlist
    VALUES(?, ?)` , [customerId, productId]);
    }
    catch(error)
    {
        return undefined;
    }
    return result;
}

exports.addOrder = async function (cid,todayDate, amount) {
    const [result] = await pool.query(`
    INSERT INTO orders
    VALUES(default , ? , ? , ? , default)` , [cid , todayDate , amount]);
    return result;
}

exports.addOrderDetail = async function (orderID , p_id , quantity , subtotal) {
    const [result] = await pool.query(`
    INSERT INTO order_details
    VALUES( ? , ? ,? , ?);
    ` , [orderID , p_id , quantity , subtotal]);
    return result;
}

exports.getOrders = async function(cid) {
    const [result] = await pool.query(`
    SELECT * 
    FROM orders
    WHERE c_id = ?
    ` , [cid]);
    return result;
}

exports.getOrderDetails = async function(orderID) {
    const [result] = await pool.query(`
    SELECT *
    FROM order_product_details
    WHERE o_id = ?` , [orderID]);
    return result;
}





