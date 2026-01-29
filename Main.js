require('dotenv').config()
const session = require('express-session');
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const { Sequelize, DataTypes } = require('sequelize');
const { getUser, logout, auther, reqAuther} = require('./authent')
const multer = require('multer');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

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
const Resena = require('./Entidades/Resena');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
const Resena = require('./Entidades/Resena');
const BanList = require('./Entidades/BanList');
const BanAppeal = require('./Entidades/BanAppeal');
const BanAppeal2 = require('./Entidades/BanAppeal2');
const Categorias = require('./Entidades/Categorias');
const Mensajeria = require('./Entidades/Mensajeria');
const Updates = require('./Entidades/Updates');

//rutas

router.get('/', async (req, res) => {
    try {
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    }
});

router.get('/Home', async (req, res) => {
    try {
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
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
      Admin: false,
      Estado: 'Activo'
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
      FundadorID: req.session.IDUser,
      Estado: 'Activo'
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

router.post('/CrearJuego', upload.fields([{ name: 'Imagen', maxCount: 1 },{ name: 'Archivo', maxCount: 1 }]), reqAuther, async (req, res) => {
  try{
    const imagenFile = req.files['Imagen'] ? req.files['Imagen'][0].filename : null;
    const archivoFile = req.files['Archivo'] ? req.files['Archivo'][0].filename : null;
    const juego = await Juego.create({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      Imagen: imagenFile,
      Archivo: archivoFile,
      DevID: req.session.Team,
      Descripcion: req.body.Descripcion,
      PublisherID: req.body.PublisherID,
      Estado: 'Activo'
    });
    res.redirect(`/VerJuego/${juego.IDJuego}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearBan/:id',reqAuther, async (req, res) => {
  try{
    const Licen = await Licencia.findByPk(req.params.id);
    res.render('CrearBan', {Licen});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearBan/:id',reqAuther, async (req, res) => {
  try{
    const Licen = await Licencia.findByPk(req.params.id);
    const user = await Usuario.findByPk(Licen.UserID);
    await BanList.create({
      Motivo: req.body.Motivo,
      Duracion: req.body.Duracion,
      UserID: user.IDUser,
      LicenciaID: req.params.id
    });
    await Licencia.update({ 
      Estado: 'Baneada' 
    }, { where: { IDLic: req.params.id }});
    res.redirect('/Home');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearAppeal/:id',reqAuther, async (req, res) => {
  try{
    const licen = await Licencia.findByPk(req.params.id);
    const ban = await BanList.findOne({ where: { LicenciaID: licen.IDLic }});
    res.render('CrearAppeal', {ban});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearAppeal/:id',reqAuther, async (req, res) => {
  try{
    await BanAppeal.create({
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

router.post('/EditJuego/:id', upload.fields([{ name: 'Imagen', maxCount: 1 },{ name: 'Archivo', maxCount: 1 }]), reqAuther, async (req, res) => {
  try{
    const imagenFile = req.files['Imagen'] ? req.files['Imagen'][0].filename : null;
    const archivoFile = req.files['Archivo'] ? req.files['Archivo'][0].filename : null;
    if (req.body.mantener2 === 'on' && req.body.mantener === 'on') {
     await Juego.update({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      DevID: req.session.Team,
      Descripcion: req.body.Descripcion
   }, {where: {IDJuego: req.params.id}});
} else if (req.body.mantener2 === 'on') {
     await Juego.update({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      Imagen: imagenFile,
      DevID: req.session.Team,
      Descripcion: req.body.Descripcion
   }, {where: {IDJuego: req.params.id}});
} else if (req.body.mantener === 'on') {
     await Juego.update({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      Archivo: archivoFile,
      DevID: req.session.Team,
      Descripcion: req.body.Descripcion
   }, {where: {IDJuego: req.params.id}});
} else {
   await Juego.update({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      Imagen: imagenFile,
      Archivo: archivoFile,
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
      Admin: !!req.body.Admin
    }, {where: {IDUser: req.params.id},
        individualHooks: true
});
  } else {
    await Usuario.update({
      Nombre: req.body.Nombre,
      Pass: req.body.Pass,
      Email: req.body.Email,
      Avatar: req.file ? req.file.filename : null,
      Admin: !!req.body.Admin
    }, {where: {IDUser: req.params.id},
        individualHooks: true
},);
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
    const appeal = await BanAppeal.findByPk(req.params.id);
    const ban = await BanList.findOne({ where: { IDBan: appeal.BanID }});
    const admin = await Usuario.findOne({ where: {IDUser: appeal.UserID }});
    const user = await Usuario.findOne({where: {IDUser: ban.UserID}});
    res.render(`VerAppeal`, {appeal, ban, admin, user});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerAppeals/:id',reqAuther, async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const licencia = await Licencia.findByPk(req.params.id);
    const users = await Usuario.findAll();
    const { count, rows: appeals } = await BanAppeal.findAndCountAll({
      where: { BanID: licencia.IDLic },
      offset,
      limit: pageSize
    });
    const AppData = appeals.map(appeals => {
     const admin = users.find(c => c.IDUser === appeals.UserID);
     return {
      ...appeals.toJSON(),
      admin
     };
    });
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        appeals: AppData,
        total: count,
        page,
        pageSize
      });
    }

    res.render(`VerAppeals`, {appeals: AppData, licencia, total: count, page, pageSize });
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/AceptarAppeal/:id',reqAuther, async (req, res) => {
 try{
    await BanAppeal.update({
      Estado: 'Aceptado',
      UserID: req.session.IDUser
    }, { where: { IDAppeal: req.params.id }});
    const appeal = await BanAppeal.findByPk(req.params.id);
    const ban = await BanList.findByPk(appeal.BanID);
    const licencia = await Licencia.findByPk(ban.LicenciaID);
    await Licencia.update({
      Estado: 'Activa'
    }, { where: { IDLic: licencia.IDLic }});
    res.redirect('/Home');
   } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/RechazarAppeal/:id',reqAuther, async (req, res) => {
 try{
    await BanAppeal.update({
      Estado: 'Rechazado',
      UserID: req.session.IDUser
    }, { where: { IDAppeal: req.params.id }});
    res.redirect('/Home');
   } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerBans/:id',reqAuther, async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const juego = await Juego.findByPk(req.params.id);
    const licencias = await Licencia.findAll({ where: {JuegoID: req.params.id}});
    const { count, rows: bans } = await BanList.findAndCountAll({
      where: { LicenciaID: licencias.map(l => l.IDLic) },
      offset,
      limit: pageSize
    });
    const users = await Usuario.findAll({ where: { IDUser: bans.map(b => b.UserID) }});
    const BanData = bans.map(ban => {
      const user = users.find(c => c.IDUser === ban.UserID);
      const lic = licencias.find(l => l.IDLic === ban.LicenciaID);
      return {
        ...ban.toJSON(),
        user,
        lic
      };
    });

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        bans: BanData,
        total: count,
        page,
        pageSize
      });
    }
    res.render(`VerBans`, {bans: BanData, juego, total: count, page, pageSize });
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
    const licencia = await Licencia.findOne({ where: { JuegoID: req.params.id, UserID: req.session.IDUser }});
    const ban = await BanList.findOne({ where: { LicenciaID: licencia ? licencia.IDLic : null }});
    const resenas = await Resena.findAll({ where: { JuegoID: juego.IDJuego }});
    const resen = await Resena.findOne({ where: { JuegoID: juego.IDJuego, LicID: licencia ? licencia.IDLic : null }});
    const categorias = await Categorias.findAll({ where: { JuegoID: juego.IDJuego }});
    res.render(`VerJuego`, {juego, team, publisher, licencia, ban, resenas, resen, categorias});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerLicencias/:id',reqAuther, async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const juego = await Juego.findByPk(req.params.id);
    const { count, rows: licencias } = await Licencia.findAndCountAll({
      where: { JuegoID: req.params.id },
      offset,
      limit: pageSize
    });
    const users = await Usuario.findAll({ where: { IDUser: licencias.map(l => l.UserID) }});
    const LicData = licencias.map(licencs => {
     const user = users.find(c => c.IDUser === licencs.UserID);
     return {
      ...licencs.toJSON(),
      user
     };
    });

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        licencias: LicData,
        total: count,
        page,
        pageSize
      });
    }

    res.render(`VerLicencias`, {licencias: LicData, juego, total: count, page, pageSize });
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
    const bans = await BanList.findAll({ where: { UserID: user.IDUser }});
    res.render(`VerUsuario`, {user, juegos, Team, publi, bans});
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
      FundadorID: req.session.IDUser,
      Estado: 'Activo'
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
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const { count, rows: tarjetas } = await Tarjeta.findAndCountAll({
      where: { UserID: req.session.IDUser },
      offset,
      limit: pageSize
    });
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        tarjetas,
        total: count,
        page,
        pageSize
      });
    }
      res.render('VerTarjeta', { tarjetas, total: count, page, pageSize });
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
        NumeroSeguridad: req.body.NumeroSeguridad,
        Saldo: 0
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

router.get('/ElimBan/:id',reqAuther, async (req, res) => {
  try{
    await Licencia.update({ 
      Estado: 'Activa' 
    }, { where: { IDLic: req.params.id }});
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/DescargarJuego/:id', async (req, res) => {
  try {
    const juego = await Juego.findByPk(req.params.id);
    const filePath = path.join(__dirname, 'Imagenes', juego.Archivo);
    res.download(filePath, juego.Archivo);
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/CrearResena/:id', reqAuther, async (req, res) => {
    try {
      const juego = await Juego.findByPk(req.params.id);
      res.render('CrearResena', {juego});
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.post('/CrearResena/:id', reqAuther, async (req, res) => {
    try {
      const licencia = await Licencia.findOne({ where: { JuegoID: req.params.id, UserID: req.session.IDUser }});
      await Resena.create({
        LicID: licencia.IDLic,
        JuegoID: req.params.id,
        Numero: req.body.Numero,
        Texto: req.body.Texto,
        Fecha: new Date()
      });
      res.redirect(`/Home`);
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/EditResena/:id/:idd', reqAuther, async (req, res) => {
    try {
      const juego = await Juego.findByPk(req.params.id);
      const resena = await Resena.findByPk(req.params.idd);
      res.render('EditResena', {juego, resena});
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.post('/EditResena/:id/:idd', reqAuther, async (req, res) => {
    try {
      await Resena.update({
        Numero: req.body.Numero,
        Texto: req.body.Texto,
        Fecha: new Date()
      }, { where: { IDResena: req.params.idd }});
      res.redirect(`/VerJuego/${req.params.id}`);
    } catch (err) {
      console.error(err.message);
      res.redirect('/Error');
    } 
});

router.get('/VerCategorias/:id',reqAuther, async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const juego = await Juego.findByPk(req.params.id);
    const { count, rows: categorias } = await Categorias.findAndCountAll({
      where: { JuegoID: req.params.id },
      offset,
      limit: pageSize
    });
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        categorias,
        total: count,
        page,
        pageSize
      });
    }
    res.render(`VerCategorias`, {categorias, juego, total: count, page, pageSize });
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearCategorias/:id',reqAuther, async (req, res) => {
  try{
    await Categorias.create({
      JuegoID: req.params.id,
      Contenido: req.body.Contenido
    });
    res.redirect(`/VerCategorias/${req.params.id}`);
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/ElimCategorias/:id/:idd',reqAuther, async (req, res) => {
  try{
    const juego = await Juego.findByPk(req.params.id);
    await Categorias.destroy({ where: { IDCategoria: req.params.idd }});
    const categorias = await Categorias.findAll({ where: { JuegoID: req.params.id }});
    res.render(`VerCategorias`, {categorias, juego});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/BanJuego/:id',reqAuther, async (req, res) => {
  try{
    const juego = await Juego.findByPk(req.params.id);
    if (juego.Estado === 'Activo') {
     await Juego.update({ 
      Estado: 'Baneado' 
     }, { where: { IDJuego: req.params.id }});
    } else {
     await Juego.update({ 
      Estado: 'Activo' 
     }, { where: { IDJuego: req.params.id }});
    }
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/BanPublisher/:id',reqAuther, async (req, res) => {
  try{
    const publish = await Publisher.findByPk(req.params.id);
    if (publish.Estado === 'Activo') {
     await Publisher.update({ 
      Estado: 'Baneado' 
     }, { where: { IDPublisher: req.params.id }});
    } else {
     await Publisher.update({ 
      Estado: 'Activo' 
     }, { where: { IDPublisher: req.params.id }});
    }
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/BanTeam/:id',reqAuther, async (req, res) => {
  try{
    const team = await DevTeam.findByPk(req.params.id);
    if (team.Estado === 'Activo') {
     await DevTeam.update({ 
      Estado: 'Baneado' 
     }, { where: { IDTeam: req.params.id }});
    } else {
     await DevTeam.update({ 
      Estado: 'Activo' 
     }, { where: { IDTeam: req.params.id }});
    }
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/BanUsuario/:id',reqAuther, async (req, res) => {
  try{
    const user = await Usuario.findByPk(req.params.id);
    if (user.Estado === 'Activo') {
     await Usuario.update({ 
      Estado: 'Baneado' 
     }, { where: { IDUser: req.params.id }});
    } else {
     await Usuario.update({ 
      Estado: 'Activo' 
     }, { where: { IDUser: req.params.id }});
    }
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/CrearAppeal2', async (req, res) => {
  try{
    res.render('CrearAppeal2');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearAppeal2', async (req, res) => {
  try{
    await BanAppeal2.create({
      UserID: req.session.IDUser,
      Contenido: req.body.Contenido,
      Estado: 'Pendiente'
    });
    res.redirect('/Home');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerAppeals2',reqAuther, async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const { count, rows: appeals2 } = await BanAppeal2.findAndCountAll({
      offset,
      limit: pageSize
    });
    const users = await Usuario.findAll({where : {IDUser: appeals2.map(a => a.UserID)}});
    const AppData = appeals2.map(appeals2 => {
     const user = users.find(c => c.IDUser === appeals2.UserID);
     return {
      ...appeals2.toJSON(),
      user
     };
    });
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        appeals2: AppData,
        total: count,
        page,
        pageSize
      });
    }
    res.render(`VerAppeals2`, {appeals2: AppData, total: count, page, pageSize });
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/AcceptAppeal/:id',reqAuther, async (req, res) => {
  try{
    await BanAppeal2.update({ 
      Estado: 'Aceptada' 
    }, { where: { IDAppeal2: req.params.id }});
    const apeal = await BanAppeal2.findByPk(req.params.id);
    await Usuario.update({ 
      Estado: 'Activo' 
    }, { where: { IDUser: apeal.UserID }});
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/DenegarAppeal/:id',reqAuther, async (req, res) => {
  try{
    await BanAppeal2.update({ 
      Estado: 'Denegada' 
    }, { where: { IDAppeal2: req.params.id }});
      const juegos = await Juego.findAll({where: {Estado: 'Activo'}});
      res.render('Home', { juegos });
    } catch (err) {
      console.error(err.message);
      res.render('Home', { juegos: [] });
    } 
});

router.get('/Mensajeria',reqAuther, async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const { count, rows: usuarios } = await Usuario.findAndCountAll({
      where: { IDUser: { [Sequelize.Op.ne]: req.session.IDUser } },
      offset,
      limit: pageSize
    });
    const Teams = await DevTeam.findAll();
    const UserData = usuarios.map(usuario => {
      const Team = Teams.find(c => c.IDTeam === usuario.Team);
      return {
        ...usuario.toJSON(),
        Team
      };
    });

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        usuarios: UserData,
        total: count,
        page,
        pageSize
      });
    }
    res.render(`Mensajeria`, {usuarios: UserData, total: count, page, pageSize });
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/Mensajes/:id', reqAuther, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const { count, rows: mensajes } = await Mensajeria.findAndCountAll({
      where: {
        [Sequelize.Op.or]: [
          { UserID: req.params.id, User2ID: req.session.IDUser },
          { UserID: req.session.IDUser, User2ID: req.params.id }
        ]
      },
      offset,
      limit: pageSize,
      order: [['IDMensaje', 'ASC']]
    });

    const users = await Usuario.findAll();
    const mensajesWithUser = mensajes.map(m => ({
      ...m.toJSON(),
      user: users.find(u => u.IDUser === m.User2ID) 
    }));

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        mensajes: mensajesWithUser,
        total: count,
        page,
        pageSize
      });
    }
    const usuario = await Usuario.findByPk(req.params.id);
    res.render('Mensajes', { mensajes: mensajesWithUser, usuario, total: count, page, pageSize });
  } catch (err) {
    console.error(err.message);
    res.redirect('/Error');
  }
});

router.post('/Mensajes/:id', upload.single('Imagen'), reqAuther, async (req, res) => {
  try {
    const nuevoMensaje = await Mensajeria.create({
      UserID: req.params.id,
      User2ID: req.session.IDUser,
      Texto: req.body.Texto,
      Imagen: req.file ? req.file.filename : null,
    });
    const user = await Usuario.findByPk(req.session.IDUser);
    io.to('user_' + req.params.id).emit('new_message', {
      ...nuevoMensaje.toJSON(),
      user: user ? user.toJSON() : null
    });
    io.to('user_' + req.session.IDUser).emit('new_message', {
      ...nuevoMensaje.toJSON(),
      user: user ? user.toJSON() : null
    });
    res.json({
      ...nuevoMensaje.toJSON(),
      user: user ? user.toJSON() : null
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

router.get('/VerUpdates/:id',reqAuther, async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const { count, rows: updates } = await Updates.findAndCountAll({
      where: { JuegoID: req.params.id },
      offset,
      limit: pageSize
    });
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        updates,
        total: count,
        page,
        pageSize
      });
    }
    const juego = await Juego.findByPk(req.params.id);
    res.render(`VerUpdates`, {updates, juego, total: count, page, pageSize });
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/VerUpdate/:id',reqAuther, async (req, res) => {
  try{
    const update = await Updates.findByPk(req.params.id);
    res.render(`VerUpdate`, {update});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/CrearUpdate/:id',reqAuther, async (req, res) => {
  try{
    const juego = await Juego.findByPk(req.params.id);
    res.render(`CrearUpdate`, {juego});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/CrearUpdate/:id', reqAuther, async (req, res) => {
  try{
    await Updates.create({
      JuegoID: req.params.id,
      Nombre: req.body.Nombre,
      Contenido: req.body.Contenido,
      Fecha: new Date()
    });
    res.redirect('/Home');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/EditUpdate/:id',reqAuther, async (req, res) => {
  try{
    const update = await Updates.findByPk(req.params.id);
    res.render(`EditUpdate`, {update});
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.post('/EditUpdate/:id', reqAuther, async (req, res) => {
  try{
    await Updates.update({
      Nombre: req.body.Nombre,
      Contenido: req.body.Contenido
    }
    , { where: { IDUpdate: req.params.id }});
    res.redirect('/Home');
  } catch (err) {
   console.error(err.message); 
   res.redirect('/Error');
  }
});

router.get('/Error', async (req, res) => {
    res.render('Error'); 
});

router.get('/Banned', async (req, res) => {
    res.render('Banned'); 
});

router.get('/Logout', logout);


app.use('/', router);

app.use('/Imagenes', express.static(path.join(__dirname, 'Imagenes')));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join('user_' + userId);
  });
});
  } catch (err) {
    console.error('Fatal error:', err.message);
    console.error('Fatal error 2:', err);
    process.exit(1);
  }
})();