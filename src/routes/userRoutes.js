const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Registro e inicio de sesión
router.post('/register', register);
router.post('/login', login);

// Consultar todos los usuarios (solo admin)
router.get('/', authMiddleware, adminMiddleware, getUsers);

// Consultar un usuario
router.get('/:id', authMiddleware, getUser);

// Modificar un usuario
router.put('/:id', authMiddleware, updateUser);

// Eliminar un usuario
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;