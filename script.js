let lastChoice = '';
let currentPlayerName = '';

// Базовые характеристики (Side UI) - Стартовое состояние
let stats = {
    stress: 70,
    awareness: 50,
    empathy: 50,
    motivation: 50
};

// Функция обновления шкал на экране с анимацией
function updateUI() {
    const types = ['stress', 'awareness', 'empathy', 'motivation'];
    types.forEach(type => {
        const bar = document.getElementById(`bar-${type}`);
        const valText = document.getElementById(`${type}-val`);
        if (bar) bar.style.width = stats[type] + '%';
        if (valText) valText.innerText = stats[type] + '%';

        // Добавляем пульсацию для высокого стресса
        if (type === 'stress' && stats.stress > 80 && bar) {
            bar.classList.add('stress-warning');
        } else if (type === 'stress' && bar) {
            bar.classList.remove('stress-warning');
        }
    });
}

// === ПОЛНЫЙ СЦЕНАРИЙ ИГРЫ (интеграция из Word) ===
const story = {
    "start": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "Этот Node.js меня доконает... \nПочему запрос возвращает undefined?",
        choices: [{ text: "Далее", next: "scene_1_noise" }]
    },
    
    "scene_1_noise": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Шум из коридора",
        text: "ДА КУДА ТЫ ФЛЕШКУ КИДАЕШЬ?! ЗАХОДИ С ПЛАНТА!",
        choices: [{ text: "Далее", next: "scene_1_choice" }]
    },
    "scene_1_noise_1": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "Баг в коде, завтра экзамен по дискретке, а тут еще этот шум из коридора...",
        choices: [{ text: "Далее", next: "scene_1_choice" }]
    },
    "scene_1_choice": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_angry.png", 
        speaker: "Нурс (мысли)",
        text: "Баг в коде, завтра экзамен по дискретке, а тут еще этот шум из коридора...",
        choices: [
            { text: "[Агрессия] 'ТИХО! Вы что, совесть потеряли?'", next: "scene_2_1" },
            { text: "[Игнор] Надеть наушники и продолжить", next: "scene_2_2" },
            { text: "[Спокойно решить] Выйти и поговорить", next: "scene_2_3" }
        ]
    },

    // --- ВЕТКА 2.1: Агрессия ---
    "scene_2_1": {
        bg: "assets/backgrounds/room_alikhan.png", // Геймерская комната соседа
        sprite: "assets/sprites/nurs_angry.png",
        speaker: "Нурс (крича)",
        text: "ТИХО! Вы что, вообще совесть потеряли? Люди спят, а мне проект сдавать! Я сейчас коменданту пойду и на всех рапорт напишу!",
        statChanges: { stress: 25, awareness: -30, empathy: -20 },
        choices: [{ text: "Ждать ответа", next: "scene_2_1_reaction" }]
    },
    "scene_2_1_reaction": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/alikhan_angry.png", // Алихан раздражен/агрессивен
        speaker: "Алихан (сосед)",
        text: "Ой, гляньте, староста проснулся. Че ты сразу угрожать начинаешь? Сказать нормально нельзя было?",
        choices: [{ text: "Хлопнуть дверью и уйти", next: "scene_2_1_return" }]
    },
    "scene_2_1_return": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_panic.png", 
        speaker: "Нурс (мысли)",
        text: "Сердце колотится, руки трясутся. Наорал, а легче не стало. Теперь точно не смогу сосредоточиться на коде...",
        choices: [{ text: "Пытаться кодить дальше...", next: "scene_3" }]
    },

    // --- ВЕТКА 2.2: Игнор ---
    "scene_2_2": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "Просто игнорируй...",
        statChanges: { stress: 15, awareness: -10 },
        choices: [{ text: "Прошло 10 минут...", next: "scene_2_2_thoughts" }]
    },
    "scene_2_2_thoughts": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "Черт, я три раза перечитал одну и ту же строчку. Злость копится, я чувствую, как закипаю.",
        choices: [{ text: "Далее", next: "scene_2_2_escalation" }]
    },
    "scene_2_2_escalation": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Голос Алихана (приглушенно)",
        text: "ДА ТЫ КРЫСА! КРЫСА НА МИДУ! ХА-ХА-ХА!",
        choices: [
            { text: "[Сорваться] Вылететь в коридор", next: "scene_2_2_angry" },
            { text: "[Сдаться] Я слишком устал...", next: "scene_2_2_1" }
        ]
    },
    "scene_2_2_angry": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/nurs_angry.png",
        speaker: "Нурс (срываясь)",
        text: "ТИХО! Я сейчас коменданту донесу, если не замолкнете! Я думал, вы сами поймете и успокоитесь, но вы продолжаете!",
        statChanges: { stress: 20, awareness: -20 },
        choices: [{ text: "Выслушать Алихана", next: "scene_2_1_reaction" }] // Перекидывает на реакцию агрессии
    },
    "scene_2_2_1": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png", 
        speaker: "Нурс (мысли)",
        text: "Всё равно ничего не получится... Я слишком устал. Этот код бессмысленен, экзамен не сдать... Мозг просто отказывается думать. Будь что будет.",
        statChanges: { stress: 20, motivation: -50 }, 
        choices: [{ text: "Закрыть ноутбук", next: "scene_3_1" }] 
    },

    // --- ВЕТКА 2.3: Спокойное решение (Золотой путь) ---
    "scene_2_3": {
        bg: "assets/backgrounds/room_alikhan.png", // Комната соседей
        sprite: "assets/sprites/nurs_neutral.png", 
        speaker: "Нурс (спокойно)",
        text: "Алихан, привет. Слушай, мешаешь Максату спать, а мне сосредоточиться на проекте. Надень наушники, пожалуйста, катка же тише от этого не станет.",
        statChanges: { stress: -30, awareness: 30, empathy: 40 },
        choices: [{ text: "Смотреть реакцию Алихана", next: "scene_2_3_reaction" }]
    },
    "scene_2_3_reaction": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/alikhan_guilty.png", // Алихан смущен/чувствует вину
        speaker: "Алихан",
        text: "Ой, сорян, Нурс! Заигрались, реально. Сейчас сделаю.",
        choices: [{ text: "Посмотреть на Максата", next: "scene_2_3_maksat" }]
    },
    "scene_2_3_maksat": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/maksat.png", // Максат рад, что его спасли
        speaker: "Максат (сосед)",
        text: "Рахмет, Нурс, реально спас мой сон.",
        choices: [{ text: "Вернуться в свою комнату", next: "scene_2_3_return" }]
    },
    "scene_2_3_return": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_neutral.png", 
        speaker: "Нурс (мысли)",
        text: "Фух. Сработало. Конфликт исчерпан, можно возвращаться к работе с чистой головой. Когда ты говоришь с людьми по-человечески, они отвечают тем же.",
        choices: [{ text: "Сесть за код", next: "scene_3" }]
    },

    // --- СЦЕНА 3: Внутренний выбор ---
    "scene_3": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "Тишина - это хорошо. Но глаза уже слипаются. До дедлайна пара часов. Если лягу сейчас - могу не проснуться вовремя. Если останусь - боюсь наделать еще больше ошибок в логике. Что делать?.",
        choices: [
            { text: "Лечь спать", next: "scene_3_1" },
            { text: "Завершить проект", next: "scene_4" }
        ]
    },

    // --- СЦЕНА 3.1: Петля Провала (Кошмар) ---
    "scene_3_1": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/professor.png", 
        speaker: "Преподаватель",
        text: "Башан Нурсаят, давайте, запускайте ваш проект. Мы ждем.",
        choices: [{ text: "Запустить код...", next: "scene_3_1_panic" }]
    },
    "scene_3_1_panic": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/nurs_panic.png", 
        speaker: "Нурс (мысли)",
        text: "Нет, нет, там что, ошибка?! Надо было дописать ту функцию...",
        choices: [{ text: "Смотреть на экран", next: "scene_3_1_fail" }]
    },
    "scene_3_1_fail": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/nurs_panic.png",
        speaker: "Система",
        text: "ВНИМАНИЕ: ВЫ ПОТЕРЯЛИ СТИПЕНДИЮ.",
        statChanges: { stress: 20 },
        choices: [{ text: "НЕТ! (Проснуться)", next: "scene_3_1_wakeup" }]
    },
    "scene_3_1_wakeup": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (просыпаясь)",
        text: "Нет! Это был просто кошмар?.. Спать нельзя. Придется кодить.",
        choices: [{ text: "Открыть IDE", next: "scene_4" }] 
    },

    // --- СЦЕНА 4: Финальный выбор мотивации ---
    "scene_4": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_focus.png",
        speaker: "Нурс (мысли)",
        text: "Так, ошибки в роутах исправлены. Осталось дописать последнюю функцию обработки данных. Но силы на исходе... \nНужно найти причину, чтобы не закрыть ноутбук прямо сейчас.",
        choices: [
            { text: "Ради стипендии и выживания", next: "end_fear" },
            { text: "Ради будущей карьеры бэкендера", next: "end_vision" }
        ]
    },

    // --- ФИНАЛ: Страх (Стипендия) ---
    "end_fear": {
        bg: "assets/backgrounds/room_parents.png",
        sprite: "assets/sprites/nurs_focus.png",
        speaker: "Нурс (мысли)",
        text: "«Так, если завалю — минус стипендия. Придется опять на всем экономить. Просто допишу этот кусок как-нибудь, лишь бы тесты прошли».",
        statChanges: { stress: 15, motivation: -20 },
        choices: [{ text: "Запустить билд", next: "end_fear_success" }]
    },
    "end_fear_success": {
        bg: "assets/backgrounds/room_parents.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Терминал",
        text: "> Build finished successfully.\n> Ready for deployment.",
        choices: [{ text: "Отправить проект", next: "end_fear_epilogue" }]
    },
    "end_fear_epilogue": {
        bg: "assets/backgrounds/room_parents.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс",
        text: "«Фух. Сдал. Стипендия спасена. Но чувствую себя как выжатый лимон. На код больше смотреть тошно, хочется просто упасть лицом в подушку... Выгорание близко».",
        choices: [{ text: "Конец игры (Начать заново)", next: "start" }]
    },

    // --- ФИНАЛ: Видение (Внутренняя мотивация) ---
    "end_vision": {
        bg: "assets/backgrounds/room_career.png",
        sprite: "assets/sprites/nurs_focus.png",
        speaker: "Нурс (мысли)",
        text: "«Окей, этот баг — хорошая практика. Разберусь с роутами нормально, на бэкенде с таким постоянно придется сталкиваться. Надо сделать по уму».",
        statChanges: { stress: -20, motivation: 40 },
        choices: [{ text: "Запустить билд", next: "end_vision_success" }]
    },
    "end_vision_success": {
        bg: "assets/backgrounds/room_career.png",
        sprite: "assets/sprites/nurs_happy.png",
        speaker: "Терминал",
        text: "> Build finished successfully.\n> Ready for deployment.",
        choices: [{ text: "Отправить проект", next: "end_vision_epilogue" }]
    },
    "end_vision_epilogue": {
        bg: "assets/backgrounds/room_career.png",
        sprite: "assets/sprites/nurs_neutral.png",
        speaker: "Нурс",
        text: "«Отлично, ушло. Устал, конечно, но код получился нормальным. По крайней мере, теперь я реально понимаю, как эта логика работает под капотом».",
        choices: [{ text: "Конец игры (Начать заново)", next: "start" }]
    }
};

// Функция отрисовки сцены
function renderScene(sceneId) {
    const scene = story[sceneId];
    if (!scene) return;

    // Фиксация выбора для статистики
    if (sceneId === 'end_fear') lastChoice = 'fear';
    if (sceneId === 'end_vision') lastChoice = 'vision';
    
    // ПЕРЕХОД К ФИНАЛУ: Если дошли до эпилога, активируем финальные действия
    if (sceneId === 'end_fear_epilogue' || sceneId === 'end_vision_epilogue') {
        // Даем игроку 2 секунды дочитать текст, затем показываем результаты
        setTimeout(() => {
            showFinalResults();
        }, 2000);
    }

    // Спрайт и анимация появления
    const charLayer = document.getElementById('character-layer');
    if (charLayer) {
        charLayer.style.opacity = '0';
        charLayer.style.transform = 'translateY(10px)';
    }
    
    setTimeout(() => {
        const bgElement = document.getElementById('background');
        if (bgElement) bgElement.style.backgroundImage = `url('${scene.bg}')`;
        
        const charImg = document.getElementById('character');
        if (charImg) charImg.src = scene.sprite;
        
        if (charLayer) {
            charLayer.style.opacity = '1';
            charLayer.style.transform = 'translateY(0)';
        }
    }, 150);

    // Текст
    const speakerEl = document.getElementById('speaker-name');
    const textEl = document.getElementById('dialogue-text');
    if (speakerEl) speakerEl.innerText = scene.speaker;
    if (textEl) textEl.innerText = scene.text;

    // Статы
    if (scene.statChanges) {
        for (let key in scene.statChanges) {
            stats[key] = Math.max(0, Math.min(100, stats[key] + scene.statChanges[key]));
        }
        updateUI();
    }

    // Кнопки
    const choicesContainer = document.getElementById('choices-container');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = choice.text;
            btn.onclick = () => renderScene(choice.next);
            choicesContainer.appendChild(btn);
        });
    }
}

function syncPlayerNameInputs() {
    const commentNameInput = document.getElementById('player-name-input');
    if (commentNameInput) {
        commentNameInput.value = currentPlayerName;
    }
}

function startGame() {
    const startNameInput = document.getElementById('start-player-name-input');
    const enteredName = startNameInput ? startNameInput.value.trim() : '';
    currentPlayerName = enteredName || 'Аноним';

    const nameOverlay = document.getElementById('name-overlay');
    if (nameOverlay) {
        nameOverlay.classList.add('hidden');
    }

    syncPlayerNameInputs();
    renderScene("start");
    updateUI();
}

// Старт игры
window.onload = () => {
    const startNameInput = document.getElementById('start-player-name-input');
    if (startNameInput) {
        startNameInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                startGame();
            }
        });
        startNameInput.focus();
    }
};

// URL твоего будущего бэкенда на Render (пока можно использовать localhost для тестов)
const BACKEND_URL = 'https://eq-game-tb0x.onrender.com/api';

// Функция отправки статистики финала
async function sendFinalStat(choice) {
    try {
        const response = await fetch(`${BACKEND_URL}/stats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ choiceId: choice })
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        console.log("Статистика получена:", data);
        return data;
    } catch (err) {
        console.error("Не удалось отправить статистику:", err.message);
        return [];
    }
}

// Функция отправки результата в Leaderboard
async function submitToLeaderboard(playerName) {
    // Высчитываем итоговый EQ score
    const eqScore = (stats.awareness + stats.empathy + stats.motivation) - stats.stress;
    
    try {
        const response = await fetch(`${BACKEND_URL}/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, score: eqScore })
        });
        const top10 = await response.json();
        console.log("ТОП 10 Игроков:", top10);
        return top10;
    } catch (err) {
        console.error("Ошибка лидерборда", err);
        return [];
    }
}

// Отправка комментария
async function submitComment(playerName, commentText) {
    try {
        const response = await fetch(`${BACKEND_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, text: commentText })
        });
        const comments = await response.json();
        console.log("Живые комментарии:", comments);
        return comments;
    } catch (err) {
        console.error("Ошибка отправки комментария", err);
        return [];
    }
}

async function loadComments() {
    try {
        const response = await fetch(`${BACKEND_URL}/comments`);
        const data = await response.json();
        console.log("Комментарии загружены:", data);
        return data;
    } catch (err) {
        console.error("Ошибка загрузки комментариев:", err);
        return [];
    }
}

// Расчет итогового EQ счета
function calculateEQScore() {
    // Формула: (Осознанность + Эмпатия + Мотивация) - Стресс
    return (stats.awareness + stats.empathy + stats.motivation) - stats.stress;
}

// Вызов при переходе к финалу
function triggerFinalActions() {
    const playerName = currentPlayerName || 'Аноним';
    
    if (lastChoice) {
        sendFinalStat(lastChoice);
    }
    submitToLeaderboard(playerName);
    loadComments(); // Теперь эта функция существует
}

// Показываем оверлей и тянем данные
async function showFinalResults() {
    const dialogueBox = document.getElementById('dialogue-box');
    const resultsOverlay = document.getElementById('results-overlay');
    if (dialogueBox) dialogueBox.classList.add('hidden');
    if (resultsOverlay) resultsOverlay.classList.remove('hidden');
    const playerName = currentPlayerName || 'Аноним';
    syncPlayerNameInputs();

    // 1. Отправляем статистику выбора
    if (lastChoice) {
        const stats = await sendFinalStat(lastChoice);
        renderStatsBars(stats);
    }

    await submitToLeaderboard(playerName);

    // 2. Грузим лидерборд
    const lbData = await (await fetch(`${BACKEND_URL}/leaderboard`)).json();
    renderLeaderboard(lbData);

    // 3. Грузим комментарии
    const comments = await (await fetch(`${BACKEND_URL}/comments`)).json();
    renderComments(comments);
}

// Функции отрисовки (Helper functions)
function renderStatsBars(data) {
    const container = document.getElementById('stats-bars');
    if (!container) return; // Ensure the DOM element exists
    container.innerHTML = '';

    // Check if data is missing or empty to prevent the 'reduce' error
    if (!data || !Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div>Статистика недоступна</div>';
        return;
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);
    // Avoid division by zero if total is 0
    if (total === 0) return;

    data.forEach(item => {
        const percent = Math.round((item.count / total) * 100);
        const label = item.choiceId === 'vision' ? 'Путь Видения' : 'Путь Страха';
        container.innerHTML += `<div>${label}: ${percent}% <div class="bar-bg"><div class="bar-fill" style="width:${percent}%; background:#ffcc00"></div></div></div>`;
    });
}

function renderComments(data) {
    const container = document.getElementById('comments-display');
    if (!container) return;
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div class="comment-item">Комментариев пока нет</div>';
        return;
    }
    container.innerHTML = data.map(c => `<div class="comment-item"><strong>${c.name}:</strong> ${c.text}</div>`).join('');
}

async function handleCommentSubmit() {
    const nameEl = document.getElementById('player-name-input');
    const commentEl = document.getElementById('comment-text-input');

    // Check if elements exist before accessing .value
    if (!nameEl || !commentEl) {
        console.error("Required input elements were not found in the DOM.");
        return;
    }

    const name = nameEl.value.trim() || 'Аноним';
    const comment = commentEl.value.trim();
    
    if (!comment) return;

    const updatedComments = await submitComment(name, comment);
    renderComments(updatedComments);
    commentEl.value = '';
}

// Показывает блок с результатами и скрывает игру
function showFinalOverlay() {
    const gameUI = document.getElementById('dialogue-box');
    const resultsUI = document.getElementById('results-overlay');
    
    if (gameUI) gameUI.classList.add('hidden');
    if (resultsUI) resultsUI.classList.remove('hidden');
}

// Обновленная функция рестарта
function restartGame() {
    // Сброс всех характеристик
    stats = {
        stress: 70,
        awareness: 50,
        empathy: 50,
        motivation: 50
    };
    lastChoice = '';
    currentPlayerName = '';
    
    // Переключение экранов
    const resultsOverlay = document.getElementById('results-overlay');
    const dialogueBox = document.getElementById('dialogue-box');
    const nameOverlay = document.getElementById('name-overlay');
    const startNameInput = document.getElementById('start-player-name-input');
    if (resultsOverlay) resultsOverlay.classList.add('hidden');
    if (dialogueBox) dialogueBox.classList.remove('hidden');
    if (nameOverlay) nameOverlay.classList.remove('hidden');
    if (startNameInput) {
        startNameInput.value = '';
        startNameInput.focus();
    }
    
    // Запуск сначала
    updateUI();
    syncPlayerNameInputs();
}

// Ensure this function exists and is spelled correctly
function renderLeaderboard(data) {
    const container = document.getElementById('leaderboard-container');
    if (!container) return;
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div class="lb-entry">Пока нет результатов</div>';
        return;
    }

    container.innerHTML = data.map((entry, index) => `
        <div class="leaderboard-row">
            <span>${index + 1}</span>
            <span>${entry.name}</span>
            <span>${entry.score}</span>
        </div>
    `).join('');
}
