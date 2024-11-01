import { searchRecords} from './DataList.js';
//import { showFilterModal, exportData } from './FilterModal.js';
import { exportList } from './EstadistList.js';
export function loadNav() {
  
  const navHtml = `
  <nav class="navbar navbar-expand-md navbar-dark bg-primary fixed-top" id="navApp">
    <a class="navbar-brand" href="#" id="showDataList"><i class="fas fa-home"></i> INICIO</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" id="showProductForm">Añadir Registro</a>
        </li>
        <li class="nav-item"> 
          <a class="nav-link" href="#" id="filterData">Filtrar Datos</a>
        </li>
        <li class="nav-item"> 
          <a class="nav-link" href="#" id="exportData">Estadistica</a>
        </li>
        <li class="nav-item"> 
          <a class="nav-link" href="#" id="editData">Editando Registro</a>
        </li>
      </ul>
      <form class="form-inline ml-auto">
        <input class="form-control mr-sm-2" type="search" placeholder="Buscar" aria-label="Buscar" id="searchInput">
      </form>
    </div>
  </nav>
`;

  const body = document.querySelector('body');
  body.insertAdjacentHTML('afterbegin', navHtml);
  document.getElementById('editData').style.display = 'none';
  document.getElementById('exportData').style.display = 'none';

  document.getElementById('showProductForm').addEventListener('click', function() {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('dataList').style.display = 'none';
    /*document.getElementById('exportData').style.display = 'none';
    document.getElementById('searchInput').style.display = 'none';
    document.getElementById('filterData').style.display = 'none';
    document.getElementById('showDataList').style.display = 'none';*/
    const existingButton = document.getElementById('editButtonId'); 
    const saveButton = document.getElementById('saveButton');

    if (existingButton) {
        existingButton.classList.remove('visible');
        saveButton.classList.add('visible');
    }
  });

  document.getElementById('showDataList').addEventListener('click', function() {
    document.getElementById('dataList').style.display = 'block';
    document.getElementById('productForm').style.display = 'none';
    document.getElementById('exportData').style.display = 'none';
    //loadData(1, false);
  });

  // Añadir evento de búsqueda
  document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    searchRecords(query);
  });
  document.getElementById('filterData').addEventListener('click', function() {
    showFilterModal(); // Esta función mostrará el modal de filtrado
  });
  document.getElementById('exportData').addEventListener('click', function() {
    let data = exportData();
    exportList(data) // Esta función mostrará el modal de filtrado
  });
}


