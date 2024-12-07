const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "sakila",
    port: process.env.DB_PORT || 3306,
};

async function testConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL successfully!");
        await connection.end();
    } catch (error) {
        console.error("Error connecting to MySQL:", error);
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
pool.getConnection()
    .then(connection => {
        console.log("Connected to the database with pooling.");
        connection.release();  // Always release the connection back to the pool
    })
    .catch(error => {
        console.error("Error connecting to the database with pooling:", error);
    });
module.exports = pool;

testConnection();
