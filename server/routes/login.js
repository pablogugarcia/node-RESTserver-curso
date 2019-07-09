const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const Usuario = require('../config/models/usuario');

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

})





module.exports = app;