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
app.set('views', path.join(__dirname, 'Vistas'));

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

router.get('/', async (req, res) => {
    res.render('Home'); 
});

router.get('/Home', async (req, res) => {
    res.render('Home'); 
});

router.get('/Login', async (req, res) => {
  try {
  res.render('Login');
  } catch (err) {
   console.error(err.message);
   res.redirect('/Error');
  }
});

router.post('/Login', async (req, res) => {
  try {
    await auther(req, res, () => {
      res.redirect('/Home');
    });
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearUsuario', async (req, res) => {
  try{
    res.render('CrearUsuario');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearUsuario', async (req, res) => {
  try{
    //crea usuario
    res.redirect('/Home');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearTeam', reqAuther, async (req, res) => {
  try{
    res.render('CrearTeam');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearTeam', reqAuther, async (req, res) => {
  try{
    //crea team
    res.redirect(`/VerTeam/${req.body.IDTeam}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearJuego',reqAuther, async (req, res) => {
  try{
    res.render('CrearJuego');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearJuego',reqAuther, async (req, res) => {
  try{
    //crear el juego
    res.redirect(`/VerJuego/${req.body.IDJuego}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearBan/:id',reqAuther, async (req, res) => {
  try{
    res.render('CrearBan');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearBan/:id',reqAuther, async (req, res) => {
  try{
    //no se
    res.redirect('/Home');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearAppeal',reqAuther, async (req, res) => {
  try{
    res.render('CrearAppeal');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearAppeal',reqAuther, async (req, res) => {
  try{
    //cosa
    res.render('CrearAppeal');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditJuego/:id',reqAuther, async (req, res) => {
  try{
    res.render(`EditJuego/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditJuego/:id',reqAuther, async (req, res) => {
  try{
    //post
    res.redirect(`/VerJuego/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditTeam/:id',reqAuther, async (req, res) => {
  try{
    res.render(`EditTeam/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditTeam/:id',reqAuther, async (req, res) => {
  try{
    //a
    res.redirect(`/VerTeam/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditUsuario/:id',reqAuther, async (req, res) => {
  try{
    res.render(`EditUsuario/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditUsuario/:id',reqAuther, async (req, res) => {
  try{
    res.redirect(`/VerUsuario/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/Mensajeria/:id',reqAuther, async (req, res) => {
  try{
    res.render(`Mensajeria/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerAppeal/:id',reqAuther, async (req, res) => {
  try{
    res.render(`VerAppeal/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerBans/:id',reqAuther, async (req, res) => {
  try{
    res.render(`VerBans/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerJuego/:id',reqAuther, async (req, res) => {
  try{
    res.render(`VerJuego/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerLicencias/:id',reqAuther, async (req, res) => {
  try{
    res.render(`VerLicencias/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerTeam/:id',reqAuther, async (req, res) => {
  try{
    res.render(`VerTeam/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerUsuario/:id',reqAuther, async (req, res) => {
  try{
    res.render(`VerUsuario/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearPublisher',reqAuther, async (req, res) => {
  try{
    res.render(`CrearPublisher`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearPublisher',reqAuther, async (req, res) => {
  try{

    res.redirect(`/VerPublisher/${req.body.IDPublisher}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditPublisher',reqAuther, async (req, res) => {
  try{
    res.render(`EditPublisher`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditPublisher',reqAuther, async (req, res) => {
  try{
    res.redirect(`/VerPublisher/${req.body.IDPublisher}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerPublisher/:id',reqAuther, async (req, res) => {
  try{
    res.render(`VerPublisher/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/Error', async (req, res) => {
    res.render('Error'); 
});

router.post('/Logout', logout);


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