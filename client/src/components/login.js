import { loadNav } from '../components/Nav.js'; 

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
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre_usuario, pasword })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.idUsuario) {
          // Inicio de sesión exitoso
          loginFormContainer.style.display = 'none';
          appContent.style.display = 'block';
          document.getElementById('productForm').style.display = 'none'; 
          loadNav();
          document.getElementById('footerApp').style.display = 'block';
          document.body.classList.remove('login-body');
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
