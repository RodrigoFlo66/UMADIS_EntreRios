import { serverUrl } from '../server.config.js';
import { updateRegistro } from './updateData.js';

export async function mostrarPerfil(id_registro_discapacidad) {
    // Obtén el contenedor del perfil en el HTML principal
    const container = document.getElementById("dataRegistro");
    container.innerHTML = ""; // Limpia el contenido anterior

    // Realiza la solicitud fetch para obtener los datos
    const response = await fetch(`${serverUrl}/registro-pcd/${id_registro_discapacidad}`);
    const dataRegistro = await response.json();
    const data = dataRegistro.data;

    // Estilos CSS (puedes moverlos a un archivo CSS separado si prefieres)
    const style = document.createElement("style");
    style.textContent = `
        .profile-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
        }
        .profile-buttons {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .profile-buttons button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .profile-buttons button:hover {
            background-color: #0056b3;
        }
        .profile-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 20px;
            row-gap: 10px;
            color: #333;
        }
        .profile-info h2 {
            grid-column: span 2;
            font-size: 24px;
            color: #007bff;
            text-align: center;
        }
        .profile-info p {
            margin: 5px 0;
        }
        .profile-info strong {
            display: inline-block;
            width: 160px;
            font-weight: bold;
            color: #555;
        }
    `;
    document.head.appendChild(style);

    // Botones en la parte superior
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "profile-buttons";

    const createButton = (text, onClick) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClick);
        return button;
    };

    buttonsContainer.appendChild(createButton("Editar Registro", () => editarRegistro(id_registro_discapacidad)));
    buttonsContainer.appendChild(createButton("Ver Historial", () => verHistorial(id_registro_discapacidad)));
    buttonsContainer.appendChild(createButton("Registro de Atención", () => registrarAtencion(id_registro_discapacidad)));
    container.appendChild(buttonsContainer);

    // Información del perfil
    const profileInfo = document.createElement("div");
    profileInfo.className = "profile-info";
    profileInfo.innerHTML = `
        <h2>Perfil de ${data.nombre_apellido}</h2>
        <p><strong>Fecha de Nacimiento:</strong> ${data.fecha_nacimiento}</p>
        <p><strong>Edad:</strong> ${data.edad}</p>
        <p><strong>Sexo:</strong> ${data.sexo}</p>
        <p><strong>Nro CI:</strong> ${data.nro_ci}</p>
        <p><strong>Estado Civil:</strong> ${data.estado_civil}</p>
        <p><strong>Idioma PCD:</strong> ${data.idioma_pcd}</p>
        <p><strong>Tipo de Discapacidad:</strong> ${data.tipo_discapacidad}</p>
        <p><strong>Grado de Discapacidad:</strong> ${data.grado_discapacidad}</p>
        <p><strong>Deficiencia:</strong> ${data.deficiencia}</p>
        <p><strong>Edad de Inicio de la Discapacidad:</strong> ${data.edad_inicio_discapacidad}</p>
        <p><strong>Dispositivo que Utiliza:</strong> ${data.dispositivo_utiliza}</p>
        <p><strong>Nivel de Escolaridad:</strong> ${data.nivel_escolaridad}</p>
        <p><strong>Información de Vivienda:</strong> ${data.info_vivienda}</p>
        <p><strong>Información Laboral:</strong> ${data.info_laboral}</p>
        <p><strong>Nombre del Familiar:</strong> ${data.nombre_familiar}</p>
        <p><strong>Número de Hijos PCD:</strong> ${data.nro_hijos_pcd}</p>
        <p><strong>Conyuge PCD:</strong> ${data.conyuge_pcd}</p>
        <p><strong>Dirección de Domicilio:</strong> ${data.direc_domicilio}</p>
        <p><strong>Distrito de Domicilio:</strong> ${data.distrito_domicilio}</p>
        <p><strong>Teléfono PCD:</strong> ${data.telefono_pdc}</p>
        <p><strong>Teléfono de Referencia:</strong> ${data.telefono_referencia}</p>
        <p><strong>Permanencia:</strong> ${data.permanencia}</p>
        <p><strong>Motivo de Cierre:</strong> ${data.motivo_cierre}</p>
    `;
    container.appendChild(profileInfo);
}

// Funciones de ejemplo para los botones de acción
function editarRegistro(id_registro_discapacidad) {
    updateRegistro(id_registro_discapacidad);
}

function verHistorial(id) {
    alert(`Ver historial de ID ${id}`);
}

function registrarAtencion(id) {
    alert(`Registrar atención para ID ${id}`);
}
