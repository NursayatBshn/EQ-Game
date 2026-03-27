// Базовые характеристики (Side UI)
let stats = {
    stress: 70,
    awareness: 50,
    empathy: 50,
    motivation: 50
};

// Функция обновления шкал на экране
function updateUI() {
    document.getElementById('bar-stress').style.width = stats.stress + '%';
    document.getElementById('bar-awareness').style.width = stats.awareness + '%';
    document.getElementById('bar-empathy').style.width = stats.empathy + '%';
    document.getElementById('bar-motivation').style.width = stats.motivation + '%';
}

// Сценарий игры (на основе нашего сюжета)
const story = {
    "start": {
        bg: "assets/backgrounds/room_night.png", // Замени на имена своих файлов
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "«Опять... Response: undefined. Как? Я же прописал все роуты. Этот Node.js меня доконает...»",
        choices: [
            { text: "Далее", next: "scene_1_noise" }
        ]
    },
    "scene_1_noise": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Шум из коридора (Алихан)",
        text: "«ДА КУДА ТЫ ФЛЕШКУ КИДАЕШЬ?! ЗАХОДИ С ПЛАНТА!»",
        choices: [
            { text: "Далее", next: "scene_1_choice" }
        ]
    },
    "scene_1_choice": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_angry.png", // Спрайт раздражения
        speaker: "Нурс (мысли)",
        text: "«Уровень стресса уже в 'красной зоне'. Если я сейчас не приму решение, мой мозг просто выдаст System Crash».",
        choices: [
            { text: "[Агрессия] 'ТИХО! Вы что, совесть потеряли?'", next: "scene_2_1" },
            { text: "[Игнор] Надеть наушники и продолжить", next: "scene_2_2" },
            { text: "[Спокойно решить] Выйти и поговорить", next: "scene_2_3" }
        ]
    },
    // Ветка 2.1: Агрессия
    "scene_2_1": {
        bg: "assets/backgrounds/corridor.png",
        sprite: "assets/sprites/nurs_angry.png",
        speaker: "Нурс (крича)",
        text: "«ТИХО! Вы что, вообще совесть потеряли? Люди спят, а мне проект сдавать! Я сейчас коменданту пойду!»",
        statChanges: { stress: 25, awareness: -30, empathy: -20 },
        choices: [
            { text: "Слушать ответ Алихана", next: "scene_2_1_reaction" }
        ]
    },
    "scene_2_1_reaction": {
        bg: "assets/backgrounds/corridor.png",
        sprite: "assets/sprites/alikhan.png", // Спрайт соседа
        speaker: "Алихан (сосед)",
        text: "«Ой, гляньте, староста проснулся. Че ты сразу угрожать начинаешь? Сказать нормально нельзя было?»",
        choices: [
            { text: "Вернуться в комнату", next: "scene_3_heavy" }
        ]
    },
    // Ветка 2.2: Игнор
    "scene_2_2": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "«Просто игнорируй... Черт, я три раза перечитал одну и ту же строчку. Злость копится...»",
        statChanges: { stress: 15, awareness: -10 },
        choices: [
            { text: "Прошло 10 минут...", next: "scene_2_2_escalation" }
        ]
    },
    "scene_2_2_escalation": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Голос Алихана (приглушенно)",
        text: "«ДА ТЫ КРЫСА! ХА-ХА-ХА!»",
        choices: [
            { text: "[Сорваться] Вылететь в коридор", next: "scene_2_1" },
            { text: "[Сдаться] Я слишком устал...", next: "scene_2_2_1" }
        ]
    },
    "scene_2_2_1": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "«Всё равно ничего не получится... Этот код бессмысленен. Мозг просто отказывается думать. Будь что будет.»",
        statChanges: { stress: 20, motivation: -50 }, // Критическое падение
        choices: [
            { text: "Закрыть ноутбук", next: "scene_3_1" } // Сразу ведет к кошмару
        ]
    },
    // Ветка 2.3: Спокойствие
    "scene_2_3": {
        bg: "assets/backgrounds/corridor.png",
        sprite: "assets/sprites/nurs_neutral.png",
        speaker: "Нурс (спокойно)",
        text: "«Алихан, привет. Слушай, мешаешь Максату спать, а мне сосредоточиться. Надень наушники, пожалуйста.»",
        statChanges: { stress: -30, awareness: 30, empathy: 40 },
        choices: [
            { text: "Смотреть реакцию", next: "scene_2_3_reaction" }
        ]
    },
    "scene_2_3_reaction": {
        bg: "assets/backgrounds/corridor.png",
        sprite: "assets/sprites/maksat.png",
        speaker: "Максат (сосед)",
        text: "«Рахмет, Нурс, реально спас мой сон...»",
        choices: [
            { text: "Вернуться к работе", next: "scene_3" }
        ]
    },
    // Сцена 3: Внутренний выбор
    "scene_3": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "«Тишина — это хорошо. Но глаза слипаются. До дедлайна пара часов. Что делать?»",
        choices: [
            { text: "Лечь спать (Положиться на удачу)", next: "scene_3_1" },
            { text: "Завершить проект (Финальный рывок)", next: "scene_4" }
        ]
    },
    "scene_3_heavy": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Нурс (мысли)",
        text: "«Сердце колотится после ссоры. Энергии ноль. Если лягу сейчас — могу не проснуться. Если останусь — наделаю ошибок.»",
        choices: [
            { text: "Лечь спать", next: "scene_3_1" },
            { text: "Попробовать завершить проект", next: "scene_4" }
        ]
    },
    // Сцена 3.1: Кошмар
    "scene_3_1": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/professor.png",
        speaker: "Преподаватель",
        text: "«Башан Нурсаят, давайте, запускайте ваш проект. Мы ждем.»",
        choices: [
            { text: "Запустить код...", next: "scene_3_1_fail" }
        ]
    },
    "scene_3_1_fail": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/nurs_panic.png",
        speaker: "Система",
        text: "ВНИМАНИЕ: ОШИБКА КОДА. ВЫ ПОТЕРЯЛИ СТИПЕНДИЮ.",
        choices: [
            { text: "Проснуться в холодном поту!", next: "scene_3" } // Возврат к выбору
        ]
    },
    // Сцена 4: Финальный выбор
    "scene_4": {
        bg: "assets/backgrounds/room_dawn.png",
        sprite: "assets/sprites/nurs_focus.png",
        speaker: "Нурс (мысли)",
        text: "«Осталось дописать последнюю функцию. Силы на исходе. Нужно найти причину, чтобы не закрыть ноутбук прямо сейчас.»",
        choices: [
            { text: "[Страх] Сделать это ради сохранения стипендии", next: "end_fear" },
            { text: "[Видение] Сделать это, чтобы стать крутым разработчиком", next: "end_vision" }
        ]
    },
    "end_fear": {
        bg: "assets/backgrounds/room_parents.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Итог",
        text: "Проект готов. Нурс сохранил стипендию, но чувствует себя полностью выгоревшим и опустошенным. Работа на страхе не длится вечно.",
        statChanges: { stress: 15, motivation: 20 },
        choices: [
            { text: "Конец игры", next: "start" }
        ]
    },
    "end_vision": {
        bg: "assets/backgrounds/room_career.png",
        sprite: "assets/sprites/nurs_happy.png",
        speaker: "Итог",
        text: "Билд успешен! Нурс чувствует профессиональный подъем. Каждая решенная задача делает его на шаг ближе к мечте. EQ помог ему сохранить фокус.",
        statChanges: { stress: -20, motivation: 50 },
        choices: [
            { text: "Конец игры", next: "start" }
        ]
    }
};

// Функция отрисовки сцены
function renderScene(sceneId) {
    const scene = story[sceneId];
    
    // Обновляем фон и спрайт (если указаны заглушки, они не сломают код, просто будет пустое место)
    if (scene.bg) {
        document.getElementById('background').style.backgroundImage = `url('${scene.bg}')`;
    }
    if (scene.sprite) {
        document.getElementById('character').src = scene.sprite;
    }

    // Обновляем текст
    document.getElementById('speaker-name').innerText = scene.speaker;
    document.getElementById('dialogue-text').innerText = scene.text;

    // Обновляем статы, если они меняются в этой сцене
    if (scene.statChanges) {
        for (let key in scene.statChanges) {
            stats[key] += scene.statChanges[key];
            // Ограничиваем значения от 0 до 100
            if (stats[key] > 100) stats[key] = 100;
            if (stats[key] < 0) stats[key] = 0;
        }
        updateUI();
    }

    // Рендерим кнопки выбора
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = ''; // Очищаем старые кнопки
    
    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = choice.text;
        btn.onclick = () => renderScene(choice.next);
        choicesContainer.appendChild(btn);
    });
}

// Запуск игры
updateUI();
renderScene("start");