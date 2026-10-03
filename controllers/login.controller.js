const { getConnection, sql } = require('../database/connection');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const pool = await getConnection();

        const result = await pool
            .request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query(`
                SELECT id, username, nombre, email
                FROM Usuarios
                WHERE username = @username
                AND password = @password
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }

        res.json({
            message: 'Login exitoso',
            usuario: result.recordset[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al iniciar sesión'
        });
    }
};

module.exports = {
    login
};