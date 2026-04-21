const API_URL = 'http://localhost:8080/series';

// Cargar series al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadSeries();
    document.getElementById('createButton').addEventListener('click', createNewSeries);
});

// Crear nueva serie
function createNewSeries() {
    window.location.href = 'editar_crear.html';
}

// Cargar todas las series
async function loadSeries() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar las series');
        
        const series = await response.json();
        displaySeries(series || []);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('seriesList').innerHTML = `<p>Error al cargar las series: ${error.message}</p>`;
    }
}

// Mostrar series en la página
function displaySeries(series) {
    const seriesList = document.getElementById('seriesList');
    
    if (!series || series.length === 0) {
        seriesList.innerHTML = '<p>No hay series ingresadas.</p>';
        return;
    }

    seriesList.innerHTML = series.map(s => `
        <div>
            <div>
                <h3>${s.name}</h3>
            </div>
            ${s.image_url ? `<img src="${s.image_url}" alt="${s.name}">` : ''}
            <div>
                <p>${s.description || 'Sin descripción'}</p>
                <div>
                    <span>Episodios: ${s.current_episode} / ${s.total_episodes}</span>
                </div>
                <div>
                    <button onclick="editSeries(${s.id})">Editar</button>
                    <button onclick="deleteSeries(${s.id})">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
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