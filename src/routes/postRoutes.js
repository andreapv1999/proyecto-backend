const express = require('express');
const router = express.Router();

const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
} = require('../controllers/postController');

const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Consultar todas las publicaciones
router.get('/', getPosts);

// Consultar una publicación
router.get('/:id', getPost);

// Crear publicación con imagen
router.post('/', authMiddleware, upload.single('image'), createPost);

// Modificar publicación con imagen
router.put('/:id', authMiddleware, upload.single('image'), updatePost);

// Eliminar publicación
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;