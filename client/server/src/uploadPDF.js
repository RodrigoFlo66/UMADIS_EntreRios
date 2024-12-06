const { google } = require('googleapis');
const streamifier = require('streamifier');

// Configuración de autenticación
const auth = new google.auth.GoogleAuth({
    credentials: {
        //las credenciales aqui
      },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

const createAndUploadFile = async (file) => {
     // Validar archivo
     if (!file || !file.buffer || !file.originalname || !file.mimetype) {
        throw new Error('El archivo proporcionado no tiene los atributos necesarios.');
    }
    const fileMetadata = {
        name: file.originalname,
        parents: ['1T03XZhweyc_LKdI-GP7f74HsDoZrTRTI'],
    };

    const media = {
        mimeType: file.mimetype,
        body: streamifier.createReadStream(file.buffer), // Usando streamifier
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink',
    });

    return response.data.webViewLink;
};

module.exports = { createAndUploadFile };
