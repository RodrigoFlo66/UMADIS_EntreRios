import { showConfirmModal } from './ModalConfirm.js';
import { initializeTable } from './DataList.js';
// Crear el formulario y sus elementos con JavaScript
const form = document.createElement('form');
form.id = 'miForm';
form.className = 'form-container';
// Crear dos contenedores para las mitades del formulario
const leftHalf = document.createElement('div');
leftHalf.className = 'card card-body form-half';

const rightHalf = document.createElement('div');
rightHalf.className = 'card card-body bg-light form-half';

// Función para crear un contenedor de campo con título y elemento de entrada
export function createFieldContainer(title, element, required) {
    const container = document.createElement('div');
    container.className = 'form-group'; // Clase de Bootstrap para el espaciado, si estás usando Bootstrap
  
    const label = document.createElement('label');
    label.textContent = title + (required ? ' *' : ''); // Añade un asterisco para campos obligatorios
    container.appendChild(label);
  
    container.appendChild(element); // Añade el elemento de entrada al contenedor
  
    return container;
  }
  function createSelect(id, options) {
    const select = document.createElement('select');
    select.id = id;
    select.className = 'form-control';
    
    // Crear y añadir opciones al select
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      select.appendChild(optionElement);
    });
    
    return select;
  }
// Función para crear un select con opciones
export function createSelectWithLabel(id, options, title, required) {
  const select = createSelect(id, options);
  const fieldContainer = createFieldContainer(title, select, required);

  if (required) {
    const errorMessage = document.createElement('div');
      select.addEventListener('change', () => {
          if (select.value === '') {
            errorMessage.textContent = 'Este campo es obligatorio.';
            errorMessage.className = 'error-message text-danger'; // Clase de Bootstrap para el texto en rojo
            errorMessage.style.display = 'block';
            fieldContainer.appendChild(errorMessage);
              select.setCustomValidity('Por favor seleccione una opción válida.');
          } else {
              errorMessage.style.display = 'none';
              select.setCustomValidity('');
          }
      });

      // Inicialmente, aplicar la validación si el valor es vacío
      if (select.value === '') {
          select.setCustomValidity('Por favor seleccione una opción válida.');
      } else {
          errorMessage.style.display = 'none';
          select.setCustomValidity('');
      }
  }

  return fieldContainer;
}




 export function createInputWithLabel(id, type, placeholder, title, required) {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    input.className = 'form-control';
    input.required = required; // Añade el atributo required si el campo es obligatorio

    const container = createFieldContainer(title, input, required);

    if (required) {
        // Añadir un manejador de eventos para la validación
        input.addEventListener('input', function() {
            if (!this.value) {
                this.classList.add('is-invalid'); // Clase de Bootstrap para indicar error
                // Opcionalmente, puedes añadir un mensaje de error personalizado
                const error = container.querySelector('.error-message');
                if (error) {
                    error.textContent = 'Este campo es obligatorio.';
                } else {
                    const errorMessage = document.createElement('div');
                    errorMessage.textContent = 'Este campo es obligatorio.';
                    errorMessage.className = 'error-message text-danger'; // Clase de Bootstrap para el texto en rojo
                    container.appendChild(errorMessage);
                }
            } else {
                this.classList.remove('is-invalid');
                const error = container.querySelector('.error-message');
                if (error) {
                    container.removeChild(error);
                }
            }
        });
    }

    return container;
}

export function createSelectMultipleWithLabel(id, options, label, required) {
    const container = document.createElement('div');
    container.className = 'form-group';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    container.appendChild(labelElement);

    // Campo de texto para mostrar selecciones
    const displayField = document.createElement('input');
    displayField.type = 'text';
    displayField.className = 'form-control';
    displayField.id = id;
    displayField.disabled = true; // Deshabilitar edición
    container.appendChild(displayField);

    // Actualizar el campo de texto con las selecciones actuales
    const updateDisplayField = () => {
        const selectedOptions = Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
        displayField.value = selectedOptions.join(', ');
    };

    // Crear checkboxes para cada opción
    options.forEach(option => {
        const wrapper = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${id}_${option.value}`;
        checkbox.value = option.text;
        checkbox.name = id + '[]';

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = option.text;

        checkbox.addEventListener('change', updateDisplayField);

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });

    if (required) {
        displayField.required = true;
    }

    return container;
}
//DATOS PERSONALES//
const nombreCompleto = createInputWithLabel('nombre_apellido', 'text', "", "Nombres y Apellidos", true);
leftHalf.appendChild(nombreCompleto);
const fechaNacimientoInput = createInputWithLabel('fecha_nacimiento', 'date', "", "Fecha de Nacimiento", false);
leftHalf.appendChild(fechaNacimientoInput);
const edadInput = createInputWithLabel('edad', 'number', "", "Edad", false);
leftHalf.appendChild(edadInput);
const generoSelectWithLabel = createSelectWithLabel('sexo', [
    { value: '', text: 'Seleccione una opción' },
    { value: 'VARON', text: 'VARON' },
    { value: 'MUJER', text: 'MUJER' }
  ], 'Sexo', false);
  leftHalf.appendChild(generoSelectWithLabel);
const ciInput = createInputWithLabel('nro_ci', 'number', "", "Numero de CI", false);
leftHalf.appendChild(ciInput);
const estadoCivilSelectWithLabel = createSelectWithLabel('estado_civil', [
  { value: '', text: 'Seleccione una opción' },
  { value: 'SOLTERO(A)', text: 'SOLTERO(A)' },
  { value: 'CASADO(A)', text: 'CASADO(A)' },
  { value: 'DIVORCIADO(A)', text: 'DIVORCIADO(A)' },
  { value: 'VIUDO(A)', text: 'VIUDO(A)' },
  { value: 'CONCUBINATO', text: 'CONCUBINATO' },
  { value: 'SEPARADO', text: 'SEPARADO' }
], 'Estado Civil', false);
leftHalf.appendChild(estadoCivilSelectWithLabel);
const idiomaHablado = createInputWithLabel('idioma_pcd', 'text', "", "Idioma", true);
leftHalf.appendChild(idiomaHablado);
//DATOS DE DISCAPACIDAD//
const tipoDiscapacidad = createSelectWithLabel('tipo_discapacidad', [
    { value: '', text: 'Seleccione una opción' },
    { value: 'AUDITIVA', text: 'AUDITIVA' },
    { value: 'FISICA MOTORA', text: 'FISICA MOTORA' },
    { value: 'INTELECTUAL', text: 'INTELECTUAL' },
    { value: 'MULTIPLE', text: 'MULTIPLE' },
    { value: 'PSIQUICA', text: 'PSIQUICA' },
    { value: 'VISCERAL', text: 'VISCERAL' },
    { value: 'VISUAL', text: 'VISUAL' },
    { value: 'RETRASO', text: 'RETRASO' }
], 'Tipo de Discapacidad', false);
leftHalf.appendChild(tipoDiscapacidad);
const gradoDiscapacidad = createSelectWithLabel('grado_discapacidad', [
    { value: '', text: 'Seleccione una opción' },
      { value: 'LEVE', text: 'LEVE' },
      { value: 'MODERADO', text: 'MODERADO' },
      { value: 'GRAVE', text: 'GRAVE' },
      { value: 'MUY GRAVE', text: 'MUY GRAVE' }
  ], 'Grado de Discapacidad', false);
leftHalf.appendChild(gradoDiscapacidad);
const deficiencia = createInputWithLabel('deficiencia', 'text', "", "Deficiencia", false);
leftHalf.appendChild(deficiencia);
const edadInicio = createInputWithLabel('edad_inicio_discapacidad', 'number', "", "Edad incicio discapacidad", false);
leftHalf.appendChild(edadInicio);
const dispositivo = createInputWithLabel('dispositivo_utiliza', 'text', "", "Dispositivo que utiliza", false);
  leftHalf.appendChild(dispositivo);
//DATOS DE ESCOLARIDAD//
const nivelEscolaridad = createSelectWithLabel('nivel_escolaridad', [
    { value: '', text: 'Seleccione una opción' },
      { value: 'NINGUNO', text: 'NINGUNO' },
      { value: 'INICIAL', text: 'INICIAL' },
      { value: 'PRIMARIA', text: 'PRIMARIA' },
      { value: 'SECUNDARIA', text: 'SECUNDARIA' },
      { value: 'TECNICO', text: 'TECNICO' },
      { value: 'UNIVERSITARIO', text: 'UNIVERSITARIO' }
  ], 'Nivel de escolaridad', false);
  rightHalf.appendChild(nivelEscolaridad);
  const infoVivienda = createSelectWithLabel('info_vivienda', [
    { value: '', text: 'Seleccione una opción' },
      { value: 'NO TIENE VIVIENDA PROPIA', text: 'NO TIENE VIVIENDA PROPIA' },
      { value: 'VIVIENDA PROPIA CON APOYO 100%', text: 'VIVIENDA PROPIA CON APOYO 100%' },
      { value: 'VIVIENDA PROPIA CON CONTRAPARTE', text: 'VIVIENDA PROPIA CON CONTRAPARTE' }
  ], 'Informacion de vivienda', false);
  rightHalf.appendChild(infoVivienda);
  const infoLaboral = createSelectWithLabel('info_laboral', [
    { value: '', text: 'Seleccione una opción' },
      { value: 'SIN TRABAJO', text: 'SIN TRABAJO' },
      { value: 'TRABAJO POR CUENTA PROPIA', text: 'TRABAJO POR CUENTA PROPIA' },
      { value: 'TRABAJO REMUNERADO', text: 'TRABAJO REMUNERADO' }
  ], 'Informacion laboral', false);
  rightHalf.appendChild(infoLaboral);
//DATOS FAMILIARES//
const nombreFamiliar = createInputWithLabel('nombre_familiar', 'text', "", "Nombre de familiar", false);
  rightHalf.appendChild(nombreFamiliar);
  const numHijos = createInputWithLabel('nro_hijos_pcd', 'number', "", "Numero de hijos de PCD", false);
  rightHalf.appendChild(numHijos);
  const conyuge = createInputWithLabel('conyuge_pcd', 'text', "", "Conyuge de PCD", false);
  rightHalf.appendChild(conyuge);
  //DATOS DE CONTACTO//
  const direccion = createInputWithLabel('direc_domicilio', 'text', "", "Direccion de domicilio", false);
  rightHalf.appendChild(direccion);
  const distritoDomicilio = createSelectWithLabel('distrito_domicilio', [
    { value: '', text: 'Seleccione una opción' },
    { value: 'BULO BULO', text: 'BULO BULO' },
    { value: 'RIO BLANCO', text: 'RIO BLANCO' },
    { value: 'ENTRE RIOS', text: 'ENTRE RIOS' },
    { value: 'MANCO KAPAC', text: 'MANCO KAPAC' },
    { value: 'ISARZAMA', text: 'ISARZAMA' }
  ], '¿Domicilio Verificado?', false);
  rightHalf.appendChild(distritoDomicilio);
  const numCelular = createInputWithLabel('telefono_pcd', 'number', "", "Numero de Celular", false);
  rightHalf.appendChild(numCelular);
  const numCelularRef = createInputWithLabel('telefono_referencia', 'number', "", "Numero de Celular de referencia", false);
  rightHalf.appendChild(numCelularRef);
  //DATOS DE PERMANENCIA//
  const permanencia = createSelectWithLabel('permanencia', [
    { value: '', text: 'Seleccione una opción' },
      { value: 'PERMANECE', text: 'PERMANECE' },
      { value: 'CERRADO', text: 'CERRADO'}
    ], 'Permanencia actual', false);
  rightHalf.appendChild(permanencia);
  const motivoCierre = createInputWithLabel('motivo_cierre', 'text', "", "Motivo de Cierre", false);
  rightHalf.appendChild(motivoCierre);
  
  
// Añadir las mitades al formulario
form.appendChild(leftHalf);
form.appendChild(rightHalf);
function getIntValue(id) {
  const value = document.getElementById(id).value;
  return value === "" ? null : parseInt(value, 10);
}
const clearButton = document.createElement('button');
clearButton.type = 'button'; 
clearButton.className = 'btn btn-warning ml-2 visible'; 
clearButton.textContent = 'Limpiar';
clearButton.addEventListener('click', function() {
  showConfirmModal('¿Estás seguro de que deseas limpiar el formulario?', function() {
    form.reset(); // Limpia el formulario si el usuario confirma
  });
});
  
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button'; 
  cancelButton.className = 'btn btn-secondary ml-2 visible'; 
  cancelButton.textContent = 'Cancelar';
  cancelButton.addEventListener('click', function() {
    showConfirmModal('¿No se guardaran los cambios realizados. ¿Estás seguro de que deseas continuar?', function() {
      form.reset(); // Limpia el formulario si el usuario confirma
      document.getElementById('dataList').style.display = 'block';
      document.getElementById('searchInput').style.display = 'block';
      document.getElementById('filterData').style.display = 'block';
      document.getElementById('showDataList').style.display = 'block';
      document.getElementById('showProductForm').style.display = 'block';
      document.getElementById('productForm').style.display = 'none';
      document.getElementById('editData').style.display = 'none';
      
    });
  });

  const saveButton = document.createElement('button');
  saveButton.id = 'saveButton';
  saveButton.type = 'submit';
  saveButton.className = 'btn btn-primary ml-2 visible';
  saveButton.textContent = 'Guardar';
  // Crea un contenedor para los botones del formulario
  const buttonContainer = document.getElementById('buttonContainer');
  // Añade los botones al contenedor
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(clearButton);
  buttonContainer.appendChild(saveButton);
// Añade el contenedor de botones al formulario
form.appendChild(buttonContainer);
// Seleccionar el contenedor del formulario
const formContainer = document.getElementById('productForm');

formContainer.appendChild(form);
// Manejar el evento de envío del formulario
saveButton.addEventListener('click', async function(e) {
    e.preventDefault(); // Prevenir el envío por defecto
    const formData = getFromData();
    // Enviar los datos con fetch a tu backend
    try{ 
      const response = await fetch('https://server-umadis.onrender.com/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    if (response.ok) {
       // Muestra un mensaje de éxito
       form.reset();
       /*document.getElementById('dataList').style.display = 'block';
       document.getElementById('searchInput').style.display = 'block';
       document.getElementById('filterData').style.display = 'block';
       document.getElementById('showDataList').style.display = 'block';
       document.getElementById('showProductForm').style.display = 'block';
       document.getElementById('productForm').style.display = 'none';
       document.getElementById('editData').style.display = 'none';*/
       initializeTable();
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
export function getFromData() {
  const formData = {
    nombre_completo: document.getElementById('nombre_completo').value,
    ci: getIntValue('ci'),
    fecha_nacimiento: document.getElementById('fecha_nacimiento').value === "" ? null : document.getElementById('fecha_nacimiento').value,
    estado_civil: document.getElementById('estado_civil').value,
    idioma_hablado: document.getElementById('idioma_hablado').value,
    edad: getIntValue('edad'),
    genero: document.getElementById('genero').value,
    nro_carnet_discapacidad: getIntValue('nro_carnet_discapacidad'),
    fechaExp_carnet_discapacidad: document.getElementById('fechaExp_carnet_discapacidad').value === "" ? null : document.getElementById('fechaExp_carnet_discapacidad').value,
    fechaVen_carnet_discapacidad: document.getElementById('fechaVen_carnet_discapacidad').value === "" ? null : document.getElementById('fechaVen_carnet_discapacidad').value,
    direccion_domicilio: document.getElementById('direccion_domicilio').value,
    otb_domicilio: document.getElementById('otb_domicilio').value,
    distrito_domicilio: document.getElementById('distrito_domicilio').value,
    domicilio_verificado: document.getElementById('domicilio_verificado').value,
    lugar_origen: document.getElementById('lugar_origen').value,
    celular: getIntValue('celular'),
    fallecido: document.getElementById('fallecido').value,
    tipo_discapacidad: document.getElementById('tipo_discapacidad').value,
    grado_discapacidad: document.getElementById('grado_discapacidad').value,
    causa_discapacidad: document.getElementById('causa_discapacidad').value,
    beneficio_bono: document.getElementById('beneficio_bono').value,
    independiente: document.getElementById('independiente').value,
    familiar_acargo: document.getElementById('familiar_acargo').value,
    afiliado_org: document.getElementById('afiliado_org').value,
    nombre_org: document.getElementById('nombre_org').value,
    apoyo_tecnico: document.getElementById('apoyo_tecnico').value,
    nombre_apoyo: document.getElementById('nombre_apoyo').value,
    tipo_medicamento: document.getElementById('tipo_medicamento').value,
    rehabilitacion: document.getElementById('rehabilitacion').value,
    nombre_rehabilitacion: document.getElementById('nombre_rehabilitacion').value,
    nombre_seguro_salud: document.getElementById('nombre_seguro_salud').value,
    intitucion_apoyo: document.getElementById('intitucion_apoyo').value,
    grado_academico: document.getElementById('grado_academico').value,
    nivel_academico: document.getElementById('nivel_academico').value,
    estudia: document.getElementById('estudia').value,
    situacion_vivienda: document.getElementById('situacion_vivienda').value,
    generacion_ingresos: document.getElementById('generacion_ingresos').value,
    ocupacion: document.getElementById('ocupacion').value,
    trabaja: document.getElementById('trabaja').value,
    insercion_laboral: document.getElementById('insercion_laboral').value,
    fecha_registro: document.getElementById('fecha_registro').value === "" ? null : document.getElementById('fecha_registro').value,
    motivo_consulta: document.getElementById('motivo_consulta').value,
    situacion_actual: document.getElementById('situacion_actual').value,
    especificar_causa: document.getElementById('especificar_causa').value
};
return formData;
}
export function resetForm() {
  form.reset();
}