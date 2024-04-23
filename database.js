const mysql2 = require("mysql2");

const pool = mysql2.createPool(
    {
        host: "localhost",
        user: "root",
        password: "easybazaar",
        database: "easybazar"
    }
).promise();


async function getPassword()
{
    const result = await pool.query(`SELECT password
    FROM customer
    WHERE email = "mahmedbwop@gmail.com"`);
    console.log(result);
}


getPassword();