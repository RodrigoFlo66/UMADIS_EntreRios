export function showConfirmModal(message, onConfirm) {
  // Verifica si el modal ya existe en el DOM y elimínalo para evitar duplicados
  const existingModal = document.getElementById('confirmModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Inserta el HTML del modal
  const confirmModalHTML = `
    <!-- Modal de confirmación -->
    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmModalLabel">Confirmar acción</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" id="confirmModalBody">
              ${message}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-success" id="confirmModalButton">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', confirmModalHTML);

  const confirmButton = document.getElementById('confirmModalButton');
  confirmButton.onclick = function() {
    onConfirm();
    $('#confirmModal').modal('hide');
  };

  $('#confirmModal').modal('show');
}
