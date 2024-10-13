// Базовый URL для запросов к API
const baseUrl = "https://li7scheduleapi-production.up.railway.app/api/";

// Функция получения списка уведомлений
async function fetchNotifications() {
    try {
        const response = await fetch(baseUrl + "notifications"); // Запрос к API
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json(); // Ожидаем JSON с уведомлениями
    } catch (error) {
        console.error("Ошибка при получении уведомлений:", error);
        return [];
    }
}

// Функция получения расписания дня
async function fetchDailyRoutine() {
    try {
        const response = await fetch(baseUrl + "daily_routine"); // Запрос к API
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json(); // Ожидаем JSON с распорядком дня
    } catch (error) {
        console.error("Ошибка при получении распорядка дня:", error);
        return null;
    }
}

// Функция получения полного списка уроков
async function fetchFullLessonSchedule() {
    try {
        const response = await fetch(baseUrl + "full_lesson_schedule"); // Запрос к API
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json(); // Ожидаем JSON с полным расписанием
    } catch (error) {
        console.error("Ошибка при получении полного расписания:", error);
        return null;
    }
}

// Функция получения списка уроков по дате
async function fetchLessonSchedule(date) {
    try {
        const response = await fetch(baseUrl + "lesson_schedule?date=" + date); // Запрос к API по дате
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json(); // Ожидаем JSON с расписанием
    } catch (error) {
        console.error("Ошибка при получении расписания уроков:", error);
        return null;
    }
}

// Функция для отображения уведомлений на странице
async function displayNotifications() {
    const notificationsContainer = document.getElementById('notifications-container');
    const notifications = await fetchNotifications(); // Получаем уведомления из API

    if (!notifications || notifications.length === 0) {
        notificationsContainer.innerHTML = '<p>Нет новых уведомлений.</p>';
        return;
    }

    // Очищаем содержимое контейнера перед вставкой данных
    notificationsContainer.innerHTML = '';

    // Создаем элементы для каждого уведомления
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        notificationItem.innerHTML = `
            <h3>${notification.title || 'Без заголовка'}</h3>
            <p>${notification.description || 'Без содержания'}</p>
        `;

        notificationsContainer.appendChild(notificationItem); // Вставляем уведомление в контейнер
    });
}

// Функция для отображения даты и расписания уроков на странице
async function displayLessonSchedule() {
    const timetableDiv = document.getElementById('timetable');
    const dateHeading = document.getElementById('date-heading');
    const today = new Date().toISOString().split('T')[0]; // Формат YYYY-MM-DD
    const schedule = await fetchLessonSchedule(today);
    // Получаем расписание с API

    if (!schedule || !schedule.lessons || !schedule.lessons.length || !schedule.lessons[0].lessons) {
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
                <th>Предмет</th>
                <th>Кабинет</th>
            </tr>
        </thead>
        <tbody>
            ${schedule.lessons[0].lessons.map(lesson => `
                <tr>
                    <td>${lesson.name || "Без названия"}</td>
                    <td>${lesson.classroom || "Не указано"}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Вставляем таблицу в контейнер расписания
    timetableDiv.appendChild(table);
}


// Функция для обновления даты и времени
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

// Функция для отображения распорядка дня на странице
async function displayDailyRoutine() {
    const routineDiv = document.getElementById('daily-routine');
    const routine = await fetchDailyRoutine(); // Получаем распорядок дня с API

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

// Запуск функций при загрузке страницы
window.addEventListener('DOMContentLoaded', async () => {
    updateDateTime(); // Запускаем обновление даты и времени

    await displayNotifications(); // Отображаем уведомления
    await displayDailyRoutine(); // Отображаем распорядок дня
    await displayLessonSchedule(); // Отображаем расписание уроков

    hideLoader(); // Скрываем лоадер после загрузки данных
});
