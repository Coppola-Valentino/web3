require('dotenv').config()
const session = require('express-session');
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const { Sequelize, DataTypes } = require('sequelize');
const { getUser, logout, auther, reqAuther} = require('./authent')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'Imagenes'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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
const Tarjeta = require('./Entidades/Tarjeta');
const Juego = require('./Entidades/Juego');
const Licencia = require('./Entidades/Licencia');
const DevTeam = require('./Entidades/DevTeam');
const Publisher = require('./Entidades/Publisher');
const Reseña = require('./Entidades/Reseña');
const BanList = require('./Entidades/BanList');
const Appeals = require('./Entidades/Appeals');
const Categorias = require('./Entidades/Categorias');
const Updates = require('./Entidades/Updates');

//rutas

router.get('/', async (req, res) => {
    try {
      const juegos = await Juego.findAll();
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    }
});

router.get('/Home', async (req, res) => {
    try {
      const juegos = await Juego.findAll();
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/VerBiblioteca', async (req, res) => {
    try {
      const lic = await Licencia.findAll({ where: { UserID: req.session.IDUser }});
      const juegos = await Juego.findAll({ where: { IDJuego: lic.map(l => l.JuegoID) }});
      res.render('VerBiblioteca', { juegos });
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
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

router.post('/CrearUsuario', upload.single('Avatar'), async (req, res) => {
  try{
    await Usuario.create({
      Nombre: req.body.Nombre,
      Pass: req.body.Pass,
      Email: req.body.Email,
      Avatar: req.file ? req.file.filename : null,
      Team: null,
      Admin: false
    });
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

router.post('/CrearTeam', upload.single('Banner'), reqAuther, async (req, res) => {
  try{
    const team = await DevTeam.create({
      Nombre: req.body.Nombre,
      Banner: req.file ? req.file.filename : null,
      FundadorID: req.session.IDUser
    });
    await Usuario.update({ Team: team.IDTeam }, { where: { IDUser: req.session.IDUser }});
    res.redirect(`/VerTeam/${team.IDTeam}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearJuego',reqAuther, async (req, res) => {
  try{
    const publishers = await Publisher.findAll();
    res.render('CrearJuego', {publishers});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearJuego', upload.single('Imagen'), reqAuther, async (req, res) => {
  try{
    const juego = await Juego.create({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      Imagen: req.file ? req.file.filename : null,
      DevID: req.session.Team,
      Descripcion: req.body.Descripcion,
      PublisherID: req.body.PublisherID
    });
    res.redirect(`/VerJuego/${juego.IDJuego}`);
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

router.post('/CrearBan/:id/:idd',reqAuther, async (req, res) => {
  try{
    await BanList.create({
      Motivo: req.body.Nombre,
      Duracion: req.body.Duracion,
      IDUser: req.params.idd,
      IDLicencia: req.params.id
    });
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

router.post('/CrearAppeal/:id',reqAuther, async (req, res) => {
  try{
    await Appeals.create({
      BanID: req.params.id,
      UserID: null,
      Contenido: req.body.Contenido,
      Estado: 'Pendiente'
    });
    res.redirect('/Home');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditJuego/:id',reqAuther, async (req, res) => {
  try{
    const juego = await Juego.findByPk(req.params.id);
    if (juego.DevID !== req.session.Team) {
      return res.redirect('/Error');
    }
    res.render(`EditJuego`, {juego});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditJuego/:id', upload.single('Imagen'), reqAuther, async (req, res) => {
  try{
    if (req.body.mantener === 'on') {
     await Juego.update({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      DevID: req.session.Team,
      Descripcion: req.body.Descripcion
   }, {where: {IDJuego: req.params.id}});
    } else {
   await Juego.update({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      Imagen: req.file ? req.file.filename : null,
      DevID: req.session.Team,
      Descripcion: req.body.Descripcion
   }, {where: {IDJuego: req.params.id}});
  }
    res.redirect(`/VerJuego/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditTeam/:id',reqAuther, async (req, res) => {
  try{
    const team = await DevTeam.findByPk(req.params.id);
    if (team.FundadorID !== req.session.IDUser) {
      return res.redirect('/Error');
    }
    const Users = await Usuario.findAll();
    res.render(`EditTeam`, {team, Users});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditTeam/:id',upload.single('Banner'), reqAuther, async (req, res) => {
  try{
   if (req.body.mantener === 'on') {
    await DevTeam.update({
      Nombre: req.body.Nombre,
      FundadorID: req.body.Fundador
    }, {where: {IDTeam: req.params.id}});
  } else {
    await DevTeam.update({
      Nombre: req.body.Nombre,
      Banner: req.file ? req.file.filename : null,
      FundadorID: req.body.Fundador
    }, {where: {IDTeam: req.params.id}});
  }
    res.redirect(`/VerTeam/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditUsuario/:id',reqAuther, async (req, res) => {
  try{
    const user = await Usuario.findByPk(req.params.id);
    if (req.session.Admin === false && req.session.IDUser !== user.IDUser) {
      return res.redirect('/Error');
    }
    res.render(`EditUsuario`, {user});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditUsuario/:id',upload.single('Avatar'), reqAuther, async (req, res) => {
  try{
   if (req.body.mantener === 'on') {
    await Usuario.update({
      Nombre: req.body.Nombre,
      Pass: req.body.Pass,
      Email: req.body.Email,
      Admin: req.body.Admin
    }, {where: {IDUser: req.params.id}});
  } else {
    await Usuario.update({
      Nombre: req.body.Nombre,
      Pass: req.body.Pass,
      Email: req.body.Email,
      Avatar: req.file ? req.file.filename : null,
      Admin: req.body.Admin
    }, {where: {IDUser: req.params.id}});
  }
    res.redirect(`/VerUsuario/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/Mensajeria/:id',reqAuther, async (req, res) => {
  try{
    res.render(`Mensajeria`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerAppeal/:id',reqAuther, async (req, res) => {
  try{
    const appeal = await Appeals.findByPk(req.params.id);
    const ban = await BanList.findOne({ where: { IDBan: appeal.BanID }});
    const admin = await Usuario.findOne({ where: {UserID: appeal.IDUser }});
    const user = await Usuario.findOne({where: {UserID: ban.IDUser}});
    res.render(`VerAppeal`, {appeal, ban, admin, user});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerBans/:id',reqAuther, async (req, res) => {
  try{
    const licencias = await Licencia.findAll({ where: {JuegoID: req.params.id}});
    const baneos = await BanList.findAll({ where: { IDLicencia: licencias.map(l => l.IDLicencia) }});
    res.render(`VerBans`, {baneos});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerJuego/:id', async (req, res) => {
  try{
    const juego = await Juego.findByPk(req.params.id);
    const team = await DevTeam.findByPk(juego.DevID);
    const publisher = await Publisher.findByPk(juego.PublisherID);
    const licencia = await Licencia.findAll({ where: { JuegoID: juego.IDJuego, UserID: req.session.IDUser }});
    //const categorias = await Categorias.findAll({ where: { JuegoID: juego.IDJuego }});
    res.render(`VerJuego`, {juego, team, publisher, licencia});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerLicencias/:id',reqAuther, async (req, res) => {
  try{
    const licencias = await Licencia.findAll({ where: { IDJuego: req.params.id }});
    res.render(`VerLicencias`, {licencias});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerTeam/:id',reqAuther, async (req, res) => {
  try{
    const Team = await DevTeam.findByPk(req.params.id);
    const equipo = await Usuario.findAll({ where: { Team: Team.IDTeam }});
    const juegos = await Juego.findAll({ where: { DevID: Team.IDTeam }});
    res.render(`VerTeam`, {Team, equipo, juegos});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerUsuario/:id',reqAuther, async (req, res) => {
  try{
    const user = await Usuario.findByPk(req.params.id);
    const licencias = await Licencia.findAll({ where: { UserID: user.IDUser }});
    const juegos = await Juego.findAll({ where: { IDJuego: licencias.map(l => l.JuegoID) }});
    const Team = await DevTeam.findByPk(user.Team);
    const publi = await Publisher.findByPk(user.Publish);
    res.render(`VerUsuario`, {user, juegos, Team, publi});
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

router.post('/CrearPublisher',upload.single('Banner'), reqAuther, async (req, res) => {
  try{
    const publisher = await Publisher.create({
      Nombre: req.body.Nombre,
      Banner: req.file ? req.file.filename : null,
      FundadorID: req.session.IDUser
    });
    await Usuario.update({ Publish: publisher.IDPublisher }, { where: { IDUser: req.session.IDUser }});
    res.redirect(`/VerPublisher/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditPublisher/:id',reqAuther, async (req, res) => {
  try{
    const publisher = await Publisher.findByPk(req.params.id);
    if (publisher.FundadorID !== req.session.IDUser) {
      return res.redirect('/Error');
    }
    const Users = await Usuario.findAll();
    res.render(`EditPublisher`, {publisher, Users});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditPublisher/:id',upload.single('Banner'), reqAuther, async (req, res) => {
  try{
   if (req.body.mantener === 'on') {
    await Publisher.update({
      Nombre: req.body.Nombre,
      FundadorID: req.session.IDUser
   }, {where: {IDPublisher: req.params.id}});
  } else {
    await Publisher.update({
      Nombre: req.body.Nombre,
      Banner: req.file ? req.file.filename : null,
      FundadorID: req.session.IDUser
   }, {where: {IDPublisher: req.params.id}});
  }
    res.redirect(`/VerPublisher/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerPublisher/:id',reqAuther, async (req, res) => {
  try{
    const publisher = await Publisher.findByPk(req.params.id);
    const equipo = await Usuario.findAll({ where: { Publish: publisher.IDPublisher }});
    const juegos = await Juego.findAll({ where: { PublisherID: publisher.IDPublisher }});
    res.render(`VerPublisher`, {publisher, equipo, juegos});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/ConfirmarComp/:id', reqAuther, async (req, res) => {
    try {
      const juego = await Juego.findByPk(req.params.id);
      const tarjetas = await Tarjeta.findAll({ where: { UserID: req.session.IDUser }});
      res.render('ConfirmarComp', { juego, tarjetas });
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/ConfirmarComp2/:id/:idd', reqAuther, async (req, res) => {
    try {
      const juego = await Juego.findByPk(req.params.id);
      const tarjeta = await Tarjeta.findByPk(req.params.idd);
      res.render('ConfirmarComp2', { juego, tarjeta });
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.post('/ConfirmarComp2/:id/:idd', reqAuther, async (req, res) => {
    try {
      const juego = await Juego.findByPk(req.params.id);
      const tarjeta = await Tarjeta.findByPk(req.params.idd);
      if (tarjeta.Saldo < juego.Precio) {
        return res.redirect(`/confirmarComp/${juego.IDJuego}`);
      }
      await Tarjeta.update(
        { Saldo: tarjeta.Saldo - juego.Precio },
        { where: { IDTarjeta: tarjeta.IDTarjeta } }
      );
      await Licencia.create({
        JuegoID: juego.IDJuego,
        UserID: req.session.IDUser,
        Estado: 'Activa'
      });
      res.redirect('/VerBiblioteca');
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/VerTarjeta', reqAuther, async (req, res) => {
    try {
      const tarjetas = await Tarjeta.findAll({ where: { UserID: req.session.IDUser }});
      res.render('VerTarjeta', { tarjetas });
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/CrearTarjeta', reqAuther, async (req, res) => {
    try {
      res.render('CrearTarjeta');
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.post('/CrearTarjeta', reqAuther, async (req, res) => {
    try {
      await Tarjeta.create({
        UserID: req.session.IDUser,
        Nombre: req.body.Nombre,
        Numero: req.body.Numero,
        NumeroSeguridad: req.body.NumeroSeguridad
      });
      res.redirect('VerTarjeta');
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/EditTarjeta/:id', reqAuther, async (req, res) => {
    try {
      const tarjeta = await Tarjeta.findByPk(req.params.id);
      res.render('EditTarjeta', {tarjeta});
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.post('/EditTarjeta/:id', reqAuther, async (req, res) => {
    try {
      await Tarjeta.update({
        Nombre: req.body.Nombre,
        Saldo: req.body.Saldo
      }, { where: { IDTarjeta: req.params.id }});
      res.redirect('/VerTarjeta');
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/BorrarTarjeta/:id', reqAuther, async (req, res) => {
    try {
      await Tarjeta.destroy({ where: { IDTarjeta: req.params.id }});
      const tarjetas = await Tarjeta.findAll({ where: { UserID: req.session.IDUser }});
      res.render('VerTarjeta', { tarjetas });
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/Error', async (req, res) => {
    res.render('Error'); 
});

router.get('/Logout', logout);


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