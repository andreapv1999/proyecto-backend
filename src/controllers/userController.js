const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

// Registrar usuario
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'El usuario ya existe'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Iniciar sesión
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                message: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Inicio de sesión correcto',
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los usuarios (solo admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario
const getUser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'No tienes permiso para consultar esta cuenta'
            });
        }

        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('posts');

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'No tienes permiso para modificar esta cuenta'
            });
        }

        const { name, email, password, role } = req.body;

        if (email && email.toLowerCase() !== user.email) {
            const existingUser = await User.findOne({
                email: email.toLowerCase()
            });

            if (existingUser) {
                return res.status(400).json({
                    message: 'Ese correo ya está registrado'
                });
            }

            user.email = email;
        }

        if (name !== undefined) user.name = name;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (role && req.user.role === 'admin') {
            if (!['user', 'admin'].includes(role)) {
                return res.status(400).json({
                    message: 'Rol no válido'
                });
            }
            user.role = role;
        }

        await user.save();

        res.json({
            message: 'Usuario actualizado correctamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar usuario y sus publicaciones
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar esta cuenta'
            });
        }

        const posts = await Post.find({ author: user._id });

        for (const post of posts) {
            if (post.image?.public_id) {
                await cloudinary.uploader.destroy(post.image.public_id);
            }
        }

        await Post.deleteMany({ author: user._id });
        await User.findByIdAndDelete(user._id);

        res.json({
            message: 'Usuario y sus publicaciones eliminados correctamente'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};