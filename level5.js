// Инициализация уровня "Космический Ловец Астероидов"
document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    // Добавим в начало списка элементов интерфейса
const rulesBtn = document.getElementById('rules-btn');
const probabilityBtn = document.getElementById('probability-btn');
const rulesModal = document.getElementById('rules-modal');
const probabilityModal = document.getElementById('probability-modal');
const closeRulesBtn = document.getElementById('close-rules');
const closeProbabilityBtn = document.getElementById('close-probability');

// Добавим обработчики событий для новых элементов
rulesBtn.addEventListener('click', () => rulesModal.classList.add('visible'));
probabilityBtn.addEventListener('click', () => probabilityModal.classList.add('visible'));
closeRulesBtn.addEventListener('click', () => rulesModal.classList.remove('visible'));
closeProbabilityBtn.addEventListener('click', () => probabilityModal.classList.remove('visible'));

// Закрытие модальных окон при клике вне контента
rulesModal.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
        rulesModal.classList.remove('visible');
    }
});

probabilityModal.addEventListener('click', (e) => {
    if (e.target === probabilityModal) {
        probabilityModal.classList.remove('visible');
    }
});
    const catSpeech = document.getElementById('cat-speech');
    const takeAsteroidBtn = document.getElementById('take-asteroid');
    const stopRoundBtn = document.getElementById('stop-round');
    const backToMapBtn = document.getElementById('back-to-map');
    const nextRoundBtn = document.getElementById('next-round');
    const backToMapFinalBtn = document.getElementById('back-to-map-final');
    const playerCardsContainer = document.getElementById('player-cards');
    const commonCardsContainer = document.getElementById('common-cards');
    const roundCountElement = document.getElementById('round-count');
    const scoreElement = document.getElementById('score');
    const roundResultModal = document.getElementById('round-result');
    const gameOverModal = document.getElementById('game-over');
    const resultTitle = document.getElementById('result-title');
    const resultDetails = document.getElementById('result-details');
    const gameResultTitle = document.getElementById('game-result-title');
    const finalScoreElement = document.getElementById('final-score');

    // Игровые переменные
    let score = 0;
    let currentRound = 1;
    const totalRounds = 5;
    let playerAsteroids = [];
    let commonAsteroids = [];
    let asteroidDeck = [];
    let gameActive = true;
    
    // Вероятности выпадения астероидов (в процентах)
    const asteroidProbabilities = {
        number: 80,   // 80% вероятность обычного астероида (1-10)
        gold: 10,     // 10% вероятность золотого астероида
        bomb: 10      // 10% вероятность бомбы
    };
    
    // Распределение цветов для обычных астероидов
    const colorDistribution = {
        blue: 25,
        red: 25,
        green: 25,
        yellow: 25
    };
    
    // Цвета астероидов
    const asteroidColors = ['blue', 'red', 'green', 'yellow'];
    const specialAsteroids = ['gold', 'bomb'];
    
    // Правила игры и комбинации
    const gameRules = {
        goal: "Собери как можно больше очков за 5 раундов, собирая ценные астероиды и составляя комбинации.",
        combinations: [
            { description: "2 одинаковых числа", points: 10 },
            { description: "3 одинаковых числа", points: 30 },
            { description: "3 астероида одного цвета", points: 20 },
            { description: "Золотой астероид", points: 50, autowin: true },
            { description: "Каждая бомба", points: -10, penalty: true }
        ],
        roundRules: "В каждом раунде вы можете брать астероиды из колоды, пока не решите остановиться. Будьте осторожны - 2 бомбы завершают раунд автоматически!"
    };
    
    // Показать правила игры при первом запуске
    function showGameRules() {
        catSpeech.textContent = gameRules.goal;
        setTimeout(() => {
            catSpeech.textContent = "Собирай комбинации: 2 одинаковых числа = 10 очков, 3 числа = 30 очков!";
        }, 4000);
    }
    
    // Показать речь кота
    setTimeout(() => {
        catSpeech.classList.add('visible');
        showGameRules();
    }, 1000);
    
    // Инициализация игры
    initGame();
    
    // Обработчики событий
    takeAsteroidBtn.addEventListener('click', takeAsteroid);
    stopRoundBtn.addEventListener('click', stopRound);
    backToMapBtn.addEventListener('click', goBackToMap);
    nextRoundBtn.addEventListener('click', startNextRound);
    backToMapFinalBtn.addEventListener('click', goBackToMap);
    
    // Функции игры
    
    function initGame() {
        score = 0;
        currentRound = 1;
        updateScore();
        updateRound();
        createAsteroidDeck();
        startRound();
    }
    
    function createAsteroidDeck() {
        asteroidDeck = [];
        const totalCards = 50; // Общее количество карт в колоде
        
        // Создаем обычные астероиды (числа от 1 до 10) с учетом вероятностей
        const numberAsteroidsCount = Math.floor(totalCards * asteroidProbabilities.number / 100);
        for (let i = 0; i < numberAsteroidsCount; i++) {
            const value = Math.floor(Math.random() * 10) + 1; // Числа от 1 до 10
            const color = getRandomColor();
            asteroidDeck.push({ type: 'number', value: value, color: color });
        }
        
        // Добавляем специальные астероиды (золотые и бомбы)
        const specialAsteroidsCount = totalCards - numberAsteroidsCount;
        const goldCount = Math.floor(specialAsteroidsCount * asteroidProbabilities.gold / (asteroidProbabilities.gold + asteroidProbabilities.bomb));
        const bombCount = specialAsteroidsCount - goldCount;
        
        for (let i = 0; i < goldCount; i++) {
            asteroidDeck.push({ type: 'special', value: 'gold', color: 'gold' });
        }
        
        for (let i = 0; i < bombCount; i++) {
            asteroidDeck.push({ type: 'special', value: 'bomb', color: 'bomb' });
        }
        
        // Перемешиваем колоду
        asteroidDeck = shuffleDeck(asteroidDeck);
    }
    
    function getRandomColor() {
        const rand = Math.random() * 100;
        let cumulative = 0;
        
        for (const [color, prob] of Object.entries(colorDistribution)) {
            cumulative += prob;
            if (rand <= cumulative) {
                return color;
            }
        }
        
        return asteroidColors[0]; // fallback
    }
    
    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
    
    function startRound() {
        gameActive = true;
        playerAsteroids = [];
        commonAsteroids = [];
        
        // Раздаем 2 астероида игроку
        for (let i = 0; i < 2; i++) {
            if (asteroidDeck.length > 0) {
                playerAsteroids.push(asteroidDeck.pop());
            }
        }
        
        // Размещаем 3 общих астероида
        for (let i = 0; i < 3; i++) {
            if (asteroidDeck.length > 0) {
                commonAsteroids.push(asteroidDeck.pop());
            }
        }
        
        updateUI();
        updateButtons();
    }
    
    function takeAsteroid() {
        if (!gameActive || asteroidDeck.length === 0) return;
        
        // Берем астероид из колоды
        const newAsteroid = asteroidDeck.pop();
        playerAsteroids.push(newAsteroid);
        
        // Проверяем, не бомба ли это
        if (newAsteroid.value === 'bomb') {
            catSpeech.textContent = 'О нет! Это бомба! Ты теряешь 10 очков!';
            score = Math.max(0, score - 10);
            updateScore();
        } else if (newAsteroid.value === 'gold') {
            catSpeech.textContent = 'Ура! Золотой астероид! +50 очков!';
        } else {
            catSpeech.textContent = `Ты поймал астероид ${newAsteroid.value}!`;
        }
        
        updateUI();
        checkForAutoWin();
    }
    
    function stopRound() {
        if (!gameActive) return;
        
        gameActive = false;
        calculateRoundScore();
        updateButtons();
    }
    
    function calculateRoundScore() {
    let roundScore = 0;
    let scoreDetails = [];
    
    // Сначала проверяем бомбы (они влияют на все)
    const bombCount = playerAsteroids.filter(a => a.value === 'bomb').length;
    if (bombCount > 0) {
        const bombPenalty = bombCount * 10;
        roundScore -= bombPenalty;
        scoreDetails.push(`Бомбы: -${bombPenalty} очков`);
    }
    
    // Проверяем наличие золотого астероида
    const hasGold = playerAsteroids.some(a => a.value === 'gold');
    if (hasGold) {
        roundScore += 50;
        scoreDetails.push('Золотой астероид: +50 очков');
    }
    
    // Проверяем комбинации независимо от наличия золотого астероида
    const numberAsteroids = playerAsteroids.filter(a => a.type === 'number');
    
    // Группируем астероиды по значениям
    const valueGroups = {};
    numberAsteroids.forEach(a => {
        if (!valueGroups[a.value]) {
            valueGroups[a.value] = 0;
        }
        valueGroups[a.value]++;
    });
    
    // Проверяем комбинации чисел
    for (const [value, count] of Object.entries(valueGroups)) {
        if (count >= 3) {
            roundScore += 30;
            scoreDetails.push(`Три ${value}: +30 очков`);
        } else if (count === 2) {
            roundScore += 10;
            scoreDetails.push(`Две ${value}: +10 очков`);
        }
    }
    
    // Группируем астероиды по цветам
    const colorGroups = {};
    numberAsteroids.forEach(a => {
        if (!colorGroups[a.color]) {
            colorGroups[a.color] = 0;
        }
        colorGroups[a.color]++;
    });
    
    // Проверяем комбинации цветов
    for (const [color, count] of Object.entries(colorGroups)) {
        if (count >= 3) {
            roundScore += 20;
            scoreDetails.push(`Три ${getColorName(color)} астероида: +20 очков`);
        }
    }
    
    // Убедимся, что счет не отрицательный
    roundScore = Math.max(0, roundScore);
    
    // Обновляем общий счет
    score += roundScore;
    updateScore();
    
    // Показываем результаты раунда
    showRoundResult(roundScore, scoreDetails);
}
    
    function getColorName(color) {
        const colors = {
            'blue': 'синих',
            'red': 'красных',
            'green': 'зелёных',
            'yellow': 'жёлтых'
        };
        return colors[color] || color;
    }
    
    function checkForAutoWin() {
        // Если у игрока 2 бомбы, автоматически завершаем раунд
        const bombCount = playerAsteroids.filter(a => a.value === 'bomb').length;
        if (bombCount >= 2) {
            catSpeech.textContent = 'Осторожно! У тебя уже две бомбы! Раунд завершен.';
            setTimeout(() => {
                stopRound();
            }, 1500);
        }
    }
    
    function startNextRound() {
        roundResultModal.classList.remove('visible');
        
        if (currentRound < totalRounds) {
            currentRound++;
            updateRound();
            createAsteroidDeck();
            startRound();
        } else {
            endGame();
        }
    }
    
    function endGame() {
        gameOverModal.classList.add('visible');
        
        let resultText;
        if (score >= 100) {
            resultText = 'Потрясающе! Ты настоящий Космический Ловец!';
        } else if (score >= 50) {
            resultText = 'Хороший результат! Ты отличный капитан!';
        } else {
            resultText = 'Попробуй ещё раз! Ты сможешь лучше!';
        }
        
        gameResultTitle.textContent = resultText;
        finalScoreElement.textContent = `Твой счёт: ${score}`;
    }
    
    function updateUI() {
        // Очищаем контейнеры
        playerCardsContainer.innerHTML = '';
        commonCardsContainer.innerHTML = '';
        
        // Отображаем астероиды игрока
        playerAsteroids.forEach((asteroid, index) => {
            const asteroidElement = createAsteroidElement(asteroid, index);
            playerCardsContainer.appendChild(asteroidElement);
        });
        
        // Отображаем общие астероиды
        commonAsteroids.forEach((asteroid, index) => {
            const asteroidElement = createAsteroidElement(asteroid, index);
            commonCardsContainer.appendChild(asteroidElement);
        });
    }
    
    function createAsteroidElement(asteroid, index) {
        const element = document.createElement('div');
        element.className = `asteroid ${asteroid.color}`;
        
        // Для бомбы и золотого астероида используем emoji
        if (asteroid.value === 'bomb') {
            element.textContent = '💣';
        } else if (asteroid.value === 'gold') {
            element.textContent = '★';
        } else {
            element.textContent = asteroid.value;
        }
        
        // Добавляем анимацию при добавлении нового астероида
        if (index === playerAsteroids.length - 1 && gameActive) {
            setTimeout(() => {
                element.classList.add('asteroid-caught');
                setTimeout(() => {
                    element.classList.remove('asteroid-caught');
                }, 500);
            }, 100);
        }
        
        return element;
    }
    
    function updateButtons() {
        takeAsteroidBtn.disabled = !gameActive || asteroidDeck.length === 0;
        stopRoundBtn.disabled = !gameActive;
    }
    
    function updateScore() {
        scoreElement.textContent = score;
    }
    
    function updateRound() {
        roundCountElement.textContent = `${currentRound}/${totalRounds}`;
    }
    
    function showRoundResult(roundScore, details) {
        resultTitle.textContent = `Раунд ${currentRound} завершен`;
        
        let detailsHTML = `<div class="round-score">Очки за раунд: <span class="highlight">${roundScore}</span></div>`;
        
        if (details.length > 0) {
            detailsHTML += '<ul class="score-details">';
            details.forEach(detail => {
                detailsHTML += `<li>${detail}</li>`;
            });
            detailsHTML += '</ul>';
        } else {
            detailsHTML += '<p>Нет комбинаций</p>';
        }
        
        resultDetails.innerHTML = detailsHTML;
        roundResultModal.classList.add('visible');
    }
    
    function goBackToMap() {
        window.location.href = 'index.html';
    }
    
    // Задачи на вероятность
    function showProbabilityQuestion() {
        // Пример вопроса: если на экране два красных астероида, какова вероятность следующего красного?
        const redAsteroids = commonAsteroids.filter(a => a.color === 'red').length;
        
        if (redAsteroids >= 2) {
            const remainingReds = asteroidDeck.filter(a => a.color === 'red').length;
            const totalRemaining = asteroidDeck.length;
            const probability = Math.round((remainingReds / totalRemaining) * 100);
            
            catSpeech.textContent = `Вероятность следующего красного астероида: ${probability}%`;
        }
    }
});