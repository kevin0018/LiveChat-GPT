const Chat = require("../models/chatRoom");

exports.newMessage = async (req, res, next) => {
    const { username, message, room } = req.body;
    console.log(req.body);
    try {
        // Crear un nuevo mensaje en la base de datos
        const newMessage = new Chat({ sender: username, room: room, message: message,  timestamp: new Date() });
        await newMessage.save();
        
        // Emitir el nuevo mensaje a través de Socket.IO
        req.app.io.to(room).emit('message', { sender: username, message: message });
        res.json({ message: 'Mensaje guardado correctamente :)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el mensaje', descripcion: error.message });
    }
};

exports.getMessagesUser = async (req,res,next) => {
    const salaNumber = req.params.sala;
    const user = req.params.user;
  
    try {
        // Obtener los mensajes de la sala específica desde la base de datos
        const messages = await Chat.find({ room: salaNumber, sender:user } );
         res.json({ messages: messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los mensajes de la sala', descripcion: error.message });
    }
  }

  exports.getMessagesRoom = async (req,res,next) => {
    const salaNumber = req.params.sala;
    console.log("sala: " + salaNumber)

    try {
        // Obtener los mensajes de la sala específica desde la base de datos
        const messages = await Chat.find({ room: salaNumber }).sort({ timestamp: 1 });
        if(messages){
            res.json({ messages: messages });
            next();
        }else{
            res.status(500).json({ error: 'Error al obtener los mensajes ', descripcion: error });
            next();
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la conexion', descripcion: error.message});
    }
}

  