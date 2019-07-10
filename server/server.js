require('./config/config');
require('colors');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');



const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT;




// body-parser (npm)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// public
app.use(express.static(path.resolve(__dirname ,'../public')));

// mongodb mongoose

mongoose.connect(process.env.URL_DB,
    { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
        if (err) throw err;
        console.log(`Base de datos Online`.yellow);
    });

// Exportaciones de rutas
app.use(require('./routes/index'));


app.listen(port, () => console.log(`Esuchando el puerto ${port}`.italic))