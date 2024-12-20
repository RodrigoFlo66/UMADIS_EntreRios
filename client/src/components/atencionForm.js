import { showConfirmModal } from './ModalConfirm.js';
import { serverUrl } from '../server.config.js';
import {createInputWithLabel, createSelectWithLabel} from './dataForm.js';
import { mostrarPerfil } from './dataRegistro.js';
 let linkAdjunto;
 function handleFileUpload(event, linkContainer, statusMessage) {
  const file = event.target.files[0];

  if (file) {
    // Validar que el archivo sea un PDF
    if (file.type !== "application/pdf") {
      alert("Por favor, selecciona un archivo PDF.");
      event.target.value = ""; // Resetear el campo
      return;
    }
    const link = document.getElementById('link_adjunto-link-container');
    if (link) {
      link.innerHTML = '';
    }
    // Mostrar mensaje de subida en curso
    statusMessage.style.display = 'block';
    statusMessage.textContent = 'Subiendo archivo, por favor espera...';

    // Subir el archivo al servidor
    uploadFileToServer(file, linkContainer, statusMessage);
  }
}

async function uploadFileToServer(file, linkContainer, statusMessage) {
  // Crear un objeto FormData para enviar el archivo
  const formData = new FormData();
  formData.append('file', file);

  try {
      // Realizar la solicitud POST al servidor
      const response = await fetch(`${serverUrl}/api/upload`, {
          method: 'POST',
          body: formData,
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
          throw new Error('Error en la solicitud al servidor.');
      }

      // Parsear la respuesta como JSON
      const data = await response.json();
      
      // Verificar si el servidor devuelve un enlace
      if (data.link) {
          
          // Aquí puedes guardar el enlace en tu base de datos o usarlo como necesites
          linkAdjunto = data.link; // Implementa esta función según sea necesario
          console.log(linkAdjunto);
          // Actualizar el enlace al archivo subido
    linkContainer.innerHTML = '';
    const link = document.createElement('a');
    link.href = data.link;
    link.target = '_blank';
    link.textContent = 'Ver documento adjunto subido';
    link.className = 'btn btn-link';
    linkContainer.appendChild(link);

    // Mostrar mensaje de éxito
    statusMessage.textContent = 'Archivo subido correctamente.';
    statusMessage.className = 'text-success mt-2';
      } else {
        statusMessage.textContent = 'Error al subir el archivo.';
        statusMessage.className = 'text-danger mt-2';
        console.error('Error al subir el archivo:', error);
      }
  } catch (error) {
    statusMessage.textContent = 'Error al subir el archivo.';
    statusMessage.className = 'text-danger mt-2';
    console.error('Error al subir el archivo:', error);
  }
}
// Función para crear el campo de archivo
function createFileInputWithLabel(id, labelText, existingFileLink = null) {
  const container = document.createElement('div');
  container.className = 'form-group mb-3';

  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;
  label.className = 'form-label';

  const input = document.createElement('input');
  input.type = 'file';
  input.id = id;
  input.name = id;
  input.className = 'form-control';
  input.accept = 'application/pdf'; // Solo permite archivos PDF

  // Contenedor para mostrar el enlace al archivo existente (si lo hay)
  const linkContainer = document.createElement('div');
  linkContainer.className = 'mt-2';

  if (existingFileLink) {
    const link = document.createElement('a');
    link.href = existingFileLink;
    link.target = '_blank'; // Abre el enlace en una nueva pestaña
    link.textContent = 'Ver documento adjunto actual';
    link.className = 'btn btn-link';
    linkContainer.appendChild(link);
  }

  // Indicador de estado (subiendo, éxito, error)
  const statusMessage = document.createElement('div');
  statusMessage.className = 'text-muted mt-2';
  statusMessage.style.display = 'none'; // Ocultar por defecto

  container.appendChild(label);
  container.appendChild(input);
  container.appendChild(linkContainer);
  container.appendChild(statusMessage);

  // Escuchar cambios en el archivo para validar y manejar la subida
  input.addEventListener('change', (event) => {
    handleFileUpload(event, linkContainer, statusMessage);
  });

  return container;
}


const form = document.createElement('form');
// Crear el formulario
form.id = 'miFormAtencion';
form.className = 'form-container';
export function createFormAtencion(data) {
    const id_registro_discapacidad = data.id_registro_discapacidad;
    console.log(data);
    
    form.innerHTML = ""; // Limpiar contenido previo del formulario
  
    // Crear dos contenedores para las mitades del formulario
    const leftHalf = document.createElement('div');
    leftHalf.className = 'card card-body form-half';
  
    const rightHalf = document.createElement('div');
    rightHalf.className = 'card card-body bg-light form-half';
  
    // DATOS DEL REGISTRO
    const fechaRegistro = createInputWithLabel('fecha_registro', 'date', "", "Fecha", true);
    leftHalf.appendChild(fechaRegistro);
  
    const lugarRegistro = createSelectWithLabel('lugar_registro', [
        { value: '', text: 'Seleccione una opción' },
        { value: 'OFICINA', text: 'OFICINA' },
        { value: 'CONSULTORIO', text: 'CONSULTORIO' },
        { value: 'GABINETE', text: 'GABINETE' },
        { value: 'DOMICILIO', text: 'DOMICILIO' },
        { value: 'CIUDAD', text: 'CIUDAD' },
        { value: 'ESCUELA', text: 'ESCUELA' }
      ], 'Lugar', true);
    leftHalf.appendChild(lugarRegistro);
  
    const nombreCompleto = createInputWithLabel('nombre_pcd', 'text', "", "Nombres y Apellidos de PcD", false);
    leftHalf.appendChild(nombreCompleto);
  
    const atencionRealizada = createInputWithLabel('atencion_realizada', 'text', "", "Detalle de atención realizada", true);
    leftHalf.appendChild(atencionRealizada);
  
    const area = createSelectWithLabel('area_atencion', [
        { value: '', text: 'Seleccione una opción' },
        { value: 'SALUD', text: 'SALUD' },
        { value: 'EDUCACION', text: 'EDUCACION' },
        { value: 'PSICOLOGIA', text: 'PSICOLOGIA' },
        { value: 'SOCIAL', text: 'SOCIAL' },
        { value: 'LEGAL', text: 'LEGAL' },
        { value: 'LABORAL', text: 'LABORAL' }
      ], 'Área de atención', true);
    rightHalf.appendChild(area);
  
    const donacion = createInputWithLabel('donacion', 'text', "", "Donación-Beneficio", false);
    rightHalf.appendChild(donacion);
  
    const informante = createInputWithLabel('nombre_informante', 'text', "", "Atencion realizada por:", true);
    rightHalf.appendChild(informante);
  
    const adjunto = createFileInputWithLabel('link_adjunto', "Documento adjunto (PDF)");
rightHalf.appendChild(adjunto);
  
    // Añadir las mitades al formulario
    form.appendChild(leftHalf);
    form.appendChild(rightHalf);
  
    // Crear y agregar el contenedor de botones al formulario
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-responsive';
    buttonContainer.id = 'buttonContainerList';
  
    
  
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button'; 
    cancelButton.className = 'btn btn-warning mt-2 visible'; 
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', function() {
      showConfirmModal('No se guardarán los cambios realizados. ¿Estás seguro de que deseas continuar?', function() {
        form.reset(); // Limpia el formulario si el usuario confirma
        document.getElementById('dataRegistro').style.display = 'block';
        document.getElementById('showDataList').style.display = 'block';
        mostrarPerfil(id_registro_discapacidad);
        document.getElementById('atencionForm').style.display = 'none';
        
      });
    });
    
  
    const saveButton = document.createElement('button');
    saveButton.id = 'saveButtonList';
    saveButton.type = 'submit';
    saveButton.className = 'btn btn-success mt-2 visible';
    saveButton.textContent = 'Guardar';

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    // Seleccionar el contenedor del formulario en el DOM
    const formContainer = document.getElementById('atencionForm');
    formContainer.innerHTML = ""; // Limpiar contenido previo del contenedor
    
    // Añadir título de perfil
    const profileTitle = document.createElement("h2");
    profileTitle.textContent = "REGISTRO DE ATENCIÓN A LA PCD";
    profileTitle.className = "text-center text-primary mb-4";
    formContainer.appendChild(profileTitle);
  
    // Agregar el formulario completo al contenedor
    formContainer.appendChild(form);
    formContainer.appendChild(buttonContainer);
    // Rellenar los campos con los datos del registro
    const nombrePcdField = document.getElementById('nombre_pcd');
    nombrePcdField.value = data.nombre_apellido;
    nombrePcdField.readOnly = true; // Esto hace que el campo no sea editable

saveButton.addEventListener('click', async function(e) {
    e.preventDefault(); // Prevenir el envío por defecto
    saveButton.disabled = true;
    // Verificar campos obligatorios
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
        saveButton.disabled = false;
        return; // Detener el envío si hay campos vacíos
    }

    const formData = getFromData();
    console.log(formData);
    // Enviar los datos con fetch a tu backend
    try{ ///registro-atencion/:id_usuario/:id_registro_discapacidad
      const response = await fetch(`${serverUrl}/registro-atencion/${id_registro_discapacidad}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    if (response.ok) {
       // Muestra un mensaje de éxito
       form.reset();
       document.getElementById('dataRegistro').style.display = 'block';
       document.getElementById('showDataList').style.display = 'block';
        mostrarPerfil(id_registro_discapacidad);
        document.getElementById('atencionForm').style.display = 'none';
       const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Registro completado con éxito.';
      messageDiv.className = 'alert alert-success';
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
      }, 3000);
    } else {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Error al guardar el registro.';
      messageDiv.className = 'alert alert-danger';
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
      }, 3000);
    }
    } catch (error) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Error al guardar el registro.';
      messageDiv.className = 'alert alert-danger';
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
      }, 3000);
    } finally {
      // Volver a habilitar el botón después de que se procese la solicitud
      saveButton.disabled = false;
    }
});
}
export function getFromData() {
  const formData = {
    fecha_registro: document.getElementById('fecha_registro').value === "" ? null : document.getElementById('fecha_registro').value,
    lugar_registro: document.getElementById('lugar_registro').value,
    nombre_pcd: document.getElementById('nombre_pcd').value.toUpperCase(),
    atencion_realizada: document.getElementById('atencion_realizada').value.toUpperCase(),
    area_atencion: document.getElementById('area_atencion').value,
    donacion: document.getElementById('donacion').value.toUpperCase(),
    nombre_informante: document.getElementById('nombre_informante').value.toUpperCase(),
    link_adjunto: linkAdjunto
};
return formData;
}
export function resetForm() {
  form.reset();
}