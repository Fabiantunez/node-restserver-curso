

//======================
//Puerto
//======================
process.env.Port = process.env.PORT || 3000;


//======================
// ENTERNO
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//======================
// BASE DE DATOS
//======================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://Fabiantunez:Faby147787@cluster0.hdeutof.mongodb.net/?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;