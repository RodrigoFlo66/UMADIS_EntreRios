import { serverUrl } from '../server.config.js';
import { createFormAtencion } from './atencionForm.js';
import { tablaPaciente } from './atencionList.js';
import { updateRegistro } from './updateData.js';

export async function mostrarPerfil(id_registro_discapacidad) {
    document.getElementById('ReporteFuncionario').style.display = 'none';
    document.getElementById('showProductForm').style.display = 'none';
    document.getElementById('customFilters').style.display = 'none';
    const container = document.getElementById("dataRegistro");
    container.innerHTML = ""; // Limpia el contenido anterior

    const response = await fetch(`${serverUrl}/registro-pcd/${id_registro_discapacidad}`);
    const dataRegistro = await response.json();
    const data = dataRegistro.data;
    createFormAtencion(data);
    document.getElementById('atencionForm').style.display = 'none';
    // Estilos CSS (puedes moverlos a un archivo CSS separado si prefieres)
    const style = document.createElement("style");
    style.textContent = `
        .profile-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Sombra de contenedor */
            font-family: Arial, sans-serif;
            background-color: #f9f9f9; /* Fondo del contenedor del perfil */
        }

        /* Tabla de perfil */
        .profile-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        
        .profile-table th, .profile-table td {
    padding: 10px 15px;
    border: 1px solid #ddd; /* Bordes de las celdas */
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.03); /* Sombra interna */
}

        /* Encabezado de la tabla */
        .profile-table th {
            width: 30%; /* Ancho de la columna de nombres */
            background-color: var(--bs-primary); /* Fondo del encabezado usando la variable CSS de Bootstrap */
            color: white; /* Color del texto del encabezado */
            font-weight: bold;
            text-align: left;
        }

        /* Celdas de la tabla */
        .profile-table td {
        width: 70%; /* Ancho de la columna de valores */
            background-color: #f9f9f9; /* Fondo de las celdas */
            color: #333; /* Color del texto de las celdas */
        }

        

    `;
    document.head.appendChild(style);

    // Botones de acciones
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "profile-buttons";
    buttonsContainer.appendChild(createButton("Editar Registro", () => editarRegistro(id_registro_discapacidad), 'btn btn-success me-2'));
    buttonsContainer.appendChild(createButton("Ver Historial", () => verHistorial(id_registro_discapacidad), 'btn btn-secondary me-2'));
    buttonsContainer.appendChild(createButton("Registro de Atención", () => registrarAtencion(data), 'btn btn-warning'));
    container.appendChild(buttonsContainer);

    // Título de perfil
    const profileTitle = document.createElement("h2");
    profileTitle.textContent = `DATOS DE ${data.nombre_apellido}`;
    profileTitle.className = "text-center text-primary mb-4";
    container.appendChild(profileTitle);

    // Información de perfil en formato de tabla
    const profileTable = document.createElement("table");
    profileTable.className = "profile-table";
    profileTable.innerHTML = `
        <tr>
        <th>Fecha de Nacimiento:</th>
        <td>${data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : 'null'}</td>
        </tr>
        <tr><th>Edad:</th><td>${data.edad}</td></tr>
        <tr><th>Sexo:</th><td>${data.sexo}</td></tr>
        <tr><th>Numero de CI:</th><td>${data.nro_ci}</td></tr>
        <tr><th>Estado Civil:</th><td>${data.estado_civil}</td></tr>
        <tr><th>Idioma hablado:</th><td>${data.idioma_pcd}</td></tr>
        <tr><th>Tipo de Discapacidad:</th><td>${data.tipo_discapacidad}</td></tr>
        <tr><th>Grado de Discapacidad:</th><td>${data.grado_discapacidad}</td></tr>
        <tr><th>Deficiencia:</th><td>${data.deficiencia}</td></tr>
        <tr><th>Edad de Inicio de la Discapacidad:</th><td>${data.edad_inicio_discapacidad}</td></tr>
        <tr><th>Dispositivo que Utiliza:</th><td>${data.dispositivo_utiliza}</td></tr>
        <tr><th>Nivel de Escolaridad:</th><td>${data.nivel_escolaridad}</td></tr>
        <tr><th>Información de Vivienda:</th><td>${data.info_vivienda}</td></tr>
        <tr><th>Información Laboral:</th><td>${data.info_laboral}</td></tr>
        <tr><th>Nombre del Familiar:</th><td>${data.nombre_familiar}</td></tr>
        <tr><th>Número de Hijos:</th><td>${data.nro_hijos_pcd}</td></tr>
        <tr><th>Conyuge:</th><td>${data.conyuge_pcd}</td></tr>
        <tr><th>Dirección de Domicilio:</th><td>${data.direc_domicilio}</td></tr>
        <tr><th>Distrito de Domicilio:</th><td>${data.distrito_domicilio}</td></tr>
        <tr><th>Teléfono/Celular:</th><td>${data.telefono_pdc}</td></tr>
        <tr><th>Teléfono de Referencia:</th><td>${data.telefono_referencia}</td></tr>
        <tr><th>Permanencia:</th><td>${data.permanencia}</td></tr>
        <tr><th>Motivo de Cierre:</th><td>${data.motivo_cierre}</td></tr>
    `;
    container.appendChild(profileTable);
}

// Función auxiliar para crear botones de acción
function createButton(text, onClick, className) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = className;
    button.addEventListener("click", onClick);
    return button;
}

// Ejemplos de funciones para botones de acción
function editarRegistro(id_registro_discapacidad) {
    updateRegistro(id_registro_discapacidad);
}
function verHistorial(id_registro_discapacidad) { 
    document.getElementById('listaAntencion').style.display = 'block';
    tablaPaciente(id_registro_discapacidad);
    document.getElementById('dataRegistro').style.display = 'none';
}
function registrarAtencion(data) {
    document.getElementById('atencionForm').style.display = 'block';
    document.getElementById('dataRegistro').style.display = 'none';
    document.getElementById('showDataList').style.display = 'none';
    const existingButton = document.getElementById('editButtonIdList'); 
    const saveButton = document.getElementById('saveButtonList');

    if (existingButton) {
        existingButton.classList.remove('visible');
        saveButton.classList.add('visible');
    }
}
