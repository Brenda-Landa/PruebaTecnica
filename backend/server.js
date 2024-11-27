//Importación de librerías
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

//Creación de una plicación Express
const app = express();

//Configuración de la configuración con la base de datos 
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//Aplicación de middlewares
app.use(cors());
app.use(bodyParser.json());

//Puerto en el que va a correr el servidor 
const PORT = process.env.PORT || 3000;

// En esta parte se subirán las rutas 

//Devuelve la lista de todas las tareas
app.get('/api/tasks', async (req, res) => {
    try{
        const resultado = await pool.query('SELECT id, title, description, status, created_at, updated_at FROM tasks ORDER BY created_at DESC');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});


//Se inicia el puerto y se escucha en el puerto ya establecido 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
