const ApiKey = require('../models/api');

// Controlador para generar API Keys
exports.generarApiKeys = async (req, res, next) => {
    try {
        // Lógica para generar la API Key
        const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const longitud = 32;
        let apiKeyValue = '';
        for (let i = 0; i < longitud; i++) {
            const indice = Math.floor(Math.random() * caracteresPermitidos.length);
            apiKeyValue += caracteresPermitidos[indice];
        }

        // Crear un nuevo documento ApiKey con el valor generado
        const apiKey = new ApiKey({ value: apiKeyValue });

        // Guardar la nueva API Key en la base de datos
        await apiKey.save();
        next();

        // Devolver la API Key generada como respuesta
        res.json({ apiKey: apiKeyValue });
    } catch (error) {
        // Manejar errores
        console.error('Error al generar la API Key:', error);
        res.status(500).json({ error: 'Error al generar la API Key' });
    }
};

// Controlador para verificar la validez de una API Key
exports.isValidApiKey = async (req, res, next) => {
    const apiKeyValue = req.headers['api-key']; // Obtener la API Key del encabezado

    try {
        // Buscar la API Key en la base de datos
        const apiKey = await ApiKey.findOne({ value: apiKeyValue });

        // Verificar si la API Key existe y es válida
        if (apiKey) {
            // Si la API Key es válida, continuar con la siguiente función de middleware
            next();
        } else {
            // Si la API Key no es válida, devolver un error 401 (Unauthorized)
            res.status(401).json({ error: 'API Key inválida' });
        }
    } catch (error) {
        // Manejar errores
        console.error('Error al verificar la API Key:', error);
        res.status(500).json({ error: 'Error al verificar la API Key' });
    }
};
