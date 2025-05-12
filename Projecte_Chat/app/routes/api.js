const express = require("express");
const router = express.Router();
var path = require('path');
var controllersDir = "../controllers";
var apiController = require(path.join(controllersDir, "api"));
var usuarioController = require(path.join(controllersDir, "user_controller"));
var mensajesController = require(path.join(controllersDir, "mensajes"));

router.get("/", apiController.generarApiKeys, async (req,res) => {
    res.send("Generando api keys...");
});

router.get("/messages/:sala", apiController.isValidApiKey, mensajesController.getMessagesRoom, async (req, res) => {});
router.get("/messages/:sala/:user", apiController.isValidApiKey, mensajesController.getMessagesUser,async (req, res) => {});
router.post('/newMessages', apiController.isValidApiKey, mensajesController.newMessage, async (req, res) => {});

module.exports = router;

    