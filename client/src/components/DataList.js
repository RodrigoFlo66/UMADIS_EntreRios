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
///////////////////////
    document.getElementById('productForm').style.display = 'none';
    const tableContainer = document.getElementById("dataList"); // Asegúrate de tener este contenedor en tu HTML
    
    // Paso 1: Cargar datos de la API o fuente de datos
    const data = await fetchData();

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
        },
        "columns": {
            "name": "Nombre",
            // Añade más traducciones si tienes nombres específicos en tus columnas
        }
    };

    // Paso 2: Inicialización de la tabla con todas las opciones, incluida la paginación
    const table = new Tabulator.TabulatorFull(tableContainer, {
        data: data,
        layout: "fitColumns",
        placeholder: "Cargando datos...",
        pagination: "local",
        paginationSize: 15,
        locale: true,
        langs: {
            "es": spanishLocale,
        },
        initialLocale: "es", // Establece el idioma inicial a español
        columns: [//PONER , headerFilter: "input" DESPUES DE CADA COLUMNA EJEMPLO: { title: "Distrito", field: "distrito_domicilio", headerFilter: "input" },
            {formatter:"rownum", width:40},
            { title: "Distrito", field: "distrito_domicilio", headerFilter: "input"},
            { title: "Nombres y Apellidos", field: "nombre_apellido", headerFilter: "input"},
            { title: "Edad", field: "edad", headerFilter: "input"},
            { title: "Tipo de Discapacidad", field: "tipo_discapacidad", headerFilter: "input"},
            { title: "Grado de Discapacidad", field: "grado_discapacidad", headerFilter: "input"},
            { title: "Teléfono", field: "telefono_pdc", headerFilter: "input"}
        ]
    });
    ///////////////////////////
        filterTable(); // Agrega la barra de filtros personalizados
         // Crear filtros personalizados
        const ageInput = document.getElementById("ageRange");  // Suponiendo que tienes un input de rango para la edad
        const disabilityTypeSelect = document.getElementById("disabilityType"); // Suponiendo que tienes un select para el tipo de discapacidad    
        // Escuchar los cambios en el rango de edad
        console.log(ageInput.value);
        ageInput.addEventListener("input", () => {
            const ageValue = ageInput.value;
            console.log(ageValue);
            if (ageValue) {
                table.setFilter("edad", "<=", ageValue); // Filtrar las filas por la columna "edad"
            } else {
                table.clearFilter("edad"); // Quitar filtro si el campo está vacío
            }
        });

        // Escuchar los cambios en el tipo de discapacidad
        disabilityTypeSelect.addEventListener("change", () => {
            const typeValue = disabilityTypeSelect.value;
            if (typeValue) {
                table.setFilter("tipo_discapacidad", "=", typeValue); // Filtrar las filas por el tipo de discapacidad
            } else {
                table.clearFilter("tipo_discapacidad"); // Quitar filtro si no hay selección
            }
        });
/////////////////////////////////////////////////////////
    // Configura la exportación al hacer clic en el botón
    document.getElementById("download-csv").addEventListener("click", () => {
        table.download("csv", "data.csv", {
            delimiter: ",", // Cambia el delimitador si necesitas otro
            bom: true       // Incluye BOM para compatibilidad UTF-8
        });
    });
    
    
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

function filterTable() {
    // Crear la barra de filtros en una variable
    const filtersBar = document.getElementById("customFilters");
    filtersBar.innerHTML = `
        <!-- Filtro de rango de edad -->
      <label for="ageRange">Edad máxima:</label>
      <input type="number" id="ageRange" placeholder="Ingrese la edad máxima" style="margin-right: 20px;">

      <!-- Filtro de tipo de discapacidad -->
      <label for="disabilityType">Tipo de Discapacidad:</label>
      <select id="disabilityType" style="margin-right: 20px;">
          <option value="">Todos</option>
          <option value="Visual">Visual</option>
          <option value="Auditiva">Auditiva</option>
          <option value="Motora">Motora</option>
          <option value="Intelectual">Intelectual</option>
          <option value="Psicosocial">Psicosocial</option>
      </select>
    `;

    // Asegurarse de que la barra de filtros esté visible
    filtersBar.style.display = 'block';
}
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
