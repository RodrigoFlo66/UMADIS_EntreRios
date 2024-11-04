import { serverUrl, id_municipio } from '../server.config.js';
import { showConfirmModal } from './ModalConfirm.js';

export async function showUserModal() {
    
    const modalHtml = `
        <!-- Modal -->
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userModalLabel">Administración de Usuarios</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container" id="user-list">
                            <!-- Los usuarios se cargarán aquí dinámicamente -->
                        </div>
                        <button class="btn btn-success mt-3" id="add-user-btn">Añadir Usuario</button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const userContainer = document.querySelector('#user-list');
    const addButton = document.getElementById('add-user-btn');
    async function loadUsers() {
        const response = await fetch(`${serverUrl}/usuarios/${id_municipio}`);
        const usersData = await response.json();
        const users = usersData.data;
    
        userContainer.innerHTML = '';  // Limpia el contenedor antes de agregar los usuarios
    
        users.forEach(user => {
            createUserRow(user, userContainer);  // Crea una fila para cada usuario
        });
    }
        // Limpia el contenedor cada vez que se abre el modal
        $('#userModal').on('shown.bs.modal', function () {
            loadUsers();
            addButton.disabled = false;    // Asegura que el botón esté habilitado
        });
    // Registra el evento `click` para añadir usuario solo una vez al cargar la página
    addButton.addEventListener('click', () => addUserRow(userContainer));

// Función para añadir una nueva fila de usuario editable
function addUserRow(container) {
    const addButton = document.getElementById('add-user-btn');
    addButton.disabled = true; // Deshabilita el botón al hacer clic
    const newUserId = `new-${Date.now()}`;  // Genera un ID temporal
    console.log(newUserId);

    const newRow = document.createElement('div');
    newRow.className = 'row user-item mb-3';
    newRow.id = `user-${newUserId}`;

    newRow.innerHTML = `
        <div class="col-sm-6 col-12 mb-3">
            <label>Nombre de Usuario:</label>
            <input type="text" class="form-control" id="username-${newUserId}" required>
        </div>
        <div class="col-md-3">
            <label>Contraseña:</label>
            <input type="password" class="form-control" id="password-${newUserId}" required>
        </div>
        <div class="col-md-3">
            <label>Nivel de Usuario:</label>
            <select class="form-control" id="user-level-${newUserId}">
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="FUNCIONARIO">FUNCIONARIO</option>
            </select>
        </div>
        <div class="col-md-3 d-flex align-items-center">
            <button class="btn btn-success mr-2" id="save-btn-${newUserId}">Guardar</button>
            <button class="btn btn-danger" id="cancel-btn-${newUserId}">Cancelar</button>
        </div>
    `;
    container.innerHTML = '';  // Limpia el contenedor antes de agregar la nueva fila
    container.appendChild(newRow);

    document.getElementById(`save-btn-${newUserId}`).addEventListener('click', () => {
        saveNewUser(newUserId);
        newRow.remove(); // Elimina la fila temporal
        const addButton = document.getElementById('add-user-btn');
    addButton.disabled = false;  // Habilita el botón de añadir
        $('#userModal').modal('hide');
    });
    document.getElementById(`cancel-btn-${newUserId}`).addEventListener('click', () => {
        const addButton = document.getElementById('add-user-btn');
    addButton.disabled = false;  // Habilita el botón de añadir
    loadUsers();
    newRow.remove();  // Elimina la fila temporal
    });
}

    $('#userModal').modal('show');
}

// Función para crear una fila de usuario con los datos proporcionados
function createUserRow(user, container) {
    const userRow = document.createElement('div');
    userRow.className = 'row user-item mb-3';
    userRow.id = `user-${user.id_usuario}`;

    userRow.innerHTML = `
        <div class="row user-item mb-3">
    <div class="col-sm-6 col-12 mb-3">
        <label>Nombre de Usuario:</label>
        <input type="text" class="form-control" value="${user.nombre_usuario}" disabled id="username-${user.id_usuario}">
    </div>
    <div class="col-sm-6 col-12 mb-3">
        <label>Contraseña:</label>
        <input type="password" class="form-control" value="${user.pasword}" disabled id="password-${user.id_usuario}">
    </div>
    <div class="col-sm-6 col-12 mb-3">
        <label>Nivel de Usuario:</label>
        <select class="form-control" disabled id="user-level-${user.id_usuario}">
            <option value="ADMINISTRADOR" ${user.nivel_usuario === "ADMINISTRADOR" ? "selected" : ""}>ADMINISTRADOR</option>
            <option value="FUNCIONARIO" ${user.nivel_usuario === "FUNCIONARIO" ? "selected" : ""}>FUNCIONARIO</option>
        </select>
    </div>
    <div class="col-sm-6 col-12 d-flex align-items-center mb-3">
        <button class="btn btn-primary mr-2" id="edit-btn-${user.id_usuario}">Editar</button>
        <button class="btn btn-danger" id="delete-btn-${user.id_usuario}">Eliminar</button>
    </div>
</div>

    `;

    container.appendChild(userRow);

    document.getElementById(`edit-btn-${user.id_usuario}`).addEventListener('click', () => {
        const editButton = document.getElementById(`edit-btn-${user.id_usuario}`);
        if (editButton.textContent === "Guardar") {
            editUsuario(user.id_usuario);
        }else{
            toggleEdit(user.id_usuario);
        }
    }   
    );
    document.getElementById(`delete-btn-${user.id_usuario}`).addEventListener('click', () => deleteUser(user.id_usuario));
}



// Función para guardar un nuevo usuario en el servidor
async function saveNewUser(newUserId) {
    
    const username = document.getElementById(`username-${newUserId}`).value;
    const password = document.getElementById(`password-${newUserId}`).value;
    const userLevel = document.getElementById(`user-level-${newUserId}`).value;

    const newUser = { nombre_usuario: username, pasword: password, nivel_usuario: userLevel };

    // Envía los datos al servidor
    const response = await fetch(`${serverUrl}/usuario/${id_municipio}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    if (response.ok) {
        const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Usuario añadido con éxito.';
      messageDiv.className = 'alert alert-success';
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
      }, 3000);
        const createdUser = await response.json();
        const userContainer = document.querySelector('#user-list');
        //document.getElementById(`user-${newUserId}`).remove();  // Elimina la fila temporal
    } else {
        const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Error al añadir el usuario.';
      messageDiv.className = 'alert alert-danger';
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
      }, 3000);
    }
}

// Función para alternar entre los estados de edición
function toggleEdit(id_usuario) {
    const usernameField = document.getElementById(`username-${id_usuario}`);
    const passwordField = document.getElementById(`password-${id_usuario}`);
    const userLevelField = document.getElementById(`user-level-${id_usuario}`);
    const editButton = document.getElementById(`edit-btn-${id_usuario}`);

    const isEditing = !usernameField.disabled;
    
    // Alternar habilitación de los campos
    usernameField.disabled = isEditing;
    passwordField.disabled = isEditing;
    userLevelField.disabled = isEditing;

    // Cambiar el texto del botón según el estado
    editButton.textContent = isEditing ? "Editar" : "Guardar";
}
function editUsuario(id_usuario) {
    const usernameField = document.getElementById(`username-${id_usuario}`);
    const passwordField = document.getElementById(`password-${id_usuario}`);
    const userLevelField = document.getElementById(`user-level-${id_usuario}`);
    

    const isEditing = !usernameField.disabled;
    
    // Alternar habilitación de los campos
    usernameField.disabled = isEditing;
    passwordField.disabled = isEditing;
    userLevelField.disabled = isEditing;
        // Si está guardando, recoger los datos actualizados
        const updatedData = {
            nombre_usuario: usernameField.value,
            pasword: passwordField.value,
            nivel_usuario: userLevelField.value
        };
        
        // Realizar la solicitud PUT
        fetch(`${serverUrl}/usuario/${id_usuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            // Mostrar mensaje de éxito
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Datos de usuario editado correctamente.';
            messageDiv.className = 'alert alert-success';
            messageDiv.style.display = 'block';
            $('#userModal').modal('hide');
            setTimeout(() => {
              messageDiv.textContent = '';
              messageDiv.className = '';
            }, 3000);
          })
          .catch(error => {
              // Mostrar mensaje de error
              const messageDiv = document.getElementById('message');
              messageDiv.textContent = 'Error al editar el usuario.';
              messageDiv.className = 'alert alert-danger';
              messageDiv.style.display = 'block';
              setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = '';
              }, 3000);
          });
}

async function deleteUser(id_usuario) {
    showConfirmModal('¿Estás seguro de que deseas eliminar a este usuario?', function() {
        const url = `${serverUrl}/usuario/${id_usuario}`;
        fetch(url, {
            method: 'DELETE'
        })
        .then(response => {
          // Mostrar mensaje de éxito
          const messageDiv = document.getElementById('message');
          messageDiv.textContent = 'Usuario eliminado correctamente.';
          messageDiv.className = 'alert alert-success';
          messageDiv.style.display = 'block';
          console.log(id_usuario);
          //document.getElementById(`user-${id_usuario}`).remove(); //elimina la fila del usuario
          $('#userModal').modal('hide');
          setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
          }, 3000);
        })
        .catch(error => {
            // Mostrar mensaje de error
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Error al eliminar el usuario.';
            messageDiv.className = 'alert alert-danger';
            messageDiv.style.display = 'block';
            setTimeout(() => {
              messageDiv.textContent = '';
              messageDiv.className = '';
            }, 3000);
        });
      });
}
