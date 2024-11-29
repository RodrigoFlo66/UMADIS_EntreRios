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
    filterTable(mainContainer); // Agrega la barra de filtros personalizados
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

// Inserta filas auxiliares
const augmentedData = [
    { atributo: "Permanencia", isHeader: true },
    ...data.filter(row => row.atributo === "PERMANECE" || row.atributo === "CERRADO"),
    { atributo: "Sexo", isHeader: true },
    ...data.filter(row => row.atributo === "VARON" || row.atributo === "MUJER"),
    { atributo: "Edad", isHeader: true },
    ...data.filter(row => ["0-5", "6-18", "19-30", "31-59", "60+"].includes(row.atributo)),
    { atributo: "Grado de Discapacidad", isHeader: true },
    ...data.filter(row => ["MUY GRAVE", "GRAVE", "MODERADO", "LEVE"].includes(row.atributo)),
    { atributo: "Tipo de Discapacidad", isHeader: true },
    ...data.filter(row => ["AUDITIVA", "FISICA MOTORA", "INTELECTUAL", "MULTIPLE", "PSIQUICA", "VISCERAL", "VISUAL", "RETRASO"].includes(row.atributo)),
];
// Genera columnas dinámicas
const generateColumns = (data) => {
    const districts = Object.keys(data[0]).filter(key => key !== "atributo" && key !== "isHeader");
    const columns = [
        { title: "Característica", field: "atributo", width: 150, headerFilter: "input" },
        ...districts.map(district => ({
            title: district,
            field: district,
            hozAlign: "center",
        })),
    ];
    return columns;
};

// Inicialización de la tabla
const table = new Tabulator.TabulatorFull(tableContainer, {
    data: augmentedData,
    layout: "fitColumns",
    placeholder: "Cargando datos...",
    locale: true,
    langs: {
        "es": spanishLocale,
    },
    initialLocale: "es", // Establece el idioma inicial a español
    columns: generateColumns(data),
    rowFormatter: (row) => {
        const rowData = row.getData();
        if (rowData.isHeader) {
            row.getElement().style.backgroundColor = "#f4f4f4"; // Cambia el fondo
            row.getElement().style.fontWeight = "bold"; // Cambia el estilo de texto
            row.getElement().style.textAlign = "center"; // Centra el texto
        }
    },
});

    // Configura la exportación al hacer clic en el botón
    document.getElementById("ExportarEstadistica").addEventListener("click", () => {
        const data = table.getData(); // Obtener todos los datos

    // Crear hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");

    // Guardar como archivo Excel
    XLSX.writeFile(wb, "Estadísticas.xlsx");
    });
}
function filterTable(mainContainer) {
    // Crear la barra de filtros en una variable
    const filtersBar = document.createElement("div");
    filtersBar.innerHTML = `
     <div class="form-group d-flex align-items-center justify-content-between mb-3" style="gap: 10px; max-width: 600px;">
    <button id="ExportarEstadistica" class="btn btn-primary" style="white-space: nowrap;">Exportar datos estadisticos</button>
    </div>

    `;
mainContainer.appendChild(filtersBar);
    // Asegurarse de que la barra de filtros esté visible
    filtersBar.style.display = 'block';
}


