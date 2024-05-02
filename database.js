const mysql2 = require("mysql2");

const pool = mysql2.createPool(
    {
        host: "localhost",
        user: "root",
        password: "easybazaar",
        database: "easybazar"
    }
).promise();


exports.getPassword =  async function getPassword(email)
{
    const [result] = await pool.query(`SELECT password
    FROM customer
    WHERE email = ?` , [email]);
    return result;
}

exports.enterRecord = async function enterRecord(password)
{
    const [result] = await pool.query(`
    INSERT INTO customer
    VALUES ("c3" , "Muhammad" , "Ahmed" , "mahmed@gmail.com" , "03655356353" , ?)` , [password]);
    return result;
}

exports.getCategoryProducts = async function (categoryID , limit)
{
    const[result] = await pool.query(`
    SELECT p_id, p_name, pic_path
    FROM products
    WHERE cat_id = ?
     LIMIT ?` , [categoryID , limit]);
    return result;
}

exports.getCategories  = async function()
{
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

exports.getProduct = async function(id) {
    const [result] = await pool.query(`
    SELECT p_id,p_name,stock,pic_path,p_description
    FROM products
    WHERE p_id = ?` , [id]);
    return result;
}





