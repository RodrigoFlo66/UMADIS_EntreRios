import { mostrarPerfil } from './dataRegistro.js';
import { serverUrl } from '../server.config.js';
import * as Tabulator from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.js';

let table;
//const tableContainer = document.getElementById('dataList');
let fetchedData = []; // Guardamos los datos originales para evitar múltiples llamadas a fetch

async function fetchData() {
    try {
        const response = await fetch(`${serverUrl}/registros-pcd/1`);
        const result = await response.json();
        fetchedData = result.data;
        return fetchedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function initializeTable() {
    document.getElementById('productForm').style.display = 'none';
    const tableContainer = document.getElementById("dataList"); // Asegúrate de tener este contenedor en tu HTML
    
    // Paso 1: Cargar datos de la API o fuente de datos
    const data = await fetchData();

    // Paso 2: Inicialización de la tabla con todas las opciones, incluida la paginación
    const table = new Tabulator.TabulatorFull(tableContainer, {
        data: data,
        layout: "fitColumns",
        placeholder: "Cargando datos...",
        pagination: "local",
        paginationSize: 15,
        columns: [
            {formatter:"rownum", width:40},
            { title: "Distrito", field: "distrito_domicilio", headerFilter: "input" },
            { title: "Nombres y Apellidos", field: "nombre_apellido", headerFilter: "input" },
            { title: "Edad", field: "edad", headerFilter: "input" },
            { title: "Tipo de Discapacidad", field: "tipo_discapacidad", headerFilter: "input" },
            { title: "Grado de Discapacidad", field: "grado_discapacidad", headerFilter: "input" },
            { title: "Teléfono", field: "telefono_pdc", headerFilter: "input" }
        ]
    });

    // Configura la exportación al hacer clic en el botón
    document.getElementById("download-csv").addEventListener("click", () => {
        table.download("csv", "data.csv", {
            delimiter: ",", // Cambia el delimitador si necesitas otro
            bom: true       // Incluye BOM para compatibilidad UTF-8
        });
    });
    document.getElementById('download-csv').style.display = 'none'; // Oculta el botón de descarga CSV
    // Añade el evento de clic en las filas después de la configuración completa
    table.on("rowClick", (e, row) => {
        const data = row.getData();
        const idRegistro = data.id_registro_discapacidad; 
        document.getElementById('dataRegistro').style.display = 'block';
        document.getElementById('download-csv').style.display = 'none';
        document.getElementById('dataList').style.display = 'none';
        mostrarPerfil(idRegistro); 
    });
}




initializeTable();

export function searchRecords(query) {
    const filteredData = fetchedData.filter(row => {
        return Object.keys(row).some(key => {
            // Solo verifica los campos especificados
            return [
                "nombre_apellido",
                "fecha_nacimiento",
                "edad",
                "sexo",
                "nro_ci",
                "estado_civil",
                "idioma_pcd",
                "tipo_discapacidad",
                "grado_discapacidad",
                "deficiencia",
                "edad_inicio_discapacidad",
                "dispositivo_utiliza",
                "nivel_escolaridad",
                "info_vivienda",
                "info_laboral",
                "nombre_familiar",
                "nro_hijos_pcd",
                "conyuge_pcd",
                "direc_domicilio",
                "distrito_domicilio",
                "telefono_pdc",
                "telefono_referencia",
                "permanencia",
                "motivo_cierre"
            ].includes(key) && String(row[key]).toLowerCase().includes(query.toLowerCase());
        });
    });

    if (table) {
        table.setData(filteredData); // Actualiza la tabla con los datos filtrados
    } else {
        console.error('table no está disponible');
    }
}
