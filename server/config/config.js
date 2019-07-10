// configuracion del puerto para ambiente de desarrollo o prod

process.env.PORT = process.env.PORT || 3000;

// Conf Entorno ( h o local)

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 ;

// SEED 

process.env.SEED = process.env.SEED || 'secret-seed';

// Conf DB

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URL_DB = urlDB;

// Config Google
process.env.CLIENT_ID = process.env.CLIENT_ID || '72947493494-qk20tndpd95v4kkd2jin2372040rnbnb.apps.googleusercontent.com';