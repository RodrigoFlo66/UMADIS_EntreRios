import * as Tabulator from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.js';
import { showDataModal } from './DataModal.js';

let table;
const tableContainer = document.getElementById('dataList');
let fetchedData = []; // Guardamos los datos originales para evitar múltiples llamadas a fetch

async function fetchData() {
    try {
        const response = await fetch(`http://localhost:8080/registros-pcd/1`);
        const result = await response.json();
        fetchedData = result.data;
        return fetchedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function initializeTable() {
    const data = await fetchData();
    table = new Tabulator.Tabulator(tableContainer, {
        data: data,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 30,
        columns: [
            { title: "Distrito", field: "distrito_domicilio", headerFilter: "input" },
            { title: "Nombres y Apellidos", field: "nombre_apellido", headerFilter: "input" },
            { title: "Edad", field: "edad", headerFilter: "input" },
            { title: "Tipo de Discapacidad", field: "tipo_discapacidad", headerFilter: "input" },
            { title: "Grado de Discapacidad", field: "grado_discapacidad", headerFilter: "input" },
            { title: "Teléfono", field: "telefono_pdc", headerFilter: "input" }
        ],
        rowClick: (e, row) => {
          const data = row.getData();
          const idRegistro = data.id_registro_discapacidad; // Obtén el ID del registro
          showDataModal(idRegistro); // Llama a showDataModal con el ID del registro
      }
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
