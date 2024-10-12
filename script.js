 // Урл api
 const baseUrl = "https://li7scheduleapi-production.up.railway.app/api/";

 // Функция получения списка уведомлений
 async function fetchNotifications() {
   const response = await fetch(baseUrl + "notifications");
   return (await response.json());
 }
 // Функция получения расписания дня
 async function fetchDailyRoutine() {
   const response = await fetch(baseUrl + "daily_routine");
   return (await response.json());
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
// Функция для получения и отображения текущей даты и времени
// Функция для отображения даты и времени
function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');

    const now = new Date();
    const date = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const time = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    dateElement.textContent = date;
    timeElement.textContent = time;
}

// Обновляем время каждую секунду
setInterval(updateDateTime, 1000);

// Функция для получения и отображения распорядка дня
// Функция для получения и отображения распорядка дня
// Функция для получения и отображения распорядка дня
async function displayDailyRoutine() {
    const routineDiv = document.getElementById('daily-routine');
    const routine = await fetchDailyRoutine(); // Получаем данные из API

    if (!routine || typeof routine !== 'object') {
        routineDiv.textContent = 'Распорядок дня недоступен.';
        return;
    }

    // Очищаем содержимое перед вставкой
    routineDiv.innerHTML = '<h3>Распорядок дня:</h3>';

    // Функция для рекурсивного отображения данных, если значение объекта — тоже объект
    function renderObject(obj) {
        const fragment = document.createDocumentFragment();

        Object.keys(obj).forEach(key => {
            const value = obj[key];

            const item = document.createElement('p');
            if (typeof value === 'object' && value !== null) {
                item.textContent = `${key}:`;
                fragment.appendChild(renderObject(value)); // Рекурсивно обрабатываем вложенные объекты
            } else {
                item.textContent = `${value}`;
                fragment.appendChild(item);
            }
        });

        return fragment;
    }

    // Добавляем распорядок дня в элемент div
    routineDiv.appendChild(renderObject(routine));
}
// Функция для скрытия лоадера и показа контента
function hideLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    loader.style.display = 'none'; // Скрываем лоадер
    mainContent.style.display = 'block'; // Показываем основной контент
}

// Запуск функций после полной загрузки данных
window.addEventListener('DOMContentLoaded', async () => {
    updateDateTime();

    await fetchDailyRoutine();
    await displayDailyRoutine();
    
    await fetchLessonSchedule();
    await displayLessonSchedule();
    
    // Когда все данные загружены, скрываем лоадер
    hideLoader();
    
    // Обновляем время каждую секунду
    setInterval(updateDateTime, 1000);
});


// Запуск функций при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    displayDailyRoutine();
    
    fetchLessonSchedule();
    displayLessonSchedule(); 
    fetchDailyRoutine();
});
