import { mostrarPerfil } from './dataRegistro.js';
import { serverUrl } from '../server.config.js';
import * as Tabulator from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.js';

export async function tablaPaciente(id_registro_discapacidad) {
///////////////////////
    document.getElementById('dataRegistro').style.display = 'none';
    //document.getElementById('productForm').style.display = 'none';
    const tableContainer = document.getElementById("atencionList"); // Asegúrate de tener este contenedor en tu HTML
    
    // Paso 1: Cargar datos de la API o fuente de datos
    const response = await fetch(`${serverUrl}/registros-atencion/${id_registro_discapacidad}`);
    const result = await response.json();
    console.log(result.registros);
    const data = result.registros;
    
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
    // Define las configuraciones de columnas para ambos estados
    const defaultColumns = [
        { formatter: "rownum", width: 40 },
        { title: "Detalle de atención", field: "atencion_realizada", headerFilter: "input" },
        { title: "Donaicon-Beneficio", field: "donacion", headerFilter: "input" },
        { title: "Área", field: "area_atencion", headerFilter: "input" },
        { title: "Fecha", field: "fecha_registro", headerFilter: "input" },
        { title: "Lugar", field: "lugar_registro", headerFilter: "input" },
        { title: "Informante", field: "nombre_informante", headerFilter: "input" }
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
        placeholder: "Cargando datos...",
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
      /*  filterTable(); // Agrega la barra de filtros personalizados
         // Crear filtros personalizados
        const ageInput = document.getElementById("ageRange");  // Suponiendo que tienes un input de rango para la edad
        const disabilityTypeSelect = document.getElementById("disabilityType"); // Suponiendo que tienes un select para el tipo de discapacidad  
        const permanenciaSelect = document.getElementById("permanencia"); // Suponiendo que tienes un select para la permanencia  
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
    }*/
/////////////////////////////////////////////////////////
    // Configura la exportación al hacer clic en el botón
    document.getElementById("download-csv").addEventListener("click", () => {
        table.download("csv", "data.csv", {
            delimiter: ",", // Cambia el delimitador si necesitas otro
            bom: true       // Incluye BOM para compatibilidad UTF-8
        });
    });
    
    
    /*// Añade el evento de clic en las filas después de la configuración completa
    table.on("rowClick", (e, row) => {
        const data = row.getData();
        const idRegistro = data.id_registro_discapacidad; 
        document.getElementById('dataRegistro').style.display = 'block';
        document.getElementById('download-csv').style.display = 'none';
        document.getElementById('dataList').style.display = 'none';
        mostrarPerfil(idRegistro); 
    });*/
}

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
      <!-- Filtro de permanencia -->
      <label for="permanencia">Permanencia:</label>
      <select id="permanencia" style="margin-right: 20px;">
          <option value="">Todos</option>
          <option value="PERMANECE">Permanece</option>
          <option value="CERRADO">Cerrado</option>
      </select>
    `;

    // Asegurarse de que la barra de filtros esté visible
    filtersBar.style.display = 'block';
}