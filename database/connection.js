const sql = require('mssql');
require('dotenv').config();

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        console.log('Conexión exitosa a SQL Server');
        return pool;
    } catch (error) {
        console.error('Error de conexión a SQL Server:', error);
        throw error;
    }
}

module.exports = {
    getConnection,
    sql
};