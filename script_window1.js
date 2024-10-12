const content = document.getElementById('content');
const weatherText = document.getElementById('weatherText');
const weatherIcon = document.getElementById('weatherIcon');
const backgrounds = [
    { color: '#FFD700', text: 'Новости: Сегодня важные события в мире.' },  // Новости
    { image: 'url(logo.jpg)', text: '' }  // Картинка
];
let currentIndex = 0;

// Функция для обновления данных о погоде
async function updateWeather() {
    const apiKey = 'a085877b6e1ad5171ee38632eab7e1ec'; // Вставьте сюда ваш API ключ
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Kazan&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const temperature = Math.round(data.main.temp); // Получаем температуру
        const description = data.weather[0].description; // Описание погоды
        const iconCode = data.weather[0].icon; // Получаем код иконки
        const weatherTextValue = `Погода в Казани: ${temperature}°C, ${description}`;

        // Обновляем информацию на экране
        weatherText.textContent = weatherTextValue;
        weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.style.display = 'block'; // Показываем иконку

        // Убираем фон картинки, если он был установлен
        document.body.style.backgroundImage = 'none';

        // Изменяем цвет фона в зависимости от температуры
        if (temperature > 20) {
            document.body.style.backgroundColor = '#FFD700'; // Желтый фон для теплой погоды
        } else {
            document.body.style.backgroundColor = '#1E90FF'; // Синий фон для холодной погоды
        }

    } catch (error) {
        console.error('Ошибка при получении погоды:', error);
        weatherText.textContent = 'Не удалось загрузить погоду';
    }
}

updateWeather(); // Обновляем погоду при загрузке страницы

// Функция смены фона и текста для новостей и картинки
function changeBackground() {
    currentIndex = (currentIndex + 1) % (backgrounds.length + 1);

    if (currentIndex === 0) {
        updateWeather(); // Снова обновляем погоду при возвращении на этот экран
    } else if (backgrounds[currentIndex - 1].image) {
        document.body.style.backgroundImage = backgrounds[currentIndex - 1].image;
        document.body.style.backgroundColor = 'transparent';
        weatherText.textContent = backgrounds[currentIndex - 1].text;
        weatherIcon.style.display = 'none'; // Скрыть иконку погоды
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = backgrounds[currentIndex - 1].color;
        weatherText.textContent = backgrounds[currentIndex - 1].text;
        weatherIcon.style.display = 'none'; // Скрыть иконку погоды
    }
}

// Автоматическая смена фона каждые 10 секунд
setInterval(changeBackground, 10000);

// Реализация свайпа только вправо
let startX = 0;

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) { // Свайп вправо
        changeBackground();
    }
});