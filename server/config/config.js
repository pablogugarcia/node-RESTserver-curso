// configuracion del puerto para ambiente de desarrollo o prod

process.env.PORT = process.env.PORT || 3000;

// Conf Entorno ( h o local)

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Conf DB

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://gustavo:ohRONAw2nQBXmAnJ@cluster0-eqcrp.mongodb.net/cafe';
}
process.env.URL_DB = urlDB;