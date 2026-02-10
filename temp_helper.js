
function getLastSessionData(exerciseId) {
    const today = new Date();
    // Normalizamos 'today' para que sea al inicio del día para comparaciones correctas
    today.setHours(0, 0, 0, 0);

    const keys = Object.keys(localStorage)
        .filter(k => k.startsWith('gym_log_'));

    // Convertir claves a objetos { date: Date, key: string }
    const history = keys.map(key => {
        const dateStr = key.replace('gym_log_', '');
        // El formato es YYYY-MM-DD, que Date.parse entiende bien
        // Ojo con la zona horaria. Se guardó como ISO local yyyy-mm-dd
        // Al hacer new Date('yyyy-mm-dd') en JS suele interpretarse como UTC o local depende del navegador
        // Usaremos split para ir seguros
        const parts = dateStr.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return { date, key, dateStr };
    });

    // Filtrar:
    // 1. Mismo día de la semana (0-6)
    // 2. Fecha estrictamente anterior a hoy (para no mostrar lo que estoy anotando ahora)
    const validSessions = history.filter(session => {
        return session.date.getDay() === today.getDay() && session.date < today;
    });

    // Ordenar de más reciente a más antigua
    validSessions.sort((a, b) => b.date - a.date);

    // Buscar la primera sesión que tenga datos para este ejercicio
    for (const session of validSessions) {
        const data = JSON.parse(localStorage.getItem(session.key));
        if (data && data[exerciseId]) {
            // Encontrado!
            return {
                date: session.dateStr,
                ...data[exerciseId]
            };
        }
    }

    return null; // Nada encontrado
}
