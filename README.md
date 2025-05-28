# LiveChat-GPT

Proyecto de chat en tiempo real realizado con Node.js, Express, Socket.io, MongoDB y Docker, CSS.

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **Socket.io**
- **Docker & Docker Compose**
- **MongoDB**
- **mongo-express** (GUI para MongoDB)
- **CSS** (frontend)

## Requisitos previos

- Docker y Docker Compose instalados
- Node.js instalado (solo si deseas ejecutar el backend sin Docker)
- Git (opcional, para clonar el repositorio)

## Puertos por defecto

- **Backend Node.js:** [http://localhost:3000](http://localhost:3000)
- **mongo-express:** [http://localhost:8081](http://localhost:8081)

## Acceso rápido

- **Usuario de ejemplo:**  
  Usuario: `user1`  
  Contraseña: `user1234`

---

## Endpoints de la API

- **Generar API Keys:**  
  [http://localhost:3000/api/](http://localhost:3000/api/)

- **Consultar mensajes de la sala 1:**  
  [http://localhost:3000/api/messages/1](http://localhost:3000/api/messages/1)

- **Consultar mensajes enviados en la sala 1 por el usuario `user1`:**  
  [http://localhost:3000/api/messages/1/user1](http://localhost:3000/api/messages/1/user1)

- **Enviar un mensaje (POST):**  
  [http://localhost:3000/api/newMessages](http://localhost:3000/api/newMessages)

  **Ejemplo de payload JSON:**
  ```json
  {
      "username": "user1",
      "message": "Hola desde Postman",
      "Room": 1
  }
  ```

---

## ¿Cómo ejecutar el proyecto con Docker?

1. Clona el repositorio:
    ```powershell
    git clone https://github.com/kevin0018/LiveChat-GPT.git
    cd LiveChat-GPT
    ```

2. Crea un archivo `.env` en la raíz del proyecto (si no existe) con el siguiente contenido:
    ```
    PROJECT_PATH=./app
    DOCKER_NAME=node
    NODE_V=20-alpine
    SERVER_PORT=3000
    MONGO_URI=mongodb://root:pass12345@mongodb:27017/chat?authSource=admin
    ```

3. Levanta los servicios con Docker Compose:
    ```powershell
    docker compose up --build
    ```

4. Accede a la aplicación en [http://localhost:3000](http://localhost:3000)

5. (Opcional) Accede a la interfaz de administración de MongoDB en [http://localhost:8081](http://localhost:8081)

---

## Notas

- El backend y la base de datos están completamente aislados en contenedores Docker.
- Puedes modificar los puertos o usuarios en el archivo `.env`.
- El servidor backend utiliza **Express** para la gestión de rutas y **Socket.io** para la comunicación en tiempo real entre clientes y servidor.

---
