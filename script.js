 // Урл api
 const baseUrl = "https://li7scheduleapi-production.up.railway.app/api/";

 // Функция получения списка уведомлений
 async function fetchNotifications() {
   const response = await fetch(baseUrl + "notifications");
   return (await response.json())[0];
 }
 // Функция получения расписания дня
 async function fetchDailyRoutine() {
   const response = await fetch(baseUrl + "daily_routine");
   return (await response.json())[0];
 }
// Функция получения списка уроков
// Урл api

// Функция получения списка уроков с API
async function fetchLessonSchedule() {
    try {
        const response = await fetch(baseUrl + "lesson_schedule"); // Запрос к API
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`); // Обработка ошибок
        }

        const data = await response.json(); // Ожидаем JSON с расписанием
        console.log("Данные расписания с API:", data); // Логируем полученные данные для проверки

        return data[0]; // Возвращаем первый элемент данных
    } catch (error) {
        console.error("Ошибка при получении расписания:", error);
        return null; // Возвращаем null в случае ошибки
    }
}

// Функция для отображения даты и расписания в HTML
async function displayLessonSchedule() {
    const timetableDiv = document.getElementById('timetable');
    const dateHeading = document.getElementById('date-heading');
    const schedule = await fetchLessonSchedule(); // Получаем расписание с API

    if (!schedule || !schedule.lessons || !schedule.lessons[0] || !schedule.lessons[0].lessons) {
        timetableDiv.innerHTML = '<p>Не удалось загрузить расписание.</p>';
        return;
    }

    // Устанавливаем дату в заголовок h1
    dateHeading.textContent = `Расписание на ${schedule.date}`;

    // Очищаем содержимое div перед вставкой данных
    timetableDiv.innerHTML = '';

    // Пример структуры расписания (таблица с уроками)
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>${schedule.lessons[0].class}</th>
            </tr>
        </thead>
        <tbody>
            ${schedule.lessons[0].lessons.map(lesson => `
                <tr>
                    <td>${lesson.name || "Без названия"},</td>
                    <td>${lesson.classroom || "Не указано"}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Вставляем таблицу в контейнер расписания
    timetableDiv.appendChild(table);
}

// Запуск функции при загрузке страницы
window.addEventListener('DOMContentLoaded', displayLessonSchedule);
