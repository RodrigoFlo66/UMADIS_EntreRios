import { serverUrl } from '../server.config.js';
import * as Tabulator from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.js';


export async function tablaFuncionario() {
///////////////////////
    document.getElementById('listaFuncionario').style.display = 'block';
    const mainContainer = document.getElementById("listaFuncionario"); // Asegúrate de tener este contenedor en tu HTML
    mainContainer.innerHTML = ""; // Limpia el contenido anterior
    // Crear y agregar el título
    const profileTitle = document.createElement("h2");
    profileTitle.textContent = "REPORTE HISTOÓRICO DE REGISTROS DE ATENCIÓN";
    profileTitle.className = "text-center text-primary mb-4";
    mainContainer.appendChild(profileTitle);
    filterTable(mainContainer); // Agrega la barra de filtros personalizados
    // Contenedor específico para la tabla
    const tableContainer = document.createElement("div");
    tableContainer.id = "funcionarioList";
    mainContainer.appendChild(tableContainer);
    // Paso 1: Cargar datos de la API o fuente de datos
    const response = await fetch(`${serverUrl}/registros-atencion`);
    const result = await response.json();
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
        { title: "Nombre de funcionario", field: "nombre_informante", headerFilter: "input" },
        { title: "Nombre de la PcD", field: "nombre_pcd", headerFilter: "input" },
        { title: "Detalle de atención", field: "atencion_realizada", headerFilter: "input" },
        { 
            title: "Fecha", 
            field: "fecha_registro", 
            headerFilter: "input", 
            mutator: (value) => value ? value.split('T')[0] : 'N/A' 
        },
        { title: "Lugar", field: "lugar_registro", headerFilter: "input" },
        {
            title: "Adjunto",
            field: "link_adjunto",
            formatter: function (cell, formatterParams, onRendered) {
                const link = cell.getValue();
                if (link) {
                    return `<a href="${link}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">Ver Documento</a>`;
                } else {
                    return "No disponible";
                }
            },
        }
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
        
         // Crear filtros personalizados
         const clearDatesButton = document.getElementById('clearDatesButtonF');
         const startDateInput = document.getElementById("startDateF"); // Filtro de fecha de inicio
         const endDateInput = document.getElementById("endDateF"); // Filtro de fecha de fin         
         [startDateInput, endDateInput].forEach(input => {
            input.addEventListener("change", () => {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;
        
                if (startDate || endDate) {
                    // Aplicar un filtro personalizado
                    table.setFilter((data) => {
                        const rowDate = new Date(data.fecha_registro); // Ajusta el campo a tu columna de fechas
                        const start = startDate ? new Date(startDate) : null;
                        const end = endDate ? new Date(endDate) : null;
        
                        if (start && end) return rowDate >= start && rowDate <= end;
                        if (start) return rowDate >= start;
                        if (end) return rowDate <= end;
                        return true; // Si no hay fechas específicas, mostrar todo
                    });
                } else {
                    table.clearFilter(); // Quitar el filtro si no hay fechas
                }
            });
        });
        clearDatesButton.addEventListener('click', () => {
            startDateInput.value = ''; // Limpiar Fecha Inicio
            endDateInput.value = '';  // Limpiar Fecha Fin
            table.clearFilter("fecha_registro"); // Limpiar filtro de la tabla si se estaba aplicando
        });
/////////////////////////////////////////////////////////
    // Configura la exportación al hacer clic en el botón
    document.getElementById("exportFuncionarioList").addEventListener("click", () => {
        table.download("csv", "Reporte_Historico.csv", {
            delimiter: ",", // Cambia el delimitador si necesitas otro
            bom: true       // Incluye BOM para compatibilidad UTF-8
        });
    });
}

function filterTable(mainContainer) {
    // Crear la barra de filtros en una variable
    const filtersBar = document.createElement("div");

    filtersBar.innerHTML = `
     <div class="form-group d-flex align-items-center justify-content-between mb-3" style="gap: 10px; max-width: 600px;">
        
            <div class="d-flex align-items-center me-3">
                <label for="startDate" class="form-label me-2 mb-0" style="white-space: nowrap;">Fecha Inicio:</label>
                <input type="date" id="startDateF" class="form-control" style="width: auto;" />
            </div>
            <div class="d-flex align-items-center">
                <label for="endDate" class="form-label me-2 mb-0" style="white-space: nowrap;">Fecha Fin:</label>
                <input type="date" id="endDateF" class="form-control" style="width: auto;" />
            </div>
        
    <button id="clearDatesButtonF" class="btn btn-warning" style="white-space: nowrap;">Limpiar Fechas</button>
    <button id="exportFuncionarioList" class="btn btn-success" style="white-space: nowrap;">Exportar todo</button>
    <button id="exportFiltroF" class="btn btn-primary" style="white-space: nowrap;">Exportar filtro</button>
    </div>

    `;
mainContainer.appendChild(filtersBar);
    // Asegurarse de que la barra de filtros esté visible
    filtersBar.style.display = 'block';
}
