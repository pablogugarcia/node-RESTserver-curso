const express = require('express');
const app = express();
const _ = require('underscore');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Usuario = require('../config/models/usuario');

app.get('/usuario', function (req, res) {


    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;


    Usuario.find({estado : true}, '-password')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) res.status(400).json({ ok: false, err });
            Usuario.countDocuments({estado: true}, (err, count) => {
                if (err) throw new Error('Error en conteo', err);
                res.json({ ok: true, usuarios, cantidad: count });
            });
        });
});

app.post('/usuario', function (req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, saltRounds),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) return res.status(400).json({ ok: false, err });
        // usuarioDB.password = null;
        res.json({ ok: true, usuarioDB });
    });

})

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) return res.status(400).json({ ok: false, err });
        res.json({ ok: true, usuarioDB });
    })

})

app.delete('/usuario/:id', function (req, res) {


    let id = req.params.id;
    let cambioEstado = {
        estado: false
    }



    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true}, (err, usuarioDB) => {
        if (err) return res.status(400).json({ ok: false, err });
        res.json({ ok: true, usuarioDB });
    })

    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) res.status(400).json({ ok: false, err });
        if (!usuarioBorrado) {
            return res.status(400).json({ ok: false, err: { message: 'Usuario no encontrado' } });
        }
        res.json({ ok: true, usuario: usuarioBorrado });
    }) */
})

module.exports = app;