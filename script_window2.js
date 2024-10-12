function updateDateTime() {
    const now = new Date();
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

    document.getElementById('date').textContent = now.toLocaleDateString('ru-RU', optionsDate);
    document.getElementById('time').textContent = now.toLocaleTimeString('ru-RU', optionsTime);
}

updateDateTime(); // Вызов функции для первоначального отображения
setInterval(updateDateTime, 1000); // Обновление времени каждую секунду
