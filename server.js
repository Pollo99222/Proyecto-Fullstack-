// Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno desde .env

// Crear la aplicación de Express
const app = express();
const port = process.env.PORT || 3000; // Usar el puerto definido en el entorno o el puerto 3000 por defecto

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

// Configurar la conexión a la base de datos usando las variables de entorno
const db = mysql.createConnection({
    host: process.env.MYSQLHOST, // Host de la base de datos (desde .env o Railway)
    user: process.env.MYSQLUSER, // Usuario de la base de datos (desde .env o Railway)
    password: process.env.MYSQLPASSWORD, // Contraseña de la base de datos (desde .env o Railway)
    database: process.env.MYSQLDATABASE, // Nombre de la base de datos (desde .env o Railway)
    port: process.env.MYSQLPORT || 3306, // Puerto de la base de datos (desde .env o por defecto 3306)
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('¡El servidor está funcionando!');
});

// Ruta para obtener todas las tareas desde la base de datos
app.get('/tareas', (req, res) => {
    const sql = 'SELECT * FROM tareas';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Ruta para agregar una nueva tarea
app.post('/tareas', (req, res) => {
    const { descripcion, completada, creador } = req.body;
    const sql = 'INSERT INTO tareas (descripcion, completada, creador) VALUES (?, ?, ?)';
    db.query(sql, [descripcion, completada, creador], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Tarea agregada', id: result.insertId });
        }
    });
});

// Ruta para marcar una tarea como completada
app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { completada } = req.body;
    const sql = 'UPDATE tareas SET completada = ? WHERE id = ?';
    db.query(sql, [completada, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Tarea actualizada' });
        }
    });
});

// Ruta para eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tareas WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Tarea eliminada' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

