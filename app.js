const API_URL = 'https://proyecto-full-stack-web-backend-swart.vercel.app/';
let allSeries = [];
let currentPage = 1;
let currentLimit = 10;
let currentSearch = '';
let currentSort = 'id';
let currentOrder = 'asc';

// Cargar series al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadSeries();
    document.getElementById('createButton').addEventListener('click', createNewSeries);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    document.getElementById('orderSelect').addEventListener('change', handleOrder);
    document.getElementById('limitSelect').addEventListener('change', handleLimit);
});

// Crear nueva serie
function createNewSeries() {
    window.location.href = 'editar_crear.html';
}

// Manejar búsqueda
function handleSearch(e) {
    currentSearch = e.target.value;
    currentPage = 1;
    loadSeries();
}

// Manejar ordenamiento
function handleSort(e) {
    currentSort = e.target.value;
    currentPage = 1;
    loadSeries();
}

// Manejar orden ascendente/descendente
function handleOrder(e) {
    currentOrder = e.target.value;
    currentPage = 1;
    loadSeries();
}

// Manejar cambio de límite
function handleLimit(e) {
    currentLimit = parseInt(e.target.value);
    currentPage = 1;
    loadSeries();
}

// Cargar series con parámetros
async function loadSeries() {
    try {
        let url = `${API_URL}?sort=${currentSort}&order=${currentOrder}&page=${currentPage}&limit=${currentLimit}`;
        
        if (currentSearch) {
            url += `&q=${encodeURIComponent(currentSearch)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar las series');
        
        allSeries = await response.json();
        
        displaySeries(allSeries);
        updatePaginationControls();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('seriesList').innerHTML = `<p class="error">Error al cargar las series: ${error.message}</p>`;
    }
}

// Mostrar series en la página
function displaySeries(series) {
    const seriesList = document.getElementById('seriesList');
    
    if (!series || series.length === 0) {
        seriesList.innerHTML = '<p class="empty">No hay series ingresadas.</p>';
        return;
    }

    seriesList.innerHTML = series.map(s => `
        <div class="series-card">
            <div class="series-header">
                <h3>${s.name}</h3>
            </div>
            ${s.image_url ? `<img src="${s.image_url}" alt="${s.name}" class="series-image">` : ''}
            <div class="series-content">
                <p class="description">${s.description || 'Sin descripción'}</p>
                <div class="series-info">
                    <span>Episodios: ${s.current_episode} / ${s.total_episodes}</span>
                </div>
                <div class="series-actions">
                    <button class="button-secondary" onclick="editSeries(${s.id})">Editar</button>
                    <button class="button-danger" onclick="deleteSeries(${s.id})">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Actualizar controles de paginación
function updatePaginationControls() {
    const controls = document.getElementById('paginationControls');
    
    let html = '<div class="pagination-buttons">';
    
    if (currentPage > 1) {
        html += `<button onclick="goToPage(${currentPage - 1})">← Anterior</button>`;
    }
    
    html += `<span class="page-info">Página ${currentPage}</span>`;
    
    if (allSeries.length === currentLimit) {
        html += `<button onclick="goToPage(${currentPage + 1})">Siguiente →</button>`;
    }
    
    html += '</div>';
    controls.innerHTML = html;
}

// Ir a una página específica
function goToPage(page) {
    currentPage = page;
    loadSeries();
    window.scrollTo(0, 0);
}

// Editar serie
function editSeries(id) {
    window.location.href = `editar_crear.html?id=${id}`;
}

// Eliminar serie
async function deleteSeries(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta serie?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la serie');
        
        loadSeries();
        alert('Serie eliminada correctamente');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}