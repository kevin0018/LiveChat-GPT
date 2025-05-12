const port = 3000,
  express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  mongoose = require('mongoose'),
  path = require("path"),
  session = require('express-session'),
  socketIO = require('socket.io'),
  io = socketIO(server),
  User = require("./models/User"),
  bcrypt = require('bcrypt'),
  saltRounds = 10,
  Chat = require('./models/chatRoom'),
  bodyParser = require('body-parser');

app.io = io;

// Configuración de sesiones
app.use(
  session({
    secret: "1234",          // Clave secreta para firmar la sesión
    resave: true,            // Volver a guardar la sesión incluso si no ha cambiado
    saveUninitialized: true  // Guardar sesiones no inicializadas
  })
);

// Conectar a MongoDB
mongoose.connect("mongodb://root:pass12345@mongodb:27017/chat?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async function () {
  console.log("Connected to MongoDB");
  const hashedPassword = await bcrypt.hash("user1234", saltRounds);
  // Crear un nuevo usuario
  const newUser = new User({
    _id: "30",
    username: "user1",
    password: hashedPassword,
    role: "admin",
  });

  try {
    // Verificar si el usuario ya existe antes de guardarlo
    const existingUser = await User.findOne({ username: newUser.username });
    if (!existingUser) {
      await newUser.save();
      console.log("Usuario añadido correctamente");
    } else {
      console.log("El usuario ya existe en la base de datos");
    }
  } catch (error) {
    console.error("Error al añadir el usuario:", error);
  }
});

// Configuración de Socket.io
app.use(bodyParser.json());

io.on('connection', async (socket) => {
  console.log('A user connected');

  // Maneja el evento 'joinRoom' cuando un usuario se une a una sala
  socket.on('joinRoom', async (roomId, username) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;

    // Emitir evento para actualizar la lista de usuarios en la sala
    const usersInRoom = getUsersInRoom(roomId);
    io.to(roomId).emit('updateUserList', usersInRoom);

    console.log(`User ${socket.username} joined room ${roomId}`);

    // Cargar mensajes de la base de datos para la sala actual y emitirlos al usuario recién conectado
    try {
      const messages = await Chat.find({ room: roomId }).sort({ timestamp: 1 });

      messages.forEach((message) => {
        socket.emit('message', {
          sender: message.sender,
          text: message.message,
        });
      });
    } catch (error) {
      console.error(error);
    }
  });

  // Manejar eventos de desconexión
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
  });
});

// Función para obtener la lista de usuarios en una sala específica
function getUsersInRoom(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (room) {
    return Array.from(room).map(socketId => io.sockets.sockets.get(socketId).username);
  }
  return [];
}

// Middleware para proporcionar acceso a io en las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Importar rutas de la aplicación
const mainRoutes = require("./routes/main");
const chatRoutes = require("./routes/chat")(io);
const apiRoutes = require("./routes/api");

// Configuración del motor de vistas y otras configuraciones
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de rutas
app.use("/", mainRoutes);  // Usar las rutas definidas en routes/main.js
app.use("/chat", chatRoutes);
app.use("/api", apiRoutes);

// Incluye la configuración del servidor
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
