require('./config/config');

//Exportaciones de paquetes
const express = require('express'); 
const mongoose = require('mongoose');
const app = express(); 
const bodyParser = require('body-parser');//serializar información en peticiones post
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json())
//require del archivo usuario.js
app.use(require('./routes/usuario'));//importación y uso de las rutas del archivo usuario.js
//conexión a la base de datos de mongodb
mongoose.connect(process.env.URLDB,(err,res) => {
	if(err) throw err;
	console.log('Base de datos ONLINE!');
});

app.listen(process.env.PORT,() =>{
	console.log('Escuchando puerto: ',process.env.PORT);
});

//app.use --> middleware, se ejecuta cuando pasa por ahí el código.