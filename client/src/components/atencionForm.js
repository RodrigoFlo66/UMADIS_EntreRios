import { showConfirmModal } from './ModalConfirm.js';
import { serverUrl } from '../server.config.js';
import {createInputWithLabel, createSelectWithLabel} from './dataForm.js';
import { mostrarPerfil } from './dataRegistro.js';

export function createFormAtencion(data) {
    const id_registro_discapacidad = data.id_registro_discapacidad;
    console.log(data);
    document.getElementById('dataRegistro').style.display = 'none';
    document.getElementById('showDataList').style.display = 'none';
    // Crear el formulario
    const form = document.createElement('form');
    form.id = 'miFormAtencion';
    form.className = 'form-container';
  
    // Crear dos contenedores para las mitades del formulario
    const leftHalf = document.createElement('div');
    leftHalf.className = 'card card-body form-half';
  
    const rightHalf = document.createElement('div');
    rightHalf.className = 'card card-body bg-light form-half';
  
    // DATOS DEL REGISTRO
    const fechaRegistro = createInputWithLabel('fecha_registro', 'date', "", "Fecha de registro", true);
    leftHalf.appendChild(fechaRegistro);
  
    const lugarRegistro = createSelectWithLabel('lugar_registro', [
        { value: '', text: 'Seleccione una opción' },
        { value: 'OFICINA', text: 'OFICINA' },
        { value: 'CONSULTORIO', text: 'CONSULTORIO' },
        { value: 'GABINETE', text: 'GABINETE' },
        { value: 'DOMICILIO', text: 'DOMICILIO' },
        { value: 'CIUDAD', text: 'CIUDAD' }
      ], 'Lugar de registro', true);
    leftHalf.appendChild(lugarRegistro);
  
    const nombreCompleto = createInputWithLabel('nombre_pcd', 'text', "", "Nombres y Apellidos de PcD", false);
    leftHalf.appendChild(nombreCompleto);
  
    const atencionRealizada = createInputWithLabel('atencion_realizada', 'text', "", "Atención realizada", true);
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
  
    const donacion = createInputWithLabel('donacion', 'text', "", "Donación-Beneficio", true);
    rightHalf.appendChild(donacion);
  
    const informante = createInputWithLabel('nombre_informante', 'text', "", "Nombre del informante", true);
    rightHalf.appendChild(informante);
  
    const adjunto = createInputWithLabel('link_adjunto', 'text', "", "Documento adjunto", true);
    rightHalf.appendChild(adjunto);
  
    // Añadir las mitades al formulario
    form.appendChild(leftHalf);
    form.appendChild(rightHalf);
  
    // Crear y agregar el contenedor de botones al formulario
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-responsive';
  
    const clearButton = document.createElement('button');
    clearButton.type = 'button'; 
    clearButton.className = 'btn btn-warning mt-2'; 
    clearButton.textContent = 'Limpiar';
    clearButton.addEventListener('click', function() {
      showConfirmModal('¿Estás seguro de que deseas limpiar el formulario?', function() {
        form.reset(); // Limpia el formulario si el usuario confirma
      });
    });
    
  
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button'; 
    cancelButton.className = 'btn btn-secondary mt-2'; 
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
    saveButton.type = 'submit';
    saveButton.className = 'btn btn-primary mt-2';
    saveButton.textContent = 'Guardar';

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(clearButton);
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
        return; // Detener el envío si hay campos vacíos
    }

    const formData = getFromData();
    console.log(formData);
    // Enviar los datos con fetch a tu backend
    try{ ///registro-atencion/:id_usuario/:id_registro_discapacidad
      const response = await fetch(`${serverUrl}/registro-atencion/1/${id_registro_discapacidad}`, {
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
    }
});
}
export function getFromData() {
  const formData = {
    fecha_registro: document.getElementById('fecha_registro').value === "" ? null : document.getElementById('fecha_registro').value,
    lugar_registro: document.getElementById('lugar_registro').value,
    nombre_pcd: document.getElementById('nombre_pcd').value,
    atencion_realizada: document.getElementById('atencion_realizada').value,
    area_atencion: document.getElementById('area_atencion').value,
    donacion: document.getElementById('donacion').value,
    nombre_informante: document.getElementById('nombre_informante').value,
    link_adjunto: document.getElementById('link_adjunto').value
};
return formData;
}