//Importación de librerías
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Pool} = require('pg');
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
    try {
      const {rows} = await pool.query('SELECT * FROM tasks');
      res.json(rows);
    } catch (err) {
      res.status(500).send('Error al obtener tareas');
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

}
)

//Se inicia el puerto y se escucha en el puerto ya establecido 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
