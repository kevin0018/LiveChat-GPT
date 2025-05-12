const mongoose = require("mongoose");

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  _id: { type: String, required: false }, // opcional
  username: String,                       // Nombre de usuario
  password: String,                       // Contraseña
  role: String,                           // Rol del usuario
});

// Exportar el modelo de usuario basado en el esquema
module.exports = mongoose.model("User", userSchema);
