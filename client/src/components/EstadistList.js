export async function exportList(data) {
    // Calcular estadísticas
    const stats = {
        genero: { MASCULINO: 0, FEMENINO: 0 },
        estudia: { SI: 0, NO: 0 },
        trabaja: { SI: 0, NO: 0 },
        grado_academico: {},
        tipo_discapacidad: {},
        grado_discapacidad: {}
    };

    data.forEach(item => {
        if (item.genero) stats.genero[item.genero] = (stats.genero[item.genero] || 0) + 1;
        if (item.estudia) stats.estudia[item.estudia] = (stats.estudia[item.estudia] || 0) + 1;
        if (item.trabaja) stats.trabaja[item.trabaja] = (stats.trabaja[item.trabaja] || 0) + 1;
        if (item.grado_academico) stats.grado_academico[item.grado_academico] = (stats.grado_academico[item.grado_academico] || 0) + 1;
        if (item.tipo_discapacidad) stats.tipo_discapacidad[item.tipo_discapacidad] = (stats.tipo_discapacidad[item.tipo_discapacidad] || 0) + 1;
        if (item.grado_discapacidad) stats.grado_discapacidad[item.grado_discapacidad] = (stats.grado_discapacidad[item.grado_discapacidad] || 0) + 1;
    });
     // Eliminar el modal existente si hay alguno
     const existingModal = document.getElementById('statsModal');
     if (existingModal) {
         existingModal.remove();
     }
    // Crear el HTML del modal
    const modalHtml = `
        <!-- Modal -->
        <div class="modal fade" id="statsModal" tabindex="-1" aria-labelledby="statsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md"> <!-- Cambiado a modal-md para un tamaño mediano -->
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="statsModalLabel">Estadísticas de los Registros</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Aquí se insertarán las estadísticas -->
                        <div class="container">
                            <div class="row" id="statsModalContentRow">
                                <!-- Las columnas se añadirán dinámicamente aquí -->
                                ${generateStatsHtml(stats)}
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

    // Insertar el HTML del modal en el cuerpo del documento    
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Mostrar el modal
    $('#statsModal').modal('show');
}

// Función para generar el HTML de las estadísticas
function generateStatsHtml(stats) {
    let html = '';

    html += '<div class="col-12"><h6>Género</h6>';
    Object.keys(stats.genero).forEach(key => {
        html += `<p>${key}: ${stats.genero[key]}</p>`;
    });
    html += '</div>';

    html += '<div class="col-12"><h6>Estudia</h6>';
    Object.keys(stats.estudia).forEach(key => {
        html += `<p>${key}: ${stats.estudia[key]}</p>`;
    });
    html += '</div>';

    html += '<div class="col-12"><h6>Trabaja</h6>';
    Object.keys(stats.trabaja).forEach(key => {
        html += `<p>${key}: ${stats.trabaja[key]}</p>`;
    });
    html += '</div>';

    html += '<div class="col-12"><h6>Grado Académico</h6>';
    Object.keys(stats.grado_academico).forEach(key => {
        html += `<p>${key}: ${stats.grado_academico[key]}</p>`;
    });
    html += '</div>';

    html += '<div class="col-12"><h6>Tipo de Discapacidad</h6>';
    Object.keys(stats.tipo_discapacidad).forEach(key => {
        html += `<p>${key}: ${stats.tipo_discapacidad[key]}</p>`;
    });
    html += '</div>';

    html += '<div class="col-12"><h6>Grado de Discapacidad</h6>';
    Object.keys(stats.grado_discapacidad).forEach(key => {
        html += `<p>${key}: ${stats.grado_discapacidad[key]}</p>`;
    });
    html += '</div>';

    return html;
}
