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
// Vencimiento del token
//=================
//60 seg
//60 min
//24 hrs
//30 días

process.env.CADUCIDAD_TOKEN = '48h';

//=================
// SEED de autenticacón
//=================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//=================
// Base de datos
//=================

let urlDB;
if(process.env.NODE_ENV === 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe'; //link de base de datos remota
}else{
	urlDB = process.env.MONGO_URI; /*'mongodb://cafe-user1:root123456@ds015849.mlab.com:15849/cafe'se enmascara*/  //link de base de datos remota pass: root123456!
}
process.env.URLDB= urlDB;

//=================
// Google Client ID
//=================

process.env.CLIENT_ID = process.env.CLIENT_ID || '891813379852-dun2qqs56nrac0hr73cl98h9b87q9ie2.apps.googleusercontent.com';



//comandos
//heroku config:set <nombreDeVariable>=<asignación_del_url_enmascarado> <-- setar una variable de entorno en heroku
//heroku config:unset <nombreDeVariable> <-- para borrar la variable de entorno de heroku
//heroku config <--  ver las variables de entorno corriendo sobre heroku