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
let currentRoutine = {};
let isEditMode = false;

function initRoutine() {
    document.getElementById('connectionStatus').innerText = "JS v8.0 Cargado OK";
    const saved = localStorage.getItem('gym_custom_routine');
    if (saved) {
        currentRoutine = JSON.parse(saved);
    } else {
        for (let i = 0; i <= 6; i++) {
            if (ROUTINE[i]) {
                currentRoutine[i] = JSON.parse(JSON.stringify(ROUTINE[i]));
            } else {
                const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                currentRoutine[i] = { title: days[i], exercises: [] };
            }
        }
        localStorage.setItem('gym_custom_routine', JSON.stringify(currentRoutine));
    }
}

function saveCurrentRoutine() {
    localStorage.setItem('gym_custom_routine', JSON.stringify(currentRoutine));
    loadRoutine();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initRoutine();
    updateDateDisplay();
    loadRoutine();

    document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
    document.getElementById('exportBtn').addEventListener('click', exportCSV);

    document.getElementById('addExerciseBtn').addEventListener('click', showAddExerciseModal);
    document.getElementById('cancelAddEx').addEventListener('click', hideAddExerciseModal);
    document.getElementById('confirmAddEx').addEventListener('click', confirmAddExercise);
    document.getElementById('toggleEditModeBtn').addEventListener('click', toggleEditMode);
    document.getElementById('importFile').addEventListener('change', importCSV);
    if(typeof initTimer === 'function') initTimer();
});

function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('edit-mode-active', isEditMode);

    const btn = document.getElementById('toggleEditModeBtn');
    if (isEditMode) {
        btn.innerHTML = '<i class="fas fa-lock"></i> Finalizar Configuración';
        btn.style.color = 'var(--danger-color)';
        btn.style.borderColor = 'var(--danger-color)';
    } else {
        btn.innerHTML = '<i class="fas fa-unlock"></i> Configurar Rutina';
        btn.style.color = '';
        btn.style.borderColor = '';
    }

    // Toggle Import Button
    document.getElementById('importContainer').style.display = isEditMode ? 'block' : 'none';
}

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
    const routine = currentRoutine[day];

    // Recuperar datos guardados
    const storageKey = getStorageKey(currentDate);
    const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    if (!routine || !routine.exercises || routine.exercises.length === 0) {
        dayHeader.textContent = routine ? routine.title : "Día de Descanso";
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dumbbell" style="font-size: 3rem; margin-bottom: 20px; color: #444;"></i>
                <p>No hay ejercicios programados para hoy.</p>
            </div>`;
        return;
    }

    dayHeader.textContent = routine.title;

    routine.exercises.forEach((ex, idx) => {
        const card = createExerciseCard(ex, savedData[ex.id] || {}, day, idx);
        container.appendChild(card);
    });
}

function createExerciseCard(exercise, savedExData, dayIndex, exIndex) {
    const card = document.createElement('div');
    card.className = 'exercise-card';

    // Obtener datos de la sesión anterior
    const lastSessionData = getLastSessionData(exercise.id);
    const sessionNote = savedExData.note || '';

    let setsHtml = '';
    for (let i = 1; i <= exercise.sets; i++) {
        const savedSet = savedExData[i] || {};
        const repsVal = savedSet.reps || '';
        const weightVal = savedSet.weight || '';
        const timeVal = savedSet.time || '';
        const isDone = !!savedSet.done;

        // Datos históricos para esta serie (o general si no hay por serie)
        // Intentamos buscar por número de serie, si no, mostramos el último registrado.
        // Pero para simplificar y ser útil, buscamos si hubo un set i en la sesión anterior.
        let historyText = '';
        if (lastSessionData && lastSessionData[i]) {
            const prev = lastSessionData[i];
            if (prev.weight || prev.reps || prev.time) {
                let textElements = [];
                if (prev.weight) textElements.push(`${prev.weight}kg`);
                if (prev.reps) textElements.push(`${prev.reps} reps`);
                if (prev.time) textElements.push(`${prev.time}s`);

                historyText = `<div class="history-info" title="Sesión anterior: ${lastSessionData.date}">
                                <i class="fas fa-history"></i> ${textElements.join(' - ')}
                               </div>`;
            }
        }

        setsHtml += `
            <div class="set-row ${exercise.hasTime ? 'has-time' : ''}">
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
                ${exercise.hasTime ? `
                <div class="input-group">
                    <input type="number" placeholder="-" 
                        value="${timeVal}" 
                        data-type="time"
                        data-ex="${exercise.id}" 
                        data-set="${i}"
                        onchange="saveData('${exercise.id}', ${i}, 'time', this.value)">
                    <label>Tiempo</label>
                </div>` : ''}
                <button class="check-btn ${isDone ? 'completed' : ''}" 
                    onclick="toggleSet('${exercise.id}', ${i}, this)">
                    <i class="fas fa-check"></i>
                </button>
            </div>
            ${historyText}
        `;
    }

    card.innerHTML = `
        <div class="exercise-header">
            <div class="exercise-header-top">
                <div class="exercise-name">${exercise.name}</div>
                <button class="delete-ex-btn" title="Eliminar Ejercicio" onclick="deleteExercise(${dayIndex}, ${exIndex})"><i class="fas fa-trash"></i></button>
            </div>
            ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
            ${lastSessionData ? `<div class="last-session-date">Ult. vez: ${lastSessionData.date}</div>` : ''}
            <div class="input-group session-note-group">
                <i class="fas fa-pen"></i>
                <input type="text" placeholder="Añadir nota para hoy (ej. molestias)..." 
                    value="${sessionNote}" 
                    onchange="saveSessionNote('${exercise.id}', this.value)">
            </div>
        </div>
        <div class="sets-controls">
            <button class="sets-btn" onclick="changeSets(${dayIndex}, ${exIndex}, -1)"><i class="fas fa-minus"></i></button>
            <span class="sets-label">${exercise.sets} Series</span>
            <button class="sets-btn" onclick="changeSets(${dayIndex}, ${exIndex}, 1)"><i class="fas fa-plus"></i></button>
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

    if (data[exId][setIdx].reps || data[exId][setIdx].weight || data[exId][setIdx].time) {
        data[exId][setIdx].done = true;
    }

    localStorage.setItem(storageKey, JSON.stringify(data));
}

function saveSessionNote(exId, value) {
    const storageKey = getStorageKey(currentDate);
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (!data[exId]) data[exId] = {};
    data[exId].note = value;
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
    const header = "Fecha,Ejercicio,Serie,Repeticiones,Peso (kg),Tiempo (s),Notas";

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

            // Buscar nombre real en la configuración actual o en la original
            [0, 1, 2, 3, 4, 5, 6].forEach(d => {
                const foundInCurrent = currentRoutine[d]?.exercises?.find(e => e.id === exId);
                const foundInOriginal = ROUTINE[d] ? ROUTINE[d].exercises?.find(e => e.id === exId) : null;
                if (foundInCurrent) exName = foundInCurrent.name;
                else if (foundInOriginal && exName === exId) exName = foundInOriginal.name;
            });

            Object.keys(sets).forEach(setIdx => {
                if (setIdx === 'note' || setIdx === 'done') return;
                const s = sets[setIdx];
                const noteStr = sets.note ? sets.note.replace(/"/g, '""') : '';
                // Exportar si tiene datos o está marcado como hecho
                if (s.reps || s.weight || s.time || s.done) {
                    csvRows.push(`${dateStr},"${exName}",${setIdx},${s.reps || 0},${s.weight || 0},${s.time || 0},"${noteStr}"`);
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

function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const lines = text.split('\n');

        // Verifica que tenga la cabecera correcta o al menos datos
        if (lines.length < 2) {
            alert('El archivo no parece ser un CSV válido o está vacío.');
            return;
        }

        let importedCount = 0;

        // Comenzar desde 1 para saltear la cabecera "Fecha,Ejercicio,Serie,Repeticiones,Peso (kg)"
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Manejar comillas en caso de nombres de ejercicios con comas
            // Un split simple por coma falla si el ejercicio se llama "Prensa, 45"
            // Expresión regular para parsear CSV básico:
            const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
            let matches = line.match(regex);

            if (!matches) {
                // Fallback a split simple si la regex falla
                matches = line.split(',');
            }

            // Limpiar comillas de los valores
            matches = matches.map(m => m.replace(/^"|"$/g, ''));

            if (matches.length >= 5) {
                const dateStr = matches[0];
                const exName = matches[1];
                const setIdx = parseInt(matches[2]);
                const reps = parseInt(matches[3]);
                const weight = parseFloat(matches[4]);
                const time = matches.length >= 6 ? parseInt(matches[5]) : 0;
                const note = matches.length >= 7 ? matches[6] : '';

                // Necesitamos el ID del ejercicio. Como el CSV solo exporta el nombre,  
                // debemos buscar a qué ID corresponde ese nombre en la configuración.
                let exId = null;
                [0, 1, 2, 3, 4, 5, 6].forEach(d => {
                    const found = currentRoutine[d]?.exercises?.find(ex => ex.name === exName);
                    if (found) exId = found.id;
                });

                // Si no lo encontramos en la rutina actual (quizás lo borró), intentemos buscar en la original
                if (!exId) {
                    [1, 3, 5].forEach(d => {
                        const found = ROUTINE[d]?.exercises?.find(ex => ex.name === exName);
                        if (found) exId = found.id;
                    });
                }

                // Si definitivamente no existe el ID, creamos un ID genérico basado en el nombre
                if (!exId) {
                    exId = exName.toLowerCase().replace(/[^a-z0-9]/g, '_');
                }

                const storageKey = `gym_log_${dateStr}`;
                const data = JSON.parse(localStorage.getItem(storageKey) || '{}');

                if (!data[exId]) data[exId] = {};
                if (!data[exId][setIdx]) data[exId][setIdx] = {};

                // Solo sobreescribir si NO hay datos previamente cargados (para no duplicar o borrar progreso actual en caso de conflicto)
                // Opcional: Podríamos sobreescribir siempre, pero para más seguridad y "no duplicar/pisar" información:
                const existing = data[exId][setIdx] || {};
                if (!existing.reps && !existing.weight && !existing.time && !existing.done) {
                    data[exId][setIdx] = {
                        reps: reps || '',
                        weight: weight || '',
                        time: time || '',
                        done: (reps > 0 || weight > 0 || time > 0)
                    };
                    if (note) data[exId].note = note;
                    localStorage.setItem(storageKey, JSON.stringify(data));
                    importedCount++;
                }
            }
        }

        alert(`¡Importación finalizada! Se restauraron o añadieron ${importedCount} series al historial.`);
        event.target.value = ''; // Reset input
        loadRoutine(); // Recargar UI por si afectó al día de hoy
    };

    reader.onerror = function () {
        alert('Error al leer el archivo.');
    };

    reader.readAsText(file);
}

function getLastSessionData(exerciseId) {
    // Utilizamos currentDate (el día seleccionado en pantalla) en lugar del día real
    const today = new Date(currentDate);
    // Normalizamos para comparaciones correctas
    today.setHours(0, 0, 0, 0);

    const keys = Object.keys(localStorage)
        .filter(k => k.startsWith('gym_log_'));

    const history = [];
    keys.forEach(key => {
        const dateStr = key.replace('gym_log_', '');
        const parts = dateStr.split('-');
        // Crear fecha local correctamente (año, mes base 0, dia)
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        history.push({ date: date, key: key, dateStr: dateStr });
    });

    // 1. Filtrar sesiones anteriores a hoy
    // NO filtramos por día de la semana primero, para poder hacer fallback
    // Queremos buscar:
    // a) La última vez que hice este ejercicio un día igual a hoy (ej. Miércoles pasado)
    // b) Si no hay, la última vez que hice este ejercicio CUALQUIER día.

    // CORRECCIÓN SEGÚN REQUERIMIENTO: "Es importante que NO pierda la informacion que ya tengo registrada. La idea es tener esa referencia... En el supuesto caso de que el valor de la semana anterior no este disponible... debe traer el primer valor inmediatamente anterior."

    // Vamos a buscar TODAS las sesiones anteriores ordenadas por fecha descendente
    const pastSessions = history
        .filter(h => h.date < today)
        .sort((a, b) => b.date - a.date);

    // Estrategia:
    // 1. Buscar coincidencias exactas de día de la semana (prioridad 1)
    const currentDayOfWeek = today.getDay();

    // Buscamos en orden descendente una sesión del MISMO día de la semana que tenga datos para este ejercicio
    for (const session of pastSessions) {
        if (session.date.getDay() === currentDayOfWeek) {
            const data = JSON.parse(localStorage.getItem(session.key) || '{}');
            if (data[exerciseId]) {
                const exData = data[exerciseId];
                // Verificar que tenga algo relevante (algún peso o rep)
                const hasContent = Object.values(exData).some(s => s.weight || s.reps || s.time);
                if (hasContent) {
                    return { date: session.dateStr, ...exData };
                }
            }
        }
    }

    // Si llegamos acá, no encontramos entrenamiento de este ejercicio en el mismo día de la semana (ej. nunca entrené un miércoles antes, o salté muchos miércoles).V
    // El requerimiento dice: "debe traer el primer valor inmediatamente anterior".
    // Esto podría interpretarse como CUALQUIER sesión anterior de este ejercicio, o seguir buscando semanas atrás.
    // Mi lógica de "validSessions" arriba ya recorre TODA la historia hacia atrás buscando el mismo día.
    // Si no encontró nada, ¿buscamos el último registro GLOBAL de ese ejercicio?
    // Ejemplo: Hoy es Miércoles (Pierna). El Miércoles pasado no fui. El anterior tampoco.
    // El loop de arriba ya cubrió "dos semanas atrás" y "tres semanas atrás", siempre que sea Miércoles.

    // Si NUNCA hice piernas un miércoles (quizás antes iba los jueves), ¿debería mostrar lo del jueves?
    // El prompt dice: "Ejemplo: un miercoles, los valores para cada ejercicio del miercoles anterior... En el supuesto caso... debe traer el primer valor inmediagamente anterior."
    // Asumiré que se refiere al historial cronológico puro si no hay coincidencia de día, O simplemente que siga buscando atrás en el tiempo (lo cual ya hace el loop).

    // Vamos a agregar un fallback: Si no hay match de día de semana, mostrar la ÚLTIMA vez que se hizo el ejercicio, sea el día que sea.
    // Esto es útil si cambié mi rutina de días.

    for (const session of pastSessions) {
        // Ya buscamos por día de semana arriba, ahora buscamos cualquiera
        // Pero para no repetir, solo buscamos si NO es el mismo día (aunque si fuera el mismo día ya lo hubiéramos encontrado arriba, así que da igual)
        if (session.date.getDay() !== currentDayOfWeek) {
            const data = JSON.parse(localStorage.getItem(session.key) || '{}');
            if (data[exerciseId]) {
                const exData = data[exerciseId];
                const hasContent = Object.values(exData).some(s => s.weight || s.reps || s.time);
                if (hasContent) {
                    return { date: session.dateStr + ' (' + getDayName(session.date.getDay()) + ')', ...exData };
                }
            }
        }
    }

    return null;
}

function getDayName(dayIndex) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[dayIndex];
}

// Lógica de Edición de Rutinas
function deleteExercise(dayIndex, exIndex) {
    if (confirm("¿Seguro que deseas eliminar este ejercicio de la rutina del día?")) {
        currentRoutine[dayIndex].exercises.splice(exIndex, 1);
        saveCurrentRoutine();
    }
}

function changeSets(dayIndex, exIndex, delta) {
    const ex = currentRoutine[dayIndex].exercises[exIndex];
    if (ex.sets + delta >= 1) {
        ex.sets += delta;
        saveCurrentRoutine();
    }
}

function showAddExerciseModal() {
    document.getElementById('newExName').value = '';
    document.getElementById('newExNotes').value = '';
    document.getElementById('newExSets').value = '4';
    document.getElementById('newExHasTime').checked = false;
    document.getElementById('addExerciseModal').style.display = 'flex';
}

function hideAddExerciseModal() {
    document.getElementById('addExerciseModal').style.display = 'none';
}

function confirmAddExercise() {
    const name = document.getElementById('newExName').value.trim();
    const notes = document.getElementById('newExNotes').value.trim();
    const sets = parseInt(document.getElementById('newExSets').value) || 4;
    const hasTime = document.getElementById('newExHasTime').checked;

    if (!name) {
        alert("El nombre del ejercicio es obligatorio.");
        return;
    }

    const day = currentDate.getDay();
    const newId = 'custom_' + Date.now();

    if (!currentRoutine[day].exercises) {
        currentRoutine[day].exercises = [];
    }

    currentRoutine[day].exercises.push({
        id: newId,
        name: name,
        notes: notes,
        sets: sets,
        rephs: "-",
        hasTime: hasTime
    });

    saveCurrentRoutine();
    hideAddExerciseModal();
}

// Lógica de Temporizador
let timerInterval;
let timerTime = 120; // 2 minutes in seconds
let isTimerRunning = false;

function initTimer() {
    const timerFabBtn = document.getElementById('timerFabBtn');
    const timerPanel = document.getElementById('timerPanel');
    const closeTimerBtn = document.getElementById('closeTimerBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerSubBtn = document.getElementById('timerSubBtn');
    const timerAddBtn = document.getElementById('timerAddBtn');
    const timerToggleBtn = document.getElementById('timerToggleBtn');
    const timerResetBtn = document.getElementById('timerResetBtn');

    if (!timerFabBtn || !timerPanel) return;

    function formatTime(seconds) {
        if (seconds < 0) seconds = 0;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(timerTime);
    }

    function toggleTimerPanel() {
        if (timerPanel.style.display === 'none' || timerPanel.style.display === '') {
            timerPanel.style.display = 'flex';
        } else {
            timerPanel.style.display = 'none';
        }
    }

    timerFabBtn.addEventListener('click', toggleTimerPanel);
    closeTimerBtn.addEventListener('click', () => timerPanel.style.display = 'none');

    timerToggleBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            timerToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
            timerToggleBtn.style.background = 'var(--accent-color)';
            timerToggleBtn.style.color = '#000';
            isTimerRunning = false;
        } else {
            if (timerTime <= 0) timerTime = 120; // reset if 0
            isTimerRunning = true;
            timerToggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
            timerToggleBtn.style.background = 'var(--danger-color)';
            timerToggleBtn.style.color = '#fff';
            
            timerInterval = setInterval(() => {
                timerTime--;
                if (timerTime <= 0) {
                    timerTime = 0;
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    timerToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
                    timerToggleBtn.style.background = 'var(--accent-color)';
                    timerToggleBtn.style.color = '#000';
                    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]); } catch(e) {}
                }
                updateDisplay();
            }, 1000);
        }
    });

    timerSubBtn.addEventListener('click', () => {
        timerTime = Math.max(0, timerTime - 30);
        updateDisplay();
    });

    timerAddBtn.addEventListener('click', () => {
        timerTime += 30;
        updateDisplay();
    });

    timerResetBtn.addEventListener('click', () => {
        timerTime = 120; // reset to 2:00
        updateDisplay();
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            timerToggleBtn.innerHTML = '<i class="fas fa-play"></i>';
            timerToggleBtn.style.background = 'var(--accent-color)';
            timerToggleBtn.style.color = '#000';
        }
    });

    updateDisplay();
}

