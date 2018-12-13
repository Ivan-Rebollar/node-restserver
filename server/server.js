require('./config/config');

//Exportaciones de paquetes
const express = require('express');
const app = express();
const bodyParser = require('body-parser');//serializar información en peticiones post
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json());
//
app.get('/usuario',(req,res) =>{
	res.json('get Usuario');
});
//peticion post --> crear nuevos registros
app.post('/usuario',(req,res) =>{
	let body = req.body;
	if(body.nombre === undefined){
		res.status(400).json({
			ok: false,
			mensaje: 'El nombre es necesario',
			//err: errors
		});
	}else{
		res.json({
			persona: body
		});
	}

	
});
//peticion put --> actualizar registros
app.put('/usuario/:id/'/*para validar el id de un usurio*/,(req,res) =>{
	
	let id = req.params.id;
	res.json({
		id
	});
});
//peticion delete --> cambiar el estado de algo
app.delete('/usuario',(req,res) =>{
	res.json('delete Usuario');
});
//

app.listen(process.env.PORT,() =>{
	console.log('Escuchando puerto: ',3000);
});

//app.use --> middleware, se ejecuta cuando pasa por ahí el código.