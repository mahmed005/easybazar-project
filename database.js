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

exports.addProduct = async function(pname,price,stock,desc,category,sid,picPath) {
    const result = await pool.query(`
    INSERT INTO products
    VALUES (default , ? , ? , ? , ? , ? , ? , ?) ` , [pname,stock,picPath,sid,category,desc,price]); 
    return result;
}

exports.getProduct = async function (id) {
    const [result] = await pool.query(`
    SELECT p_id,p_name,stock,pic_path,p_description,price
    FROM products
    WHERE p_id = ?` , [id]);
    return result;
}

exports.removeProduct = async function (sid,pid) {
    const[result] = await pool.query(`
    DELETE FROM products
    WHERE s_id = ? AND p_id = ? ` , [sid,pid]);
    return result;
}


exports.getSellerProducts = async function(sid) {
    const[result] = await pool.query(`
    SELECT * 
    FROM products 
    WHERE s_id = ?` , [sid]);
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

exports.getWishlist = async function(cid) {
    const [result] = await pool.query(`
    SELECT * 
    FROM wishlist_products
    WHERE c_id = ?` , [cid]);
    return result;
}

exports.removeFromWishlist = async function(cid,pid) {
    const [result] = await pool.query(`
    DELETE FROM wishlist
    WHERE c_id = ? AND  p_id = ?` , [cid,pid]);
    return result;
}


exports.getSellerOrders = async function(sid) {
    const [result] = await pool.query(`
    SELECT *
    FROM order_product_details
    JOIN orders
    ON order_product_details.o_id = orders.o_id
    JOIN customer
    ON orders.c_id = customer.c_id
    JOIN users 
    ON customer.u_id = users.u_id
    WHERE s_id = ?` , [sid]);
    return result;
}

exports.updateStock = async function(sid,pid,pqty) {
    const [result] = await pool.query(`
    UPDATE products
    SET stock = ?
    WHERE s_id = ? AND p_id = ?`, [pqty,sid,pid]);
    return result;
}

exports.getSellerPaymentDetails = async function(oid) {
    const [result] = await pool.query(`
    SELECT *
    FROM payment
    WHERE o_id = ?` , [oid]);
    return result;
}

exports.updateSellerPayment = async function(oid,cid) {
    const todayDate = new Date();
    const formattedDate = todayDate.toISOString().split('T')[0];
    const [result] = await pool.query(`
    INSERT INTO payment
    VALUES(default , ? , ? , "Cash On Deleivery" , ?)` , [oid,cid,formattedDate]);
    return result;
}

exports.updateSellerOrderStatus = async function(oid,status) {
    const [result] = await pool.query(`
    UPDATE orders
    SET o_status = ?
    WHERE o_id = ?` , [status,oid]);
    return result;
}

exports.getSellerCategories = async function(sid) {
    const [result] = await pool.query(`
    SELECT DISTINCT cat_id
    FROM products
    WHERE s_id = ?` , [sid]);
    return result;
}

exports.removeOrder = async function(oid) {
    const [result] = await pool.query(`
    DELETE FROM order_details
    WHERE o_id = ?` , [oid]);
    let result2;
    if(result){
     [result2] = await pool.query(`
    DELETE FROM orders
    WHERE o_id = ?` , [oid]);
    }
    return result2;
}

exports.addCategory = async function(catName) {
    const [result] = await pool.query(`
    INSERT INTO category
    VALUES(default,?)` , [catName]);
    return result;
}

exports.getAdminData = async function() {
    const [cResult] = await pool.query(`
    SELECT COUNT(c_id) AS count
    FROM customer`);
    const [sResult] = await pool.query(`
    SELECT COUNT(s_id) AS count
    FROM seller`);
    const [oResult] =  await pool.query(`
    SELECT COUNT(o_id) AS count
    FROM orders`);
    const [sumResult] = await pool.query(`
    SELECT SUM(amount) AS sum
    FROM orders`);
    const [dResult] = await pool.query(`
    SELECT *
    FROM discounts`);
    const result = [cResult,sResult,oResult,sumResult,dResult];
    return result;
}

exports.addDiscount = async function(percentage) {
    const [result] = await pool.query(`
    INSERT INTO discounts
    VALUES(default,?)`,[percentage]);
    await pool.query(`
    UPDATE products
    SET price = price - ((price*?)/100) `,[percentage]);
    return result;
}

exports.removeDiscount = async function(discountID) {
    const [result2] = await pool.query(`
    SELECT percentage 
    FROM discounts
    WHERE d_id = ?`,[discountID]);
    const percentage = result2[0].percentage;
    await pool.query(`
    UPDATE products
    SET price = (100*price)/(100-?)`,[percentage]);
    const [result] = await pool.query(`
    DELETE FROM discounts
    WHERE d_id = ?` , [discountID]);
    return result;
};

exports.getSellerDetails = async function(sid) {
    const [result] = await pool.query(`
    SELECT * 
    FROM seller
    WHERE s_id = ?` , [sid]);
    return result;
}

exports.getLowStockReport = async function(sid) {
    const [result] = await pool.query(`
    SELECT * 
    FROM seller
    natural join products
    WHERE s_id = ?` , [sid]);
    return result;
}




