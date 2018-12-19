//En este archivo se declaran variables de forma global
//=================
// Puerto
//=================

process.env.PORT = process.env.PORT || 3000;

//=================
// Entorno
//=================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================
// Base de datos
//=================

let urlDB;
if(process.env.NODE_ENV === 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe'; //link de base de datos remota
}else{
	urlDB = 'mongodb://cafe-user:root123456!@ds015849.mlab.com:15849/cafe';  //link de base de datos remota pass: root123456!
}
process.env.URLDB= urlDB;