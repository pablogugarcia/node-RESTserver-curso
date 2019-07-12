const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(fileUpload({ useTempFiles: true }));
const Usuario = require('../models/usuario');
const Productos = require('../models/producto');

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({ ok: false, err: { message: 'No hay archivos para cargar' } })
    }
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false, err: { message: 'No hay archivos para cargar' }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'Los tipos permitidos son ' + tiposValidos.join(', ') }
        });
    }

    let sampleFile = req.files.archivo;
    let nombreCortado = sampleFile.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];


    // Se puede usar una libreria que verifique el tipo de archivo en caso de q la exteencion sea adulterada
    let extencionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: 'Las extenciones validas son ' + extencionesValidas.join(', ') }
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, err });

        tipo === 'usuarios' ?
            imagenUsuario(id, res, nombreArchivo) :
            imagenProducto(id, res, nombreArchivo);
    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarImagen(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarImagen(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: { message: 'El usuario no existe' }
            })
        }

        borrarImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            if (err) return res.status(500).json({
                ok: false,
                err
            });

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Productos.findById(id, (err, productoDB) => {

        if (err) {
            borrarImagen(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarImagen(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: { message: 'El producto no existe' }
            })
        }
        borrarImagen(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if (err) return res.status(500).json({
                ok: false,
                err
            });

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });

        });


    })
}

function borrarImagen(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;