// Обработка кнопки "Начать игру"
document.getElementById('start-btn').addEventListener('click', function() {
    document.getElementById('start-menu').classList.remove('visible');
    document.getElementById('start-menu').classList.add('hidden');
    document.getElementById('level-select').classList.remove('hidden');
    document.getElementById('level-select').classList.add('visible');
    
    // Анимация кота-проводника
    const cat = document.getElementById('map-cat');
    cat.style.transition = 'all 2s ease-in-out';
    cat.style.left = '15%';
    cat.style.bottom = '50%';
});

// Обработка кнопки "В главное меню"
document.getElementById('back-to-menu').addEventListener('click', function() {
    document.getElementById('level-select').classList.remove('visible');
    document.getElementById('level-select').classList.add('hidden');
    document.getElementById('start-menu').classList.remove('hidden');
    document.getElementById('start-menu').classList.add('visible');
});

// Обработка выбора уровня
document.querySelectorAll('.level-planet:not(.locked)').forEach(planet => {
    planet.addEventListener('click', function() {
        const level = this.getAttribute('data-level');
        startLevel(level);
    });
});

function startLevel(levelNum) {
    // Здесь будет логика загрузки уровня
    console.log(`Запуск уровня ${levelNum}`);
    
    // Пока просто пример анимации
    const cat = document.getElementById('map-cat');
    cat.style.transition = 'all 1s ease-in-out';
    cat.style.left = `${15 + (levelNum-1)*20}%`;
    cat.style.bottom = `${50 + (levelNum%2 ? -10 : 10)}%`;
    
    // В реальной игре здесь будет переход на игровой экран
}

// Разблокировка первого уровня
document.querySelector('.level-planet[data-level="1"]').classList.remove('locked');