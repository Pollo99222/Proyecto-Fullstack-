// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql2'); // Mantén la versión de mysql2 como antes
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 8080; // Usa el puerto 8080 o el que esté definido en las variables de entorno

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Definido en el archivo .env o Railway
    user: process.env.DB_USER,       // Definido en el archivo .env o Railway
    password: process.env.DB_PASS,   // Definido en el archivo .env o Railway
    database: process.env.DB_NAME,   // Definido en el archivo .env o Railway
    port: process.env.DB_PORT || 3306, // Puerto de la base de datos, por defecto 3306
    connectTimeout: 10000 // Tiempo de espera para la conexión, aumentado a 10 segundos
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta de ejemplo para verificar la API
app.get('/api', (req, res) => {
    res.send('La API está funcionando correctamente');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});