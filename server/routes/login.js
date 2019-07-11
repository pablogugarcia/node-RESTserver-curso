const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');

// Google SignIn
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {


    let body = req.body;
    console.log(body);

    Usuario.findOne({ email: body.email }, function (err, usuarioDB) {

        if (err) return res.status(500).json({ ok: false, err });

        if (!usuarioDB) {
            return res.status(400).json({ ok: false, message: 'Usuario o contraseña incorrectos' });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({ ok: false, message: 'Usuario o contraseña incorrectos' });
        }

        console.log(usuarioDB);

        let token = jwt.sign(
            { usuario: usuarioDB },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });

});

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }

}

app.post('/google', async (req, res) => {


    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => { return res.status(403).json({ ok: false, err: {message: 'Error al verificar token'} }) });

    Usuario.findOne({ email: googleUser.email }, (err, userDB) => {

        if (err) return res.status(500).json({ ok: false, err });

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json(
                    { ok: false, err: { message: 'Debe usar las credenciales normales' } });
            } else {
                let token = jwt.sign(
                    { usuario: userDB },
                    process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: userDB,
                    token
                });
            }
        } else {
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, userDB) => {
                if (err) return res.status(500).json({ ok: false, err });

                let token = jwt.sign(
                    { usuario: userDB },
                    process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: userDB,
                    token
                });
            })
        }


    })


});





module.exports = app;