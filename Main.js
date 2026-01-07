require('dotenv').config()
const session = require('express-session');
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const { Sequelize, DataTypes } = require('sequelize');
const { getUser, logout, auther, reqAuther} = require('./authent')

const { sequelize } = require('./db');

app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'pugs'));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'secret session',
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 
  } 
}))

app.use(getUser);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync();

const Usuario = require('./Entidades/Usuario');
const Juego = require('./Entidades/Juego');
const Licencia = require('./Entidades/Licencia');
const DevTeam = require('./Entidades/DevTeam');
const Reseña = require('./Entidades/Reseña');
const BanList = require('./Entidades/BanList');
const Appeals = require('./Entidades/Appeals');
const Categorias = require('./Entidades/Categorias');
const Updates = require('./Entidades/Updates');

//rutas


app.use('/', router);

app.use('/Imagenes', express.static(path.join(__dirname, 'Imagenes')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  
});
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  }
})();