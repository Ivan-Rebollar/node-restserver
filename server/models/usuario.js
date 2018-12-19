//importación del paquete mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//creación de roles validos para los usuarios
let rolesValidos = {
	values: ['ADMIN_ROLE','USER_ROLE'],
	message:'{VALUE} no es un rol válido'
};
//inicializaciíon de Schema
let Schema = mongoose.Schema;
//definición de un objeto tipo esquema
let usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario']
	},
	email: {
		type: String,
		unique: true,
		required: [true,'El correo es necesario']
	},
	password: {
		type: String,
		required: [true,'El password es necesario']
	},
	img: {
		type: String,
		required: false
	},
	role: {
		type: String,
		//required: false,
		default: 'USER_ROLE',
		enum: rolesValidos 
	},
	estado: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	}
});
//metodo para dejar el password fuera de nustro objeto json
//el metodo toJSON se usa cuando se  manda a imprimir
usuarioSchema.methods.toJSON = function(){
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;
	return userObject;
}
//especificar al esquema que plugin debe usar
usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe des ser único'});
//exportación del modelo
module.exports = mongoose.model('Usuario',usuarioSchema);