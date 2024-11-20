import { serverUrl } from '../server.config.js';
import * as Tabulator from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.js';
export async function exportList() {
    document.getElementById('listaEstadistica').style.display = 'block';
    const mainContainer = document.getElementById("listaEstadistica"); // Asegúrate de tener este contenedor en tu HTML
    mainContainer.innerHTML = ""; // Limpia el contenido anterior
    // Crear y agregar el título
    const profileTitle = document.createElement("h2");
    profileTitle.textContent = "ESTADISTICA DE REGISTROS";
    profileTitle.className = "text-center text-primary mb-4";
    mainContainer.appendChild(profileTitle);
    // Contenedor específico para la tabla
    const tableContainer = document.createElement("div");
    tableContainer.id = "estadisticaList";
    mainContainer.appendChild(tableContainer);
    // Paso 1: Cargar datos de la API o fuente de datos
    const response = await fetch(`${serverUrl}/estadisticas`);
const data = await response.json();

// Configuración de la localización en español
const spanishLocale = {
    "pagination": {
        "first": "Primero",
        "first_title": "Primera Página",
        "last": "Último",
        "last_title": "Última Página",
        "prev": "Anterior",
        "prev_title": "Página Anterior",
        "next": "Siguiente",
        "next_title": "Página Siguiente",
    }
};

// Aquí generamos las columnas dinámicamente a partir de la respuesta
const generateColumns = (data) => {
    // Tomamos los distritos (las claves de cada objeto)
    const districts = Object.keys(data[0]).filter(key => key !== "atributo");
    
    // Creamos las columnas para cada distrito
    const columns = [
        { title: "Atributo", field: "atributo"},
        ...districts.map(district => ({
            title: district,
            field: district,
            hozAlign: "center",
        })),
    ];

    return columns;
};

// Preparamos los datos para Tabulator
const tableData = data.map(row => {
    const rowData = { atributo: row.atributo };
    Object.keys(row).forEach(key => {
        if (key !== "atributo") {
            rowData[key] = row[key];
        }
    });
    return rowData;
});

// Inicialización de la tabla
const table = new Tabulator.TabulatorFull(tableContainer, {
    data: tableData,
    layout: "fitColumns",
    placeholder: "Cargando datos...",
    pagination: "local",
    paginationSize: 15,
    locale: true,
    langs: {
        "es": spanishLocale,
    },
    initialLocale: "es", // Establece el idioma inicial a español
    columns: generateColumns(data)  // Generamos las columnas dinámicamente
});

    /*// Configura la exportación al hacer clic en el botón
    document.getElementById("exportFuncionarioList").addEventListener("click", () => {
        table.download("csv", "Reporte_Historico.csv", {
            delimiter: ",", // Cambia el delimitador si necesitas otro
            bom: true       // Incluye BOM para compatibilidad UTF-8
        });
    });*/
}

