// Importar módulos
const express = require("express");
const router = express.Router();
const Chat = require("../models/chatRoom");
const path = require('path');
const controllersDir = "../controllers";
const usersController = require(path.join(controllersDir, "user_controller"));
const chatgptController = require(path.join(controllersDir, "chatgpt"));
const messagesController = require(path.join(controllersDir, "mensajes"));

// Exportar una función que toma la instancia de io como argumento
module.exports = (io) => {
    // Ruta para procesar el formulario de entrada a la sala
    router.post("/enter", usersController.isAuth, async (req, res) => {
        const selectedSala = req.body.sala;
        const usuario = req.session.auth.info.username;

        // Redirige a la vista de la sala seleccionada
        res.redirect(`/chat/sala/${selectedSala}`);

        // Emitir evento de unión a la sala
        io.emit('join room', { sala: selectedSala, user: usuario });
    });

    // Ruta para la vista de una sala específica
    router.get("/sala/:sala", usersController.isAuth, async (req, res) => {
      const salaNumber = req.params.sala;
      const usuario = req.session.auth.info.username;
      res.render(`chat/sala/1`, { sala: salaNumber, usuario: usuario });
  });

  // Ruta para manejar el envío de mensajes desde el cliente al servidor
  router.post('/message', async (req, res) => {
    const { usuario, mensaje, sala } = req.body;

    try {
        // Crear un nuevo objeto Chat con los datos proporcionados
        const nuevoMensaje = new Chat({
            sender: usuario,
            message: mensaje,
            room: sala,
            timestamp: new Date()
        });

        // Guardar el mensaje en la base de datos
        await nuevoMensaje.save();

        // Emitir el mensaje a todos los clientes en la sala
        io.to(sala).emit('message', { sender: usuario, text: mensaje, isUserQuestion: true });

        res.json({ message: 'Mensaje guardado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el mensaje en la base de datos' });
    }
  });

  // Ruta para preguntar a ChatGPT
  router.post("/askChatGPT", async (req, res) => {
    console.log("entrando...");
    const { message } = req.body;
    console.log("Mensaje recibido: " + message); // Log del mensaje recibido desde el cuerpo de la solicitud
    try {
        console.log("Consultando a ChatGPT..."); // Log antes de llamar a la función del controlador
        const response = await chatgptController.askChatGPT(message); // Llama a la función del controlador para preguntar a ChatGPT
        console.log("Respuesta de ChatGPT recibida: " + response); // Log de la respuesta de ChatGPT
        res.json({ response });
    } catch (error) {
        console.error('Error al preguntar a ChatGPT:', error); // Log del error en caso de que ocurra
        res.status(500).json({ error: 'Error al preguntar a ChatGPT' });
    }
  });

  return router;
};
