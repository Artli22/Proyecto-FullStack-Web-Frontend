
const API_URL = 'http://localhost:8080/series';
let editingId = null;


// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('seriesForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancelButton').addEventListener('click', goBack);
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (id) {
        loadSeriesForEdit(id);
    }
});

// Cargar serie para editar
async function loadSeriesForEdit(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Error al cargar la serie');
        
        const series = await response.json();
        
        document.getElementById('name').value = series.name;
        document.getElementById('description').value = series.description;
        document.getElementById('imageUrl').value = series.image_url;
        document.getElementById('totalEpisodes').value = series.total_episodes;
        document.getElementById('currentEpisode').value = series.current_episode;
        
        editingId = id;
        document.getElementById('formTitle').textContent = `Editar: ${series.name}`;
        document.getElementById('submitButton').textContent = 'Guardar Cambios';
    } catch (error) {
        alert(`Error: ${error.message}`);
        goBack();
    }
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        image_url: document.getElementById('imageUrl').value,
        total_episodes: parseInt(document.getElementById('totalEpisodes').value),
        current_episode: parseInt(document.getElementById('currentEpisode').value)
    };

    try {
        let response;
        if (editingId) {
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        if (!response.ok) throw new Error('Error al guardar la serie');

        alert(editingId ? 'Serie actualizada correctamente' : 'Serie creada correctamente');
        window.location.href = 'index.html';
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Volver a la lista
function goBack() {
    window.location.href = 'index.html';
}
