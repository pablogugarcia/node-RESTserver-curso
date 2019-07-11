const express = require('express');
const app = express();

const Categoria = require('../models/categoria');

const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) return res.status(500).json({ ok: false, err });

            // if (categoriaDB.length === 0) {
            //     return res.json({ ok: true, message: 'No hay categorias cargadas' });
            // }

            res.json({
                ok: true,
                categorias: categoriaDB
            });
        });

});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) return res.status(500).json({ ok: false, err });

        if (!categoriaDB) return res.status(400).json({
            ok: false,
            err: { message: 'No hay categoria con ese id' }
        })

        res.json({
            categoriaDB
        });
    });
});


app.post('/categoria', verificaToken, (req, res) => {


    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) return res.status(400).json({ ok: false, err });
        if (!categoriaDB) return res.status(400).json({ ok: false, })
        res.json({ ok: true, categoriaDB });
    });

});




app.put('/categoria/:id', [verificaToken], (req, res) => {


    let id = req.params.id;

    if (!req.body.descripcion) { return res.status(400).json({ ok: false, err: { message: 'Falta la descripcion' } }); }

    let categoria = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, categoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) return res.status(500).json({ ok: false, err });

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaADMIN_ROLE], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!categoriaDB) return res.status(400)
            .json({ ok: false, err: { message: 'El id no existe' } })

        res.json({ ok: true, message: 'Categoria borrada exitosamente' });
    });
});



module.exports = app;