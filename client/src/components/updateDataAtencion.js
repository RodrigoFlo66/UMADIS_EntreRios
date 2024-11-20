import { getFromData, resetForm} from './atencionForm.js';
import { mostrarPerfil } from './dataRegistro.js';
import { serverUrl } from '../server.config.js';
export async function  updateAtencion(id_registro_atencion, id_registro_discapacidad) {
    console.log(id_registro_atencion);
    const form = document.getElementById('atencionForm');
    try {
    document.getElementById('atencionForm').style.display = 'block';
    document.getElementById('listaAntencion').style.display = 'none';
    document.getElementById('showDataList').style.display = 'none';
    
     // Realizar la solicitud para obtener los datos del registro
     const response = await fetch(`${serverUrl}/registro-atencion/${id_registro_atencion}`);
     const resultResponse = await response.json();
     const result = resultResponse.registros;
     const data = result[0];
    // Establecer los valores en los campos del formulario
    document.getElementById('fecha_registro').value = data.fecha_registro ? data.fecha_registro.split('T')[0] : '';
    document.getElementById('lugar_registro').value = data.lugar_registro || '';
    document.getElementById('nombre_pcd').value = data.nombre_pcd || '';
    document.getElementById('atencion_realizada').value = data.atencion_realizada || '';
    document.getElementById('area_atencion').value = data.area_atencion || '';
    document.getElementById('donacion').value = data.donacion || '';
    document.getElementById('nombre_informante').value = data.nombre_informante || '';
    updateFileInputWithLink('link_adjunto', data.link_adjunto || '');
      
    // Actualiza el campo de entrada y muestra el enlace al archivo existente
function updateFileInputWithLink(inputId, fileLink) {
    const inputElement = document.getElementById(inputId);

    // Verificar si el campo ya tiene un contenedor para el enlace
    let linkContainer = document.getElementById(`${inputId}-link-container`);
    if (!linkContainer) {
        // Crear un contenedor para el enlace si no existe
        linkContainer = document.createElement('div');
        linkContainer.id = `${inputId}-link-container`;
        linkContainer.className = 'mt-2';

        // Insertar el contenedor después del campo de entrada
        inputElement.parentNode.appendChild(linkContainer);
    }

    // Limpiar el contenedor del enlace
    linkContainer.innerHTML = '';

    // Agregar el enlace solo si hay un archivo existente
    if (fileLink) {
        const link = document.createElement('a');
        link.href = fileLink;
        link.target = '_blank'; // Abre en una nueva pestaña
        link.textContent = 'Ver documento adjunto actual';
        link.className = 'btn btn-link';

        linkContainer.appendChild(link);
    }
}

    } catch (error) {
        console.error('Hubo un problema con la solicitud de actualización del registro:', error);
    }
    
    // Oculta un botón existente en el formulario por su ID.
    const existingButton = document.getElementById('saveButtonList'); 
    if (existingButton) {
        existingButton.classList.remove('visible');
    }
    
    const buttonContainer = document.getElementById('buttonContainerList');
    // Crea un nuevo botón si no existe
    let editButton;
    if(document.getElementById('editButtonIdList') === null) {
    editButton = document.createElement('button');
    editButton.id = 'editButtonIdList'; 
    editButton.type = 'button'; 
    editButton.className = 'btn btn-primary mt-2 visible'; 
    editButton.textContent = 'Actualizar';
    buttonContainer.appendChild(editButton);
    form.appendChild(buttonContainer);
    }else{
    editButton = document.getElementById('editButtonIdList');
    editButton.classList.add('visible');
    }
    // Elimina el event listener existente si ya se ha añadido uno
    if (editButton.eventListenerAdded) {
        editButton.removeEventListener('click', editButton.handler);
    }
    // Añade un manejador de eventos al botón para cambiar su funcionalidad cuando se haga clic.
    const editHandler = async function() {
        const formData = getFromData();
        console.log(formData);
        try {
            // Verificar campos obligatorios
            const form=document.getElementById('atencionForm');
            const requiredFields = form.querySelectorAll('input[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid'); // Marca el campo como inválido
                    // Agrega el mensaje de error si no existe
                    let error = field.parentElement.querySelector('.error-message');
                    if (!error) {
                        error = document.createElement('div');
                        error.className = 'error-message text-danger';
                        error.textContent = 'Este campo es obligatorio.';
                        field.parentElement.appendChild(error);
                    }
                } else {
                    field.classList.remove('is-invalid'); // Quita el estilo de error si se llena
                    const error = field.parentElement.querySelector('.error-message');
                    if (error) {
                        field.parentElement.removeChild(error);
                    }
                }
            });

            if (!isValid) {
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = 'Por favor, llena todos los campos obligatorios.';
                messageDiv.className = 'alert alert-danger';
                messageDiv.style.display = 'block';
                setTimeout(() => {
                    messageDiv.textContent = '';
                    messageDiv.className = '';
                }, 3000);
                return; // Detener el envío si hay campos vacíos
            }
            // Realiza la solicitud PUT para actualizar el registro
            const response = await fetch(`${serverUrl}/registro-atencion/${id_registro_atencion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
            resetForm();
            document.getElementById('showDataList').style.display = 'block';
            document.getElementById('dataRegistro').style.display = 'block';
            mostrarPerfil(id_registro_discapacidad);
            document.getElementById('atencionForm').style.display = 'none';
            document.getElementById('atrasHistoricoPaciente').style.display = 'none';
                // Muestra un mensaje de éxito
            
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Registro actualizado con éxito.';
            messageDiv.className = 'alert alert-success';
            messageDiv.style.display = 'block';
            setTimeout(() => {
              messageDiv.textContent = '';
              messageDiv.className = '';
            }, 3000);
            } else {
                const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Error al actualizar el registro.';
            messageDiv.className = 'alert alert-danger';
            messageDiv.style.display = 'block';
            setTimeout(() => {
              messageDiv.textContent = '';
              messageDiv.className = '';
            }, 3000);
            }
        } catch (error) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Error al actualizar el registro.';
            messageDiv.className = 'alert alert-danger';
            messageDiv.style.display = 'block';
            setTimeout(() => {
              messageDiv.textContent = '';
              messageDiv.className = '';
            }, 3000);
        }
    };
    // Añade el nuevo event listener
    editButton.addEventListener('click', editHandler);
    editButton.handler = editHandler;
    editButton.eventListenerAdded = true;
}  