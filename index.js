const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { getConnection } = require('./database/connection');
const usersRoutes = require('./routes/users.routes');
const loginRoutes = require('./routes/login.routes');

const app = express();
const PORT = 3000;


app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(__dirname));

app.use('/users', usersRoutes);
app.use('/login', loginRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/marco', (req, res) => {
    res.json({
        nombre: 'Grecia',
        materia: 'Desarrollo Web',
        mensaje: 'Ruta marco funcionando correctamente'
    });
});


app.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    });
});

app.get('/test-db', async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(
            'SELECT * FROM Usuarios'
        );

        res.json(result.recordset);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al conectar con la base de datos'
        });
    }
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});