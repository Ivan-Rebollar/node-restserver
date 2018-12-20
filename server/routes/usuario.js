//declación de constante para usar la libreria express
const express = require('express');
//declaración de constante para el encriptado de nuestro password
const bcrypt = require('bcrypt');
//definir constante pick que filtra los valores que yo quiero.
const _ = require('underscore');
//declaración de constante para el uso del archivo creado 'usuario.js'
const Usuario = require('../models/usuario');
//usuando detrusturacion para importar el middleware verificaToken
const {verificaToken} = require('../middlewares/autenticacion');
//usuando destructuracion para importar el middleware verificarAdmin
const {verificaAdmin_Role} = require('../middlewares/autenticacion')
const app = express();

app.get('/usuario',verificaToken,(req,res) =>{
	//res.json('get Usuario');
	 return res.json({
	 	usuario: req.usuario,
	 	nombre: req.usuario.nombre,
	 	email: req.usuario.email
	})


	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
	limite = Number(limite);
	Usuario.find({/*google: true*/estado: true},'nombre email role estado google img')//las condiciones que se pongan dentro de .find() deben ponerse en la funcion .count()
			.skip(desde)
			.limit(limite)
			.exec((err, usuarios) => {
				if(err){
					return res.status(400).json({
						ok: false,
						err
					});
				}
				Usuario.count({/*google: true*/estado: true},(err,conteo) =>{
					res.json({
						ok: true,
						usuarios,
						cuantos: conteo
					});	
				});
				
			})
});
//peticion post --> crear nuevos registros
app.post('/usuario',[verificaToken,verificaAdmin_Role],(req,res) =>{
	let body = req.body;
	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password,10),//se hace uso del metodo hashSyncrecibe lo que se quiere encriptar y el numero de vueltas que se quiere dar a ese parametro
		role: body.role
	});
	usuario.save((err,usuarioDB)=>{
		if(err){
			return res.status(400).json({
				ok: false,
				err
			});
		}
		//usuario.password = null;esta linea es sólo para ocultar la constraeña en la respuesta de nuestro objeto
		res.json({
			ok: true,
			usuario: usuarioDB
		});
	});
	/*if(body.nombre === undefined){
		res.status(400).json({
			ok: false,
			mensaje: 'El nombre es necesario',
			//err: errors
		});
	}else{
		res.json({
			persona: body
		});
	}*/	
});
//peticion put --> actualizar registros
app.put('/usuario/:id/'/*para validar el id de un usurio*/,[verificaToken,verificaAdmin_Role],(req,res) =>{
	let id = req.params.id;
	let body = _.pick(req.body,['nombre','email','img','role','estado']);
	Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
		if(err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}		
		res.json({
			ok: true,
			usuario: usuarioDB
		});
	})
	
});
//peticion delete --> cambiar el estado de algo
app.delete('/usuario/:id',[verificaToken,verificaAdmin_Role],(req,res) =>{
	//res.json('delete Usuario');
	
	let id = req.params.id;
	//eliminación fisica del registro por medio del id
	/*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{
		if(err){
			return res.status(400).json({
				ok:false,
				err
			});
		};
		if(!usuarioBorrado){
			return res.status(400).json({
				ok: false,
				err:{
					menssage: 'Usuario no encontrado'
				}
			});
		}

		res.json({
			ok: true,
			usuario: usuarioBorrado
		});
	});*/
	//'eliminacion' por medio de cambio de estado
	let body = _.pick(req.body,['estado']);
	Usuario.findByIdAndUpdate(id,body,{new: true, /*esto nunca pasa en este caso runValidators: true*/},(err,usuarioEstado)=>{
		if(err){
			return res.status(400).json({
				ok: false,
				err
			});
		}
		if(usuarioEstado.estado === false){
			return res.status(400).json({
				ok: false,
				err: {
					menssage: 'Usuario no encontrado'
				}
			});
		}
		res.json({
			ok:true,
			usuario: usuarioEstado
		})
	})
	

});

module.exports = app;



///////NOTAS
// la función .find(), recibe dos parametros.
//recibe 1 arreglo que hace la función de query, en este arreglo se
//introducen las condiciones que se quieran mostrar, es decir,
//si se quiere mostrar, para este programa, los usuarios que tengan su
//cuenta de google activa la función .find() se verá así .find({google: true})
//esto quiere decir que se van a desplegar únicamente los usuarios que tengan su cuenta activa.
//la función .find(), en este caso esta siendo usada sobre el esquema Usuario,
//este esquema tiene definido ya ciertos campos a los que se puede aplicar la funcion de find({}).
//el segundo parametro que se le puede especificar a esta función es un string entre comillas simples,
//este string deberán de ser las propiedades de nuestro esquema que se deseen mostrar en las peticiones get.
//en este caso se tiene usando una función .count(), que lo que hace es regresar el numero de usuarios que hay
//dentro de la base de datos, fi dentro del arreglo se espeficia alguna propiedad como la anterior de google: true,
//esta propiedad debera de esoecificarse dentro de .count() de la misma manera, es decir .count({google: true}),
//lo que quiere decir eso es: cuenta los usuarios que tengan la cuenta de google activa. 