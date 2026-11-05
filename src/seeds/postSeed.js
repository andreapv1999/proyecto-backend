const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
require('dotenv').config();

const seedPosts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB conectado para la semilla');

        const user = await User.findOne();

        if (!user) {
            console.log('No hay usuarios. Registra primero un usuario.');
            return;
        }

        const posts = [
            {
                title: 'Mi primera publicación',
                content: 'Esta es una publicación de prueba.'
            },
            {
                title: 'Aprendiendo Backend',
                content: 'Estoy aprendiendo Node.js, Express y MongoDB.'
            }
        ];

        const insertedPosts = [];

        for (const postData of posts) {
            const existingPost = await Post.findOne({
                title: postData.title,
                author: user._id
            });

            if (!existingPost) {
                const post = await Post.create({
                    ...postData,
                    author: user._id
                });

                insertedPosts.push(post);
            }
        }

        if (insertedPosts.length > 0) {
            await User.findByIdAndUpdate(user._id, {
                $addToSet: {
                    posts: { $each: insertedPosts.map(post => post._id) }
                }
            });
        }

        console.log(`${insertedPosts.length} publicaciones insertadas correctamente.`);

    } catch (error) {
        console.error('Error al ejecutar la semilla:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedPosts();