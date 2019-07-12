const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');


app.get('/imagen/:tipo/:img',verificaToken,  (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    const noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');

    fs.existsSync(pathImg) ? res.sendFile(pathImg) : res.sendFile(noImgPath);


});

module.exports = app;