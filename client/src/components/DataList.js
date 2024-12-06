import { mostrarPerfil } from './dataRegistro.js';
import { serverUrl } from '../server.config.js';
import * as Tabulator from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.js';
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
    // Define las configuraciones de columnas para ambos estados
    const defaultColumns = [
        { formatter: "rownum", width: 40 },
        { title: "Distrito", field: "distrito_domicilio", headerFilter: "input" },
        { title: "Nombres y Apellidos", field: "nombre_apellido", headerFilter: "input" },
        { title: "Edad", field: "edad", headerFilter: "input" },
        { title: "Tipo de Discapacidad", field: "tipo_discapacidad", headerFilter: "input" },
        { title: "Grado de Discapacidad", field: "grado_discapacidad", headerFilter: "input" },
        { title: "Teléfono", field: "telefono_pdc", headerFilter: "input" },
        { title: "Número de CI", field: "nro_ci", headerFilter: "input" }
    ];
    const closedColumns = [
        { formatter: "rownum", width: 40 },
        { title: "Distrito", field: "distrito_domicilio", headerFilter: "input" },
        { title: "Nombres y Apellidos", field: "nombre_apellido", headerFilter: "input" },
        { title: "Tipo de Discapacidad", field: "tipo_discapacidad", headerFilter: "input" },
        { title: "Grado de Discapacidad", field: "grado_discapacidad", headerFilter: "input" },
        { title: "Motivo de Cierre", field: "motivo_cierre", headerFilter: "input" }
    ];
    // Paso 2: Inicialización de la tabla con todas las opciones, incluida la paginación
    const table = new Tabulator.TabulatorFull(tableContainer, {
        data: data,
        layout: "fitColumns",
        placeholder: "Sin registros disponibles.", // Mensaje dinámico
        pagination: "local",
        paginationSize: 15,
        locale: true,
        langs: {
            "es": spanishLocale,
        },
        initialLocale: "es", // Establece el idioma inicial a español
        columns: defaultColumns
    });
    ///////////////////////////
        filterTable(); // Agrega la barra de filtros personalizados
         // Crear filtros personalizados
        const disabilityTypeSelect = document.getElementById("estadoCivilF"); // Suponiendo que tienes un select para el tipo de discapacidad 
        const filtroSexo = document.getElementById("sexoFiltro");
        const filtroNivelEscolaridad = document.getElementById("nivelEscolaridadF");
        const filtroVivienda = document.getElementById("viviendaFiltro");
        const filtroLaboral = document.getElementById("laboralFiltro");
        const permanenciaSelect = document.getElementById("permanenciaL"); // Suponiendo que tienes un select para la permanencia  
        // Escuchar los cambios en el tipo de discapacidad
        disabilityTypeSelect.addEventListener("change", () => {
            const typeValue = disabilityTypeSelect.value;
            if (typeValue) {
                table.setFilter("estado_civil", "=", typeValue); // Filtrar las filas por el tipo de discapacidad
            } else {
                table.clearFilter("estado_civil"); // Quitar filtro si no hay selección
            }
        });
        filtroSexo.addEventListener("change", () => {
            const typeValue = filtroSexo.value;
            if (typeValue) {
                table.setFilter("sexo", "=", typeValue); // Filtrar las filas por el tipo de discapacidad
            } else {
                table.clearFilter("sexo"); // Quitar filtro si no hay selección
            }
        });
        filtroNivelEscolaridad.addEventListener("change", () => {
            const typeValue = filtroNivelEscolaridad.value;
            if (typeValue) {
                table.setFilter("nivel_escolaridad", "=", typeValue); // Filtrar las filas por el tipo de discapacidad
            } else {
                table.clearFilter("nivel_escolaridad"); // Quitar filtro si no hay selección
            }
        });
        filtroVivienda.addEventListener("change", () => {
            const typeValue = filtroVivienda.value;
            if (typeValue) {
                table.setFilter("info_vivienda", "=", typeValue); // Filtrar las filas por el tipo de discapacidad
            } else {
                table.clearFilter("info_vivienda"); // Quitar filtro si no hay selección
            }
        });
        filtroLaboral.addEventListener("change", () => {
            const typeValue = filtroLaboral.value;
            if (typeValue) {
                table.setFilter("info_laboral", "=", typeValue); // Filtrar las filas por el tipo de discapacidad
            } else {
                table.clearFilter("info_laboral"); // Quitar filtro si no hay selección
            }
        });
        permanenciaSelect.addEventListener("change", (event) => {
            const selectedValue = event.target.value;
            updateTableColumns(selectedValue);
        });
        // Función para actualizar las columnas de la tabla según el filtro de permanencia
    function updateTableColumns(permanenciaValue) {
        if (permanenciaValue) {
            table.setFilter("permanencia", "=", permanenciaValue); // Filtrar por la columna "permanencia" en los datos
            if (permanenciaValue === "CERRADO") {
                table.setColumns(closedColumns); // Cambia a columnas de "cerrado"
            } else {
                table.setColumns(defaultColumns); // Cambia a columnas predeterminadas
            }
        } else {
            table.clearFilter("permanencia"); // Quitar filtro si no hay selección
            table.setColumns(defaultColumns); // Cambia a columnas predeterminadas
        }
    }
/////////////////////////////////////////////////////////
    // Configura la exportación al hacer clic en el botón
    document.getElementById("printAllButton").addEventListener("click", () => {
        const data = table.getData(); // Obtener todos los datos

        // Crear hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registros");
    
        // Guardar como archivo Excel
        XLSX.writeFile(wb, "Lista_de_registros_completa.xlsx");
    });
    // Exportar solo los datos visibles (después de aplicar un filtro)
    document.getElementById("printFilteredButton").addEventListener("click", () => {
        const data = table.getData("active"); // Obtener solo los datos visibles

            // Crear hoja de cálculo
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Registros Filtrados");

            // Guardar como archivo Excel
            XLSX.writeFile(wb, "Lista_de_registros_filtrados.xlsx");
    });
    
    // Añade el evento de clic en las filas después de la configuración completa
    table.on("rowClick", (e, row) => {
        const data = row.getData();
        const idRegistro = data.id_registro_discapacidad; 
        document.getElementById('dataRegistro').style.display = 'block';
        document.getElementById('estadistica').style.display = 'none';
        document.getElementById('dataList').style.display = 'none';
        mostrarPerfil(idRegistro); 
    });
}

initializeTable();

function filterTable() {
    // Crear la barra de filtros en una variable
    const filtersBar = document.getElementById("customFilters");
    filtersBar.innerHTML = `
        <div class="filter-bar form-group d-flex flex-wrap align-items-center justify-content-between mb-3" style="gap: 15px;">
        <!-- Filtro de permanencia -->
    <div class="filter-item d-flex align-items-center">
        <label for="permanenciaL" class="form-label me-2 mb-0" style="white-space: nowrap;">Permanencia:</label>
        <select id="permanenciaL" class="form-select" style="width: auto;">
            <option value="">Todos</option>
            <option value="PERMANECE">Permanece</option>
            <option value="CERRADO">Cerrado</option>
        </select>
    </div>
    <!-- Filtro de Vivienda -->
    <div class="filter-item d-flex align-items-center">
        <label for="viviendaFiltro" class="form-label me-2 mb-0" style="white-space: nowrap;">Información de Vivienda:</label>
        <select id="viviendaFiltro" class="form-select" style="width: auto;">
            <option value="">Todos</option>
            <option value="NO TIENE VIVIENDA PROPIA">NO TIENE VIVIENDA PROPIA</option>
            <option value="VIVIENDA PROPIA CON APOYO 100%">VIVIENDA PROPIA CON APOYO 100%</option>
            <option value="VIVIENDA PROPIA CON CONTRAPARTE">VIVIENDA PROPIA CON CONTRAPARTE</option>
        </select>
    </div>
    <!-- Filtro de info laboral -->
    <div class="filter-item d-flex align-items-center">
        <label for="laboralFiltro" class="form-label me-2 mb-0" style="white-space: nowrap;">Información Laboral:</label>
        <select id="laboralFiltro" class="form-select" style="width: auto;">
            <option value="">Todos</option>
            <option value="SIN TRABAJO">SIN TRABAJO</option>
            <option value="TRABAJO POR CUENTA PROPIA">TRABAJO POR CUENTA PROPIA</option>
            <option value="TRABAJO REMUNERADO">TRABAJO REMUNERADO</option>
        </select>
    </div>
    <!-- Filtro de estado civil -->
    <div class="filter-item d-flex align-items-center">
        <label for="estadoCivilF" class="form-label me-2 mb-0" style="white-space: nowrap;">Estado civil:</label>
        <select id="estadoCivilF" class="form-select" style="width: auto;">
            <option value="">Todos</option>
            <option value="SOLTERO(A)">SOLTERO(A)</option>
            <option value="CASADO(A)">CASADO(A)</option>
            <option value="DIVORCIADO(A)">DIVORCIADO(A)</option>
            <option value="CONCUBINATO">CONCUBINATO</option>
            <option value="SEPARADO">SEPARADO</option>
        </select>
    </div>

    <!-- Filtro de sexo -->
    <div class="filter-item d-flex align-items-center">
        <label for="sexoFiltro" class="form-label me-2 mb-0" style="white-space: nowrap;">Sexo:</label>
        <select id="sexoFiltro" class="form-select" style="width: auto;">
            <option value="">Todos</option>
            <option value="VARON">VARON</option>
            <option value="MUJER">MUJER</option>
        </select>
    </div>

    <!-- Filtro de nivel de escolaridad -->
    <div class="filter-item d-flex align-items-center">
        <label for="nivelEscolaridadF" class="form-label me-2 mb-0" style="white-space: nowrap;">Nivel de Escolaridad:</label>
        <select id="nivelEscolaridadF" class="form-select" style="width: auto;">
            <option value="">Todos</option>
            <option value="NINGUNO">NINGUNO</option>
            <option value="INICIAL">INICIAL</option>
            <option value="PRIMARIA">PRIMARIA</option>
            <option value="SECUNDARIA">SECUNDARIA</option>
            <option value="TECNICO">TECNICO</option>
            <option value="UNIVERSITARIO">UNIVERSITARIO</option>
            <option value="ESPECIAL">ESPECIAL</option>
        </select>
    </div>
    
    <!-- Botones -->
    <div class="filter-item d-flex align-items-center ">
        <button id="printAllButton" class="btn btn-success me-2">Exportar Todo</button>
        <button id="printFilteredButton" class="btn btn-primary">Exportar Filtro</button>
    </div>
</div>


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
