const express = require("express");
const router = express.Router();
const path = require("path");
const controllerDir = "../controllers";
const userController = require(path.join(controllerDir, "user_controller"));

router.get("/", async (req, res, next) => {
    res.render("login-page", { usuarioNoExiste: req.query.usuarioNoExiste === 'true' });
});

router.get("/chat/list", userController.isAuth, async (req, res, next) => {
    res.render("chat/list");
});

router.post("/login", async (req, res, next) => {
  res.render("login-page", { usuarioNoExiste: req.query.usuarioNoExiste === 'true' });
});

router.post("/saveUser", userController.nuevoUsuario, async (req, res, next) => {
    try {
        if (req.session.auth) {
            res.render("saveUser", { nuevoUsuario: req.nuevoUser });
        }
    } catch (error) {
        console.log("Error al renderizar la vista saveUser", error);
        next(error);
    }
});

router.post("/verificarUsuario", userController.verificarUsuario, async (req, res, next) => {
    try {
        if (req.session && req.session.auth && req.session.auth.auth) {
            res.render("chat/list", { session: req.session });
        }
    } catch (error) {
        console.log("Error al renderizar la vista chat/list", error);
        next(error);
    }
});

router.get("/create", async (req, res, next) => {
    res.render("create");
});

router.post("/verificarNuevoUsuario", userController.nuevoUsuario, async (req, res, next) => {
    try {
        // Redirigir al usuario a la página de login después de crear la cuenta
        res.redirect("/?usuarioNoExiste=false");
    } catch (error) {
        console.log("Error al crear al nuevo usuario", error);
        next(error);
    }
});

router.post("/selectedSala", async (req, res) => {
    const selectedSala = req.body.sala;

    res.render(`chat/sala${selectedSala}`, { sala: selectedSala });
});

module.exports = router;
