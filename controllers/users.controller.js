const { getConnection, sql } = require('../database/connection');

const getUsers = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .query('SELECT * FROM Usuarios');

        res.json(result.recordset);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al obtener los usuarios'
        });
    }
};


const createUser = async (req, res) => {
    try {
        const { username, password, nombre, email } = req.body;

        const pool = await getConnection();

        await pool
            .request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .query(`
                INSERT INTO Usuarios (username, password, nombre, email)
                VALUES (@username, @password, @nombre, @email)
            `);

        res.status(201).json({
            message: 'Usuario creado correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al crear el usuario'
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, nombre, email } = req.body;

        const pool = await getConnection();

        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .query(`
                UPDATE Usuarios
                SET username = @username,
                    password = @password,
                    nombre = @nombre,
                    email = @email
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            message: 'Usuario actualizado correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al actualizar el usuario'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await getConnection();

        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM Usuarios
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            message: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al eliminar el usuario'
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};