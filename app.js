// Configuración de Rutinas
const ROUTINE = {
    1: { // LUNES
        title: "Pecho + Tríceps + Bíceps",
        exercises: [
            { id: "pecho_press_plano", name: "Press Plano Mancuernas", notes: "4 series de 6-8 reps. Reemplaza Barra.", sets: 4, rephs: "6-8" },
            { id: "pecho_press_inclinado", name: "Press Inclinado Mancuernas", notes: "3 series de 6-8 reps. Pecho superior.", sets: 3, rephs: "6-8" },
            { id: "pecho_aperturas", name: "Aperturas (Flyes) Plano", notes: "3 series de 8-10 reps. No bajar a 6.", sets: 3, rephs: "8-10" },
            { id: "triceps_press_frances", name: "Press Francés Mancuernas", notes: "3 series de 6-8 reps. Acostado, codos cerrados.", sets: 3, rephs: "6-8" },
            { id: "triceps_copa", name: "Copa a Dos Manos Sentado", notes: "3 series de 6-8 reps. Espalda apoyada.", sets: 3, rephs: "6-8" },
            { id: "biceps_curl_sentado", name: "Curl Bíceps Sentado", notes: "3 series de 6-8 reps. Sin balanceo.", sets: 3, rephs: "6-8" },
            { id: "biceps_martillo", name: "Curl Martillo", notes: "3 series de 6-8 reps. Braquial y antebrazo.", sets: 3, rephs: "6-8" }
        ]
    },
    3: { // MIÉRCOLES
        title: "Piernas (Protección Columna)",
        exercises: [
            { id: "piernas_sillon_cuad", name: "Sillón de Cuádriceps", notes: "4 series de 8 reps. Aguantá 1s arriba.", sets: 4, rephs: "8" },
            { id: "piernas_prensa_45", name: "Prensa Inclinada 45°", notes: "4 series de 6-8 reps. Pesado.", sets: 4, rephs: "6-8" },
            { id: "piernas_sillon_isquio", name: "Sillón Isquiotibiales", notes: "4 series de 6-8 reps.", sets: 4, rephs: "6-8" },
            { id: "piernas_gemelos", name: "Gemelos en Prensa", notes: "4 series de 10 reps. Mucho peso.", sets: 4, rephs: "10" }
        ]
    },
    5: { // VIERNES
        title: "Espalda + Hombros (Posterior)",
        exercises: [
            { id: "espalda_jalon", name: "Jalón al Pecho", notes: "4 series de 6-8 reps (120kg aprox).", sets: 4, rephs: "6-8" },
            { id: "espalda_serrucho", name: "Remo Serrucho", notes: "4 series de 6-8 reps. Espalda neutra.", sets: 4, rephs: "6-8" },
            { id: "hombros_militar", name: "Press Militar SENTADO", notes: "4 series de 6-8 reps. Respaldo obligatorio.", sets: 4, rephs: "6-8" },
            { id: "hombros_vuelos_lat", name: "Vuelos Laterales", notes: "4 series de 8 reps estrictas.", sets: 4, rephs: "8" },
            { id: "hombros_vuelos_post", name: "Vuelos Posteriores (Pájaros)", notes: "3 series de 8-10 reps. Pecho apoyado 45°.", sets: 3, rephs: "8-10" }
        ]
    }
};

// Estado
let currentDate = new Date();
const container = document.getElementById('exercises-container');
const dateDisplay = document.getElementById('currentDateDisplay');
const dayHeader = document.getElementById('day-header');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateDateDisplay();
    loadRoutine();

    document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
    document.getElementById('exportBtn').addEventListener('click', exportCSV);
});

function changeDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDateDisplay();
    loadRoutine();
}

function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateStr = currentDate.toLocaleDateString('es-AR', options);
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    dateDisplay.textContent = dateStr;
}

function getLocalISODate(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60000));
    return localDate.toISOString().split('T')[0];
}

function getStorageKey(date) {
    return `gym_log_${getLocalISODate(date)}`;
}

function loadRoutine() {
    container.innerHTML = '';
    const day = currentDate.getDay();
    const routine = ROUTINE[day];

    // Recuperar datos guardados
    const storageKey = getStorageKey(currentDate);
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    if (!routine) {
        dayHeader.textContent = "Día de Descanso (o cardio opcional)";
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bed" style="font-size: 3rem; margin-bottom: 20px; color: #444;"></i>
                <p>No hay rutina programada para hoy.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">¡Buen momento para recuperar energía!</p>
            </div>`;
        return;
    }

    dayHeader.textContent = routine.title;

    routine.exercises.forEach(ex => {
        const card = createExerciseCard(ex, savedData[ex.id] || {});
        container.appendChild(card);
    });
}

function createExerciseCard(exercise, savedExData) {
    const card = document.createElement('div');
    card.className = 'exercise-card';

    let setsHtml = '';
    for (let i = 1; i <= exercise.sets; i++) {
        const savedSet = savedExData[i] || {};
        const repsVal = savedSet.reps || '';
        const weightVal = savedSet.weight || '';
        const isDone = !!savedSet.done;

        setsHtml += `
            <div class="set-row">
                <span class="set-number">#${i}</span>
                <div class="input-group">
                    <input type="number" placeholder="-" 
                        value="${repsVal}" 
                        data-type="reps" 
                        data-ex="${exercise.id}" 
                        data-set="${i}"
                        onchange="saveData('${exercise.id}', ${i}, 'reps', this.value)">
                    <label>Reps</label>
                </div>
                <div class="input-group">
                    <input type="number" placeholder="-" 
                        value="${weightVal}" 
                        data-type="weight"
                        data-ex="${exercise.id}" 
                        data-set="${i}"
                        onchange="saveData('${exercise.id}', ${i}, 'weight', this.value)">
                    <label>Kg</label>
                </div>
                <button class="check-btn ${isDone ? 'completed' : ''}" 
                    onclick="toggleSet('${exercise.id}', ${i}, this)">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="exercise-header">
            <div class="exercise-name">${exercise.name}</div>
            <div class="exercise-notes">${exercise.notes}</div>
        </div>
        <div class="sets-container">
            ${setsHtml}
        </div>
    `;

    return card;
}

function saveData(exId, setIdx, field, value) {
    const storageKey = getStorageKey(currentDate);
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');

    if (!data[exId]) data[exId] = {};
    if (!data[exId][setIdx]) data[exId][setIdx] = {};

    data[exId][setIdx][field] = value;

    if (data[exId][setIdx].reps && data[exId][setIdx].weight) {
        data[exId][setIdx].done = true;
    }

    localStorage.setItem(storageKey, JSON.stringify(data));
}

function toggleSet(exId, setIdx, btn) {
    const storageKey = getStorageKey(currentDate);
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');

    if (!data[exId]) data[exId] = {};
    if (!data[exId][setIdx]) data[exId][setIdx] = {};

    const newState = !data[exId][setIdx].done;
    data[exId][setIdx].done = newState;

    localStorage.setItem(storageKey, JSON.stringify(data));

    if (newState) btn.classList.add('completed');
    else btn.classList.remove('completed');
}

function exportCSV() {
    let csvRows = [];
    const header = "Fecha,Ejercicio,Serie,Repeticiones,Peso (kg)";

    // Obtener y ordenar claves por fecha
    const keys = Object.keys(localStorage)
        .filter(k => k.startsWith('gym_log_'))
        .sort(); // Orden alfabético funciona bien con YYYY-MM-DD

    keys.forEach(key => {
        const dateStr = key.replace('gym_log_', '');
        const data = JSON.parse(localStorage.getItem(key));

        // Buscar nombres de ejercicios
        Object.keys(data).forEach(exId => {
            const sets = data[exId];
            let exName = exId; // Fallback

            // Buscar nombre real en la configuración (Rutina)
            [1, 3, 5].forEach(d => {
                const found = ROUTINE[d]?.exercises.find(e => e.id === exId);
                if (found) exName = found.name;
            });

            Object.keys(sets).forEach(setIdx => {
                const s = sets[setIdx];
                // Exportar si tiene datos o está marcado como hecho
                if (s.reps || s.weight || s.done) {
                    csvRows.push(`${dateStr},"${exName}",${setIdx},${s.reps || 0},${s.weight || 0}`);
                }
            });
        });
    });

    if (csvRows.length === 0) {
        alert("No hay datos guardados para exportar.");
        return;
    }

    const csvContent = header + "\n" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `gym_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
