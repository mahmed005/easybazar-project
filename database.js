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
    VALUES ("c2" , "Muhammad" , "Ahmed" , "mahmedbwp@gmail.com" , "03155356353" , ?)` , [password]);
    return result;
}

