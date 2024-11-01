export function showDataModal(rowData) {
    const modalHtml = `
        <!-- Modal -->
        <div class="modal fade" id="datosModal" tabindex="-1" aria-labelledby="datosModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="datosModalLabel">Detalles del Registro</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Aquí se añadirán los detalles del registro -->
                <div class="container">
                  <div class="row" id="modal-content-row">
                    <!-- Las columnas se añadirán dinámicamente aquí -->
                  </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
            </div>
        </div>
        </div>
    `;

    // Inserta el HTML del modal en el cuerpo del documento
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Preparar el contenido del modal
    let modalContent = '';
    const titles = {
        id_registro: "ID Registro",
        nombre_completo: "Nombre Completo",
        ci: "CI",
        fecha_nacimiento: "Fecha de Nacimiento",
        estado_civil: "Estado Civil",
        idioma_hablado: "Idioma Hablado",
        edad: "Edad",
        categoria_edad: "Categoría de Edad",
        genero: "Género",
        nro_carnet_discapacidad: "Número de Carnet de Discapacidad",
        fechaexp_carnet_discapacidad: "Fecha de Expedición",
        fechaven_carnet_discapacidad: "Fecha de Vencimiento",
        direccion_domicilio: "Dirección de Domicilio",
        otb_domicilio: "OTB de Domicilio",
        distrito_domicilio: "Distrito de Domicilio",
        domicilio_verificado: "Domicilio Verificado",
        lugar_origen: "Lugar de Origen",
        celular: "Celular",
        fallecido: "Fallecido",
        tipo_discapacidad: "Tipo de Discapacidad",
        grado_discapacidad: "Grado de Discapacidad",
        causa_discapacidad: "Causa de Discapacidad",
        especificar_causa: "Causa especifica de Discapacidad",
        beneficio_bono: "Beneficio Bono",
        independiente: "Independiente",
        familiar_acargo: "Familiar a Cargo",
        afiliado_org: "Afiliado a Organización",
        nombre_org: "Nombre de la Organización",
        apoyo_tecnico: "Apoyo Técnico",
        nombre_apoyo: "Nombre del Apoyo Técnico",
        tipo_medicamento: "Tipo de Medicamento",
        rehabilitacion: "Rehabilitación",
        nombre_rehabilitacion: "Nombre de la Rehabilitación",
        nombre_seguro_salud: "Nombre del Seguro de Salud",
        intitucion_apoyo: "Institución de Apoyo",
        grado_academico: "Grado Académico",
        nivel_academico: "Nivel Académico",
        estudia: "Estudia",
        situacion_vivienda: "Situación de Vivienda",
        generacion_ingresos: "Generación de Ingresos",
        ocupacion: "Ocupación",
        trabaja: "Trabaja",
        insercion_laboral: "Inserción Laboral",
        fecha_registro: "Fecha de Registro",
        motivo_consulta: "Motivo de Consulta",
        situacion_actual: "Situación Actual"
    };
  
    let rowContent = '';
    let colCount = 0;

    Object.entries(rowData).forEach(([key, value]) => {
        if (titles[key]) { // Asegurarse de que el título exista para la clave
            // Formatear la fecha para mostrar solo 'YYYY-MM-DD'
            if (['fecha_registro', 'fecha_nacimiento', 'fechaexp_carnet_discapacidad', 'fechaven_carnet_discapacidad'].includes(key)) {
                value = new Date(value).toISOString().split('T')[0];
            }
            

            rowContent += `
                <div class="col-md-6">
                    <p><strong>${titles[key]}:</strong> ${value}</p>
                </div>
            `;
            colCount++;

            // Cada dos columnas, añadimos un nuevo row
            if (colCount % 2 === 0) {
                modalContent += `<div class="row">${rowContent}</div>`;
                rowContent = ''; // Reset row content
            }
        }
    });

    // Si hay contenido en rowContent después del bucle, añadirlo
    if (rowContent !== '') {
        modalContent += `<div class="row">${rowContent}</div>`;
    }

    // Actualizar el contenido del modal
    document.querySelector('#modal-content-row').innerHTML = modalContent;

    // Mostrar el modal
    $('#datosModal').modal('show');
}
