//importar la libreria jwt
const jwt = require('jsonwebtoken');




//=======================
//Verificar Token
//=======================
let verificaToken = (req,res,next) =>{
	let token = req.get('token');
	jwt.verify(token,process.env.SEED,(err,decoded) =>{
		/*console.log('entro a verificaToken');
		console.log(`${token}`);
		console.log(process.env.SEED);*/
		if(err){
			return res.status(401).json({
				ok: false,
				err:{
					menssage: 'Token no valido'
				}
			});
		}
		req.usuario = decoded.usuario;
		next();
	});
	
};

//=======================
//Verificar AdminRole
//=======================
let verificaAdmin_Role = (req,res,next) => {
	let usuario = req.usuario;
	if(usuario.role !== 'ADMIN_ROLE'){
		res.json({
			ok:false,
			err:{
				menssage: 'El usuario no es administrador'
			}
		});
	}
	next();
}

//=========================
//verifica token en imagen
//=========================
let verificaTokenImg = (req,res,next) =>{
	let token = req.query.token;
	jwt.verify(token,process.env.SEED,(err,decoded) =>{
		if(err){
			return res.status(401).json({
				ok: false,
				err:{
					menssage: 'Token no valido'
				}
			});
		}
		req.usuario = decoded.usuario;
		next();
	});
}
//exportación a otra parte de los archivos
module.exports = {verificaToken,verificaAdmin_Role,verificaTokenImg}



///NOTAS
//La petición get usuario lee el token desde la pestaña headers