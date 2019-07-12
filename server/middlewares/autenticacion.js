const jwt = require('jsonwebtoken');

//
//

let verificaToken = (req, res, next) => {

    let token = req.query.token ? req.query.token : req.get('token');

    if(!token){
        res.status(400).json({ok:false, message: 'No existe un toquen'})
    }

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) return res.status(401).json({ ok: false, message: 'Token no valido' });

        req.usuario = decoded.usuario;
        next();


    })

}

// Verifica adminrole

let verificaADMIN_ROLE = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({ ok: false, message: 'Usuario no es admin' });
    }
}


module.exports = {
    verificaToken,
    verificaADMIN_ROLE
}