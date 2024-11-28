//Importación de librerías
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Pool} = require('pg');
require('dotenv').config();

//Creación de una aplicación Express
const app = express();

//Configuración de la configuración con la base de datos 
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT,
  });

//Aplicación de middlewares
app.use(cors());
app.use(bodyParser.json());

//Puerto en el que va a correr el servidor 
const PORT = process.env.PORT || 3000;

//Devuelve la lista de todas las tareas
app.get('/api/tasks', async (req, res) => {
    try {
      const {rows} = await pool.query('SELECT * FROM tasks');
      res.json(rows);
    } catch (err) {
      res.status(500).send('Error al obtener tareas');
    }
  });

  //Creación de una nueva tarea 
  app.post('/api/tasks', async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
            [title, description, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Eliminar una tarea existente 
app.delete('/api/tasks/:id', async (req, res) => {
    const {id} = req.params;
    try{
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(204).send();
    }catch(err){
        res.status(500).send('Error en la eliminación de la tarea');
    }

});



//Se inicia el puerto y se escucha en el puerto ya establecido 
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});
