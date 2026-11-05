const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Subir imagen a Cloudinary
const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'backend-posts' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

// Crear publicación
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: 'Título y contenido son obligatorios'
            });
        }

        let image = {};

        if (req.file) {
            const result = await uploadImage(req.file.buffer);
            image = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        const post = await Post.create({
            title,
            content,
            author: req.user.id,
            image
        });

        await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { posts: post._id } }
        );

        res.status(201).json({
            message: 'Publicación creada correctamente',
            post
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las publicaciones
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una publicación
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email');

        if (!post) {
            return res.status(404).json({
                message: 'Publicación no encontrada'
            });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar publicación
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Publicación no encontrada'
            });
        }

        if (
            post.author.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: 'No tienes permiso para modificar esta publicación'
            });
        }

        const { title, content } = req.body;

        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;

        if (req.file) {
            if (post.image?.public_id) {
                await cloudinary.uploader.destroy(post.image.public_id);
            }

            const result = await uploadImage(req.file.buffer);

            post.image = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        await post.save();

        res.json({
            message: 'Publicación actualizada correctamente',
            post
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar publicación
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Publicación no encontrada'
            });
        }

        if (
            post.author.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar esta publicación'
            });
        }

        if (post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id);
        }

        await Post.findByIdAndDelete(post._id);

        await User.findByIdAndUpdate(
            post.author,
            { $pull: { posts: post._id } }
        );

        res.json({
            message: 'Publicación eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
};