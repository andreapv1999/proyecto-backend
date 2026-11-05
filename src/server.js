const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB conectado correctamente');
    })
    .catch((error) => {
        console.error('Error al conectar MongoDB:', error.message);
    });

// Ruta principal
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API Backend funcionando correctamente',
        status: 'OK'
    });
});

// Rutas
app.use('/users', require('./routes/userRoutes'));
app.use('/posts', require('./routes/postRoutes'));

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});