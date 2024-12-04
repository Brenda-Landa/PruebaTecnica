//Importación de librerías
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const {Pool} = require('pg');
require('dotenv').config();
const mysql = require('mysql2');
require('dotenv').config();

//Creación de una plicación Express
const app = express();

//Configuración de la configuración con la base de datos 
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3000,
}).promise();

//Aplicación de middlewares
app.use(cors());
app.use(bodyParser.json());

//Puerto en el que va a correr el servidor 
const PORT = process.env.PORT || 3000;


//Devuelve la lista de todas las tareas
app.get('/api/tasks', async (req, res) => {
    try{
      const[rows] = await pool.query('SELECT * FROM tasks;');
      res.json(rows);
    }catch(err){
      res.status(500).send('Error al obtener tareas');
    }
});

//Devolución de una tarea específica
app.get('/api/tasks/:id', async (req, res) => {
  const{id} = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    console.log('Resultado de la consulta:', rows);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al seleccionar la tarea:', error);
    return res.status(500).json('Error en la selección de tarea');
  }
});

//Creación de una nueva tarea 
app.post('/api/tasks', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const {title, descrpcion, status} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, descrpcion, status) VALUES (?, ?, ?)',
      [title, descrpcion, status]
    );
    res.status(201).json('Tarea creada exitosamente');
  } catch (err) {
    console.error('Error al crear la tarea:', err);
    res.status(500).json('Error en la creación de la tarea');
  }
});

//Actualización del status de una tarea dado su id
app.put('/api/tasks/:id', async (req, res) => {
  const{id} = req.params;
  const{status} = req.body; 
  try{
    const [result] = await pool.query(
      'UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
    if(result.affectedRows === 0){
      return res.status(404).json("Tarea no encontrada");
    }
    res.json("Tarea actualizada exitosamente");
  }catch(err){
    res.status(500).json("Error al actualizar el estado de la tarea" );
  }
});

//Eliminación de una tarea
app.delete('/api/tasks/:id', async (req, res) => {
  const{id} = req.params;
  try{
      await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
      res.status(204).send('Tarea eliminada');
  }catch(err){
      res.status(500).send('Error en la eliminación de la tarea');
  }

});

//Se inicia el puerto y se escucha en el puerto ya establecido 
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});
