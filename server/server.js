require('./config/config');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function (req, res) {
    res.json('Hello World')
})

app.post('/usuario', function (req, res) {

    let body = req.body;
    if (body.nombre === undefined) {

        res.status({
            ok: false,
            mensaje: 'Es requerido el nombre'
        });

    } else {
        res.json({
            persona: body
        });
    }
})

app.put('/usuario', function (req, res) {
    res.json('Hello World')
})

app.delete('/usuario', function (req, res) {
    res.json('Hello World')
})

app.listen(port, () => console.log(`Esuchando el puerto ${port}`))