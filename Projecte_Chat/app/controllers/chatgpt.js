// Importamos la función askChatGPT del controlador
const { OpenAI } = require('openai');
const openaiClient = new OpenAI({ apiKey: '' });

let chatHistory = []; // Array para almacenar el historial de mensajes

// Función para preguntar a ChatGPT y obtener una respuesta
exports.askChatGPT = async (mensaje) => {
    try {
        let respuestaChat;
        // Añadir el mensaje del usuario al historial
        chatHistory.push({ role: 'user', content: mensaje });

        // Enviar la solicitud al modelo de lenguaje GPT
        const respuesta = await openaiClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chatHistory,
            temperature: 1,
            max_tokens: 256, // Longitud máxima de la respuesta
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // Obtener la respuesta del modelo GPT
        respuestaChat = respuesta.choices[0].message.content;

        // Añadir la respuesta del asistente al historial
        chatHistory.push({ role: 'assistant', content: respuestaChat });


        return respuestaChat; // Devolver la respuesta
    } catch (error) {
        console.error('Error al enviar mensaje a ChatGPT:', error);
        return 'Lo siento, no pude procesar tu solicitud en este momento.'; // Devolver un mensaje de error
    }
};


