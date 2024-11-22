//import { showFilterModal, exportData } from './FilterModal.js';
import { exportList } from './EstadistList.js';
import {showUserModal} from "./modalUsuario.js";
import { tablaFuncionario } from './reporteFuncionario.js';

export function loadNav() {
  
  const navHtml = `
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top" id="navApp">
    <a class="navbar-brand ms-3" href="#" id="showDataList"><i class="fas fa-home"></i> INICIO</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" id="showProductForm">Añadir Registro</a>
        </li>
        <li class="nav-item"> 
          <a class="nav-link" href="#" id="ReporteFuncionario">Reporte de Funcionario</a>
        </li>
        <li class="nav-item"> 
          <a class="nav-link" href="#" id="estadistica">Estadisticas</a>
        </li>
        <li class="nav-item"> 
          <a class="nav-link" href="#" id="editData">Editando Registro</a>
        </li>
        <li class="nav-item"> 
          <a class="nav-link" href="#" id="atrasHistoricoPaciente">
            <i class="fas fa-arrow-left"></i> Atras
          </a>
        </li>
      </ul>
      <!-- Contenedor del ícono de usuario, alineado a la derecha -->
      <div class="ms-auto me-3">
          <a href="#" id="userIcon" class="btn btn-outline-secondary">
              <i class="fas fa-user"></i>
          </a>
      </div>
    </div>
  </nav>
`;

  const body = document.querySelector('body');
  body.insertAdjacentHTML('afterbegin', navHtml);
  document.getElementById('editData').style.display = 'none';
  document.getElementById('atrasHistoricoPaciente').style.display = 'none';

  document.getElementById('showProductForm').addEventListener('click', function() {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('dataList').style.display = 'none';
    document.getElementById('ReporteFuncionario').style.display = 'none';
    document.getElementById('customFilters').style.display = 'none';
    document.getElementById('listaFuncionario').style.display = 'none';
    document.getElementById('showDataList').style.display = 'none';
    document.getElementById('listaEstadistica').style.display = 'none';
    document.getElementById('estadistica').style.display = 'none';
    const existingButton = document.getElementById('editButtonId'); 
    const saveButton = document.getElementById('saveButton');

    if (existingButton) {
        existingButton.classList.remove('visible');
        saveButton.classList.add('visible');
    }
  });

  document.getElementById('showDataList').addEventListener('click', function() {
    document.getElementById('dataList').style.display = 'block';
    document.getElementById('showProductForm').style.display = 'block';
    document.getElementById('customFilters').style.display = 'block';
    document.getElementById('productForm').style.display = 'none';
    document.getElementById('dataRegistro').style.display = 'none';
    document.getElementById('ReporteFuncionario').style.display = 'block';
    document.getElementById('atrasHistoricoPaciente').style.display = 'none';
    document.getElementById('listaFuncionario').style.display = 'none';
    document.getElementById('listaEstadistica').style.display = 'none';
    document.getElementById('estadistica').style.display = 'block';
    //loadData(1, false);
  });

  
  document.getElementById('estadistica').addEventListener('click', function() {
    document.getElementById('dataList').style.display = 'none';
    document.getElementById('customFilters').style.display = 'none';
    document.getElementById('listaFuncionario').style.display = 'none';
    exportList(); // Esta función mostrará el modal de filtrado
  });

  document.getElementById('userIcon').addEventListener('click', function() {
    showUserModal();
  });
  document.getElementById('atrasHistoricoPaciente').addEventListener('click', function() {
    document.getElementById('dataRegistro').style.display = 'block';
    document.getElementById('showDataList').style.display = 'block';
    document.getElementById('atrasHistoricoPaciente').style.display = 'none';
    document.getElementById('listaAntencion').style.display = 'none';
});
  document.getElementById('ReporteFuncionario').addEventListener('click', function() {
    document.getElementById('dataList').style.display = 'none';
    document.getElementById('customFilters').style.display = 'none';
    document.getElementById('listaEstadistica').style.display = 'none';
    tablaFuncionario();
  });
}


