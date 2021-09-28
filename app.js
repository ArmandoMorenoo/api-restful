// Requerimos los paquetes que instalamos
let express = require('express');
let mysql = require('mysql');
let cors = require('cors');

let app = express(); // Para poder acceder a todos los métodos de express
app.use(express.json()); // Para que pueda leer los articulos que creamos, en JSON
app.use(cors());

// Conexión a la base de datos
let conexion = mysql.createConnection({
    host: 'localhost', // Servidor local
    user: 'root', // Usuario de la base de datos
    password: '', // Password de la base de datos
    database: 'articulosdb' // Nombre de la base de datos
});

// Provamos la conexión a la base de datos
conexion.connect((error) => {
    if(error){
        throw error; // Tirame un error en caso de que haya uno
    } else{
        console.log('Conexión exitosa a la base datos'); // Sino muestrame esto
    }
});

// Creamos los métodos HTTP
app.get('/', (req,res) =>{
    res.send('Ruta INICIO');
});

// Mostramos todos los artículos
app.get('/api/articulos', (req,res) => {
    conexion.query('SELECT * FROM articulos', (error,filas) => {
        if(error){
            throw error;
        } else{
            res.send(filas);
        }
    });
});

// Método HTTP para mostrar un solo artículo
app.get('/api/articulos/:id', (req,res) => {
    conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error,fila) => {
        if(error){
            throw error;
        } else{
            res.send(fila);
            // res.send(fila[0].descripcion); // Para que nos devuelva solo la descripción del producto
        }
    });
});

// Método HTTP para crear un artículo
app.post('/api/articulos', (req,res) => {
    let data = {
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock,
    };
    let sql = "INSERT INTO articulos SET ?";
    conexion.query(sql,data, (error,results) => {
        if(error){
            throw error;
        } else{
            /*Esto es lo nuevo que agregamos para el CRUD con Javascript*/
            Object.assign(data, {id: result.insertId }) //agregamos el ID al objeto data
            res.send(data) //enviamos los valores
        }
    });
});

// Método HTTP para editar un artículo
app.put('/api/articulos/:id', (req,res) =>{
    let id = req.params.id; // Capturamos el id del artículo
    let descripcion = req.body.descripcion; // Capturamos la descripción del artículo
    let precio = req.body.precio; // Capturamos el precio del artículo
    let stock = req.body.stock; // Capturamos el stock
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
    conexion.query(sql,[descripcion,precio,stock,id], (error,results) => {
        if(error){
            throw error;
        } else{
            res.send(results);
        }
    });
});

// Método HTTP para eliminar un artículo
app.delete('/api/articulos/:id', (req,res) => {
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], (error,results) => {
        if(error){
            throw error;
        } else{
            res.send(results);
        }
    });
});

const puerto = process.env.PUERTO || 3000; // Tírame al puerto asignado si está disponible sino al 3000
app.listen(puerto, () => {
    console.log('Servidor en el puerto: ' + puerto); //Respuesta está corriendo bien
});