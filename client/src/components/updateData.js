import { getFromData, resetForm} from './dataForm.js';
import { initializeTable } from './DataList.js';
import { serverUrl } from '../server.config.js';
export async function  updateRegistro(id_registro_discapacidad) {
    console.log(id_registro_discapacidad);
    try {
    document.getElementById('editData').style.display = 'block';
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('dataList').style.display = 'none';
    document.getElementById('dataRegistro').style.display = 'none';
    document.getElementById('showProductForm').style.display = 'none';
    document.getElementById('showDataList').style.display = 'none';
    
     // Realizar la solicitud para obtener los datos del registro
     const response = await fetch(`${serverUrl}/registro-pcd/${id_registro_discapacidad}`);
     const resultResponse = await response.json();
     const data = resultResponse.data;
        console.log(data);
        // Establecer los valores en los campos del formulario
        document.getElementById('nombre_apellido').value = data.nombre_apellido || '';
        document.getElementById('fecha_nacimiento').value = data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : '';
        document.getElementById('edad').value = data.edad || '';
        document.getElementById('sexo').value = data.sexo || '';
        document.getElementById('nro_ci').value = data.nro_ci || '';
        document.getElementById('estado_civil').value = data.estado_civil || '';
        document.getElementById('idioma_pcd').value = data.idioma_pcd || '';
        document.getElementById('tipo_discapacidad').value = data.tipo_discapacidad || '';
        document.getElementById('grado_discapacidad').value = data.grado_discapacidad || '';
        document.getElementById('deficiencia').value = data.deficiencia || '';
        document.getElementById('edad_inicio_discapacidad').value = data.edad_inicio_discapacidad || '';
        document.getElementById('dispositivo_utiliza').value = data.dispositivo_utiliza || '';
        document.getElementById('nivel_escolaridad').value = data.nivel_escolaridad || '';
        document.getElementById('info_vivienda').value = data.info_vivienda || '';
        document.getElementById('info_laboral').value = data.info_laboral || '';
        document.getElementById('nombre_familiar').value = data.nombre_familiar || '';
        document.getElementById('nro_hijos_pcd').value = data.nro_hijos_pcd || '';
        document.getElementById('conyuge_pcd').value = data.conyuge_pcd || '';
        document.getElementById('direc_domicilio').value = data.direc_domicilio || '';
        document.getElementById('distrito_domicilio').value = data.distrito_domicilio || '';
        document.getElementById('telefono_pcd').value = data.telefono_pdc || '';
        document.getElementById('telefono_referencia').value = data.telefono_referencia || '';
        document.getElementById('permanencia').value = data.permanencia || '';
        document.getElementById('motivo_cierre').value = data.motivo_cierre || '';
    } catch (error) {
        console.error('Hubo un problema con la solicitud de actualización del registro:', error);
    }
    // Oculta un botón existente en el formulario por su ID.
    const existingButton = document.getElementById('saveButton'); 
    if (existingButton) {
        existingButton.classList.remove('visible');
    }
    // Accede al formulario por su ID.
    const form = document.getElementById('productForm');
    const buttonContainer = document.getElementById('buttonContainer');
    // Crea un nuevo botón si no existe
    let editButton;
    if(document.getElementById('editButtonId') === null) {
    editButton = document.createElement('button');
    editButton.id = 'editButtonId'; 
    editButton.type = 'button'; 
    editButton.className = 'btn btn-primary ml-2 visible'; 
    editButton.textContent = 'Actualizar';
    buttonContainer.appendChild(editButton);
    form.appendChild(buttonContainer);
    }else{
    editButton = document.getElementById('editButtonId');
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
            const requiredFields = document.querySelectorAll('input[required]');
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
            const response = await fetch(`${serverUrl}/registro-pcd/${id_registro_discapacidad}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
            resetForm();
            document.getElementById('dataList').style.display = 'block';
            document.getElementById('showDataList').style.display = 'block';
            document.getElementById('showProductForm').style.display = 'block';
            document.getElementById('productForm').style.display = 'none';
            document.getElementById('editData').style.display = 'none';
            document.getElementById('filterData').style.display = 'none';
            initializeTable();
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