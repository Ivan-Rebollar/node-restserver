//carga de librerias
const express = require('express');
const fileUpload =  require('express-fileupload');

//creación de objeto express
const app = express();

//Exportasión de Schemas
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//importar librerias necesarias para acceder al fileSystem
const fs = require('fs');
const path = require('path');

//uso del middleware de fileupload
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req,res) =>{
	//obtener el tipo de imagen y id (tipo -> usuario/producto)
	let tipo =  req.params.tipo;
	let id = req.params.id;
	//validación de que haya un archivo
	if(!req.files){
		return res.status(400).json({
			ok:false,
			err:{
				message:'No se ha seleccionado ningun archivo'
			}
		});
	}
	//validar tipo
	let tiposValidos = ['productos','usuarios'];
	if(tiposValidos.indexOf(tipo) < 0){
		return res.status(400).json({
			ok: false,
			err:{
				message: 'Los tipos permitidos son ' + tiposValidos.join(','),
				tipo 
			}
		});
	}
	//definición de donde va a caer el archivo cuando se cargue
	let archivo = req.files.archivo;
	//validaciones para obtener la extension
	let nombreCortado = archivo.name.split('.');
	let extension = nombreCortado[nombreCortado.length -1];

	//definición del arreglo de los archivos permitidos
	let extensionesValidas = ['png','jpg','gif','jpeg'];

	//validación de que la extension del archivo existe en el arreglo
	if(extensionesValidas.indexOf(extension) < 0){
		return res.status(400).json({
			ok: false,
			err:{
				message: 'Las extensiones permitidas son ' + extensionesValidas.join(','),
				ext: extension
			}
		});
	}
	//cambiar el nombre al archivo
	let nombreArchivo =  `${id}-${new Date().getMilliseconds()}.${extension}`;
	//Se guarda el archivo
	archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err) => {
		if(err){
			return res.status(500).json({
				ok:false,
				err
			});
		}
		//imagen cargada
		/*res.json({
			ok: true,
			message:'Imagen subida correctamente'
		});con las funciones ya es no necesario*/
		if(tipo === 'usuarios'){
			imagenUsuario(id,res,nombreArchivo);
		}else{
			imagenProducto(id,res,nombreArchivo);
		}
	});
});

function imagenUsuario(id,res,nombreArchivo){
	Usuario.findById(id, (err,usuarioDB) =>{
		if(err){
			borraArchivo(nombreArchivo,'usuarios');
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if(!usuarioDB){
			borraArchivo(nombreArchivo,'usuarios');
			return res.status(400).json({
				ok: false,
				err:{
					message: 'Usuario no existe'
				}
			});
		}

		//para borrar las imagenes que se tengan repetidas
		/*let pathImagen = path.resolve(__dirname,`../../uploads/usuarios/${usuarioDB.img}`);
		if(fs.existsSync(pathImagen)){
			fs.unlinkSync(pathImagen);
		}*/

		borraArchivo(usuarioDB.img,'usuarios')
		usuarioDB.img = nombreArchivo;
		usuarioDB.save((err,usuarioGuardado) =>{
			res.json({
				ok: true,
				usuario: usuarioGuardado,
				img: nombreArchivo 
			});
		});

	});
}

function imagenProducto(id,res,nombreArchivo){
	Producto.findById(id,(err,productoDB) =>{
		if(err){
			borraArchivo(nombreArchivo,'productos');
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if(!productoDB){
			borraArchivo(nombreArchivo,'productos');
			return res.status(400).json({
				ok: false,
				err:{
					message: 'El producto no existe'
				}
			});
		}
		borraArchivo(productoDB.img,'productos')

		productoDB.img = nombreArchivo;
		productoDB.save((err,productoGuardado) =>{
			res.json({
				ok: true,
				producto: productoGuardado,
				img: nombreArchivo
			});
		});
	});
}

function borraArchivo(nombreImagen, tipo){
	//para borrar las imagenes que se tengan repetidas
		let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
		if(fs.existsSync(pathImagen)){
			fs.unlinkSync(pathImagen);
		}
}
//importar los modulos
module.exports = app;