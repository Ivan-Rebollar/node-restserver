const express = require('express');

const{verificaToken} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//===========================
//Obtener todos los productos
//===========================
app.get('/productos', verificaToken,(req, res) =>{
	//trae todos los productos
	//populate: usuairo categoria
	//paginado
	let desde = req.query.desde || 0;
	desde = Number(desde);

	let hasta = req.query.hasta || 5;
	hasta = Number(hasta);

	Producto.find({disponible: true})
			.skip(desde)
			.limit(5)
			.populate('usuario','nombre email')
			.populate('categoria','descripcion')
			.exec((err,productos) => {
				if(err){
					return res.status(500).json({
						ok:false,
						err
					});
				}
				res.json({
					ok: true,
					productos
				});
			})
});

//===========================
//Obtener producto por ID
//===========================
app.get('/productos/:id', (req, res) =>{
	//populate: usuario categoria
	//paginado
	let id = req.params.id;
	Producto.findById(id)
			.populate('usuario','nombre email')
			.populate('categoria','nombre')
			.exec((err,productoDB) =>{
				if(err){
					return res.status(500).json({
						ok:false,
						err
					});
				}
				if(!productoDB){
					return res.status(400).json({
						ok:false,
						err:{
							message:'El ID no es correcto'
						}
					});
				}
				res.json({
					ok:true,
					producto: productoDB
				});
			});
});
//===========================
//Buscar productos
//===========================
app.get('/productos/buscar/:termino',verificaToken,(req,res) =>{
	let termino = req.params.termino;
	let regex = new RegExp(termino,'i');
	//Producto.find({nombre: termino}) busqueda exactamente igual a como se encuentra en la db
	Producto.find({nombre: regex})//busqueda con expreciones regulares
			.populate('categoria','nombre')
			.exec((err,productos) =>{
				if(err){
					return res.status(500).json({
						ok: false,
						err
					});	
				}
				res.json({
					ok: true,
					productos
				});

			})
});




//===========================
//Crear un nuevo producto
//===========================
app.post('/productos', verificaToken,(req, res) =>{
	//grabar el usuario
	//grabar una categoria del listado
	let body = req.body;
	let producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
		usuario: req.usuario._id
	});
	producto.save((err,productoDB) =>{
		if(err){
			return res.status(500).json({
				ok: false,
				err
			});
		}
		res.status(201).json({
			ok: true,
			producto: productoDB,
			message: 'Producto registado'
		});
	});
});

//===========================
//Actualizar un nuevo producto
//===========================
app.put('/productos/:id', verificaToken,(req, res) =>{
	//grabar el usuario
	//grabar una categoria del listado
	let id = req.params.id;
	let body = req.body;
	Producto.findById(id,(err,productoDB) =>{
		if(err){
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if(!productoDB){
			return res.status(400).json({
				ok: false,
				message: 'El ID es incorrecto'
			});
		}
		//Actualización de cada uno de los valores del producto
		productoDB.nombre = body.nombre;
		productoDB.precioUni = body.precioUni;
		productoDB.categoria = body.categoria;
		productoDB.disponible = body.disponible;
		productoDB.descripcion = body.descripcion;

		//Guardar los cambios
		productoDB.save((err, productoGuardado) =>{
			if(err){
				return res.status(500).json({
					ok: false,
					err
				});
			}
			res.json({
				ok: true,
				producto: productoGuardado
			})
		})
	});
});

//===========================
//Borrar un producuto
//===========================
app.delete('/productos/:id', verificaToken,(req, res) =>{
	//cambiar disponible a falso
	let id = req.params.id;
	Producto.findById(id,(err,productoDB) =>{
		if(err){
			return res.status(500).json({
				ok:false,
				err
			});
		}
		if(!productoDB){
			return res.status(400).json({
				ok:false,
				err:{
					message: 'ID no existe'
				}
			});
		}
		productoDB.disponible =  false;
		productoDB.save((err,productoBorrado) =>{
			if(err){
				return res.status(500).json({
					ok:false,
					err
				});
			}
			res.json({
				ok:true,
				producto: productoBorrado,
				message: 'Producto Borrado'

			});
		})
	})
});

module.exports = app;