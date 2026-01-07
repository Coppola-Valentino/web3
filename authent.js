const bcrypt = require('bcrypt');
const User = require('./models/Usuario');

const auther = async (req, res, next) => {
    try {
        const {Pass, Usuario} = req.body;
        if (!Pass || !Usuario) {
            console.error('Faltan datos');
            return res.render('Login');
        }

        const user = await User.findOne({where: {Usuario}});
        if (!user) {
            console.error('Usuario no encontrado');
            return res.render('Login');
        }

        console.log('User found:', user.Usuario);
        console.log('user.Pass from DB:', user.Pass);
        console.log('Pass from form:', Pass);

        const valido = await user.validar(Pass);
        console.log('bcrypt.compare result:', valido);
        
        if (!valido) {
            console.error('Contraseña o usuario incorrecto');
            return res.render('Login');
        }

        req.session.IDUser = user.IDUser;
        req.session.Usuario = user.Usuario;
        req.session.Rol = user.Rol;

        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        res.redirect('/Error');
    }
}

const getUser = async (req, res, next) => {
    if (req.session.IDUser) {
        try {
            const user = await User.findByPk(req.session.IDUser);
            res.locals.activeUser = user;
        } catch (err) {
            console.error('getUser error:', err.message);
            return res.redirect('/Error');
        }
    }
    next();
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/Error');
        }
        res.clearCookie('connect.sid');
        res.redirect('/Login');
    });
};

const reqAuther = async (req, res, next) => {
    if (!req.session.IDUser) {
        return res.redirect('/Login');
    }
    next();
}

module.exports = {reqAuther, logout, auther, getUser};