
const { createWindow } = require("./main");
const { app, Menu } = require("electron");
const path = require('path');
const { startServer } = require('../server/src/index.js'); // Importa el servidor Express

require('electron-reload')(__dirname);

app.allowRendererProcessReuse = true;

// Define la plantilla del menú
const menuTemplate = [
    {
        label: 'Archivo',
        submenu: [
            { role: 'quit', label: 'Salir' }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            { role: 'undo', label: 'Deshacer' },
            { role: 'redo', label: 'Rehacer' },
            { type: 'separator' },
            { role: 'cut', label: 'Cortar' },
            { role: 'copy', label: 'Copiar' },
            { role: 'paste', label: 'Pegar' },
            { role: 'selectAll', label: 'Seleccionar todo' }
        ]
    },
    {
        label: 'Ver',
        submenu: [
            { role: 'reload', label: 'Recargar' },
            { role: 'forceReload', label: 'Recargar forzado' },
            { role: 'toggleDevTools', label: 'Alternar herramientas de desarrollo' },
            { type: 'separator' },
            { role: 'resetZoom', label: 'Restablecer zoom' },
            { role: 'zoomIn', label: 'Acercar' },
            { role: 'zoomOut', label: 'Alejar' },
            { type: 'separator' },
            { role: 'togglefullscreen', label: 'Pantalla completa' }
        ]
    },
    {
        role: 'window',
        label: 'Ventana',
        submenu: [
            { role: 'minimize', label: 'Minimizar' },
            { role: 'zoom', label: 'Zoom' },
            { type: 'separator' },
            { role: 'close', label: 'Cerrar' }
        ]
    }
];

// Construye el menú a partir de la plantilla
const menu = Menu.buildFromTemplate(menuTemplate);
// Establece el menú en la aplicación
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
    startServer(); // Inicia el servidor Express
    createWindow(); // Crea la ventana de Electron

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        startServer();
        createWindow();
    }
});
