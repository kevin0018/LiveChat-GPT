const User = require("../models/User");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const saltRounds = 10;

exports.isAuth = async (req, res, next) => {  
  try {
    if (req.session && req.session.auth && req.session.auth.auth) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log("Error al verificar la autenticación del usuario", error);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try { 
    // Destruir todas las variables de sesión.
    if (req.session) {
      req.session.destroy();
      next();
    }
  } catch (error) {
    console.log("Error al cerrar la session", error);
    next(error);
  }
};

exports.nuevoUsuario = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const nuevoUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.name,
        password: hashedPassword,
        role: "user" 
    });

    const resultado = await nuevoUser.save();
    req.nuevoUser = resultado;
    next();

  } catch (error) {
    console.log("Error al guardar el nuevo usuario", error);
    next(error);
  }
};

exports.verificarUsuario = async (req, res, next) => {
    try {
      const usuario = await User.findOne({
        username: req.body.user
      });
  
      if (usuario) {
        const match = await bcrypt.compare(req.body.pass, usuario.password);
  
        if (match) {
          req.session.user = usuario.username;
          req.session.auth = {
            auth: true,
            info: {
              username: usuario.username,
              role: usuario.role 
            }
          };
          next();
        } else {
          req.session.auth = false;
          res.render("login-page", { usuarioNoExiste: true });
        }
      } else {
        req.session.auth = false;
        res.render("login-page", { usuarioNoExiste: true });
      }
    } catch (error) {
      console.log("Error al verificar al usuario", error);
      next(error);
    }
};