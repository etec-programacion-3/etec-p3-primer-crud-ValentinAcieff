/**
 * Importación de módulos y configuración inicial.
 * @module index
 */

import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';

const app = express();
const port = 3000;

// Configuración de la base de datos SQLite
const filename = "database.db";
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

// Definición del modelo Book
class Book extends Model { }
Book.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING
}, { sequelize, modelName: 'book' });

// Sincronización del modelo con la base de datos
sequelize.sync();

// Middleware para parsear solicitudes JSON y codificadas en URL
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Ruta para obtener todos los libros.
 * @name GET /books
 * @function
 * @memberof module:index
 * @param {express.Request} req - Objeto de solicitud Express.
 * @param {express.Response} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Ruta para obtener un libro por su ID.
 * @name GET /books/:id
 * @function
 * @memberof module:index
 * @param {express.Request} req - Objeto de solicitud Express con el parámetro ID.
 * @param {express.Response} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Ruta para crear un nuevo libro.
 * @name POST /books
 * @function
 * @memberof module:index
 * @param {express.Request} req - Objeto de solicitud Express con los datos del nuevo libro.
 * @param {express.Response} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Ruta para actualizar un libro por su ID.
 * @name PUT /books/:id
 * @function
 * @memberof module:index
 * @param {express.Request} req - Objeto de solicitud Express con el parámetro ID y los datos actualizados del libro.
 * @param {express.Response} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Ruta para eliminar un libro por su ID.
 * @name DELETE /books/:id
 * @function
 * @memberof module:index
 * @param {express.Request} req - Objeto de solicitud Express con el parámetro ID del libro a eliminar.
 * @param {express.Response} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Inicia el servidor Express en el puerto especificado.
 */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
