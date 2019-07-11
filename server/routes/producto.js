const express = require('express');

const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

const _ = require('underscore');


const app = express();

app.get('/producto', verificaToken, (req, res) => {


    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) return res.status(500).json({ ok: false, err });

            res.json({
                ok: true,
                productos
            });
        });
});

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    if (!termino) return res.status(400).json({ ok: false, err: { message: 'Se debe mandar un termino' } });

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) return res.status(500).json({ ok: false, err });
            res.json({ ok: true, producto: productoDB });
        })


})


app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    console.log(body.usuario);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id  // atencion con pedir el usuario q usa el token 
    });

    producto.save((err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });

        res.status(201).json({
            ok: true,
            productoDB
        });
    });

});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let producto = _.pick(body, 'nombre', 'precioUni', 'descripcion', ' disponible', 'categoria');

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!productoDB) return res.status(400).json({ ok: false, err: { message: 'No existe esa id' } })

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto actualizado exitosamente'
        });
    });
})

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let cambioEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambioEstado, (err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });

        res.json({
            ok: true,
            message: 'Producto borrado exitosamente'
        });
    });
});

module.exports = app;