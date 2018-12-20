//exportación de librerias
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//exportación del Schema
const Usuario = require('../models/usuario');

//inicializar constante app de tipo express
const app = express();

//peticiones
app.post('/login',(req, res) =>{
	let body = req.body;
	Usuario.findOne({/*condiciones*/ email: body.email},(err,usuarioDB)=>{
		if(err){
			return res.status(400).json({
				ok:false,
				err
			});
		}
		if(!usuarioDB){
			return res.status(400).json({
				ok:false,
				err:{
					menssage: '(Usuario) o contraseña incorrecto'
				}
			});
		}
		if(!bcrypt.compareSync(body.password, usuarioDB.password)){
			return res.status(400).json({
				ok:false,
				err: {
					menssage: 'Usuario o (contraseña) incorrecto'
				}
			})
		}
		let token = jwt.sign({
			usuario: usuarioDB,
		},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})
		res.json({
			ok: true,
			usuario: usuarioDB,
			token
		});
	});
	
});














//exportar los cambios que se hagan sobre app a otros archivos
module.exports = app;