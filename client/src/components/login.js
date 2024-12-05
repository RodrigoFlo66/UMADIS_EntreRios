import { loadNav } from '../components/Nav.js'; 
import { initializeTable } from './DataList.js';
import { serverUrl } from '../server.config.js';

document.addEventListener('DOMContentLoaded', function() {

  const loginForm = document.getElementById('login');
  const appContent = document.getElementById('appContent');
  const loginFormContainer = document.getElementById('loginForm');

  document.body.classList.add('login-body');

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre_usuario = document.getElementById('username').value;
    const pasword = document.getElementById('password').value;

    try {
      const response = await fetch(`${serverUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre_usuario, pasword })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.nivelUsuario) {
          // Inicio de sesión exitoso
          loginFormContainer.style.display = 'none';
          appContent.style.display = 'block';
          document.getElementById('productForm').style.display = 'none'; 
          loadNav();
          initializeTable();
          //document.getElementById('footerApp').style.display = 'block';
          document.body.classList.remove('login-body');
          if(data.nivelUsuario === 'FUNCIONARIO') {
            document.getElementById('userIcon').style.display = 'none';
          }
        } else {
          throw new Error('Respuesta inesperada del servidor');
        }
      } else {
        throw new Error('Error al iniciar sesión');
      }
    } catch (error) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Error: ' + (error.message || 'No se pudo completar la solicitud.');
      messageDiv.className = 'alert alert-danger';
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
      }, 3000);
    }
  });
});
