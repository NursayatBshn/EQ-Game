let lastChoice = '';
let currentPlayerName = '';

// Base stats (Side UI) - starting state
let stats = {
    stress: 70,
    awareness: 50,
    empathy: 50,
    motivation: 50
};

// Update the on-screen bars with animation
function updateUI() {
    const types = ['stress', 'awareness', 'empathy', 'motivation'];
    types.forEach(type => {
        const bar = document.getElementById(`bar-${type}`);
        const valText = document.getElementById(`${type}-val`);
        if (bar) bar.style.width = stats[type] + '%';
        if (valText) valText.innerText = stats[type] + '%';

        // Add a pulse effect for high stress
        if (type === 'stress' && stats.stress > 80 && bar) {
            bar.classList.add('stress-warning');
        } else if (type === 'stress' && bar) {
            bar.classList.remove('stress-warning');
        }
    });
}

// === FULL GAME SCRIPT ===
const story = {
    "start": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Nurs (thoughts)",
        text: "This Node.js is going to finish me off...\nWhy is the request returning undefined?",
        choices: [{ text: "Next", next: "scene_1_noise" }]
    },
    
    "scene_1_noise": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Noise from the hallway",
        text: "WHY DID YOU THROW THE FLASH THERE?! PUSH FROM SITE!",
        choices: [{ text: "Next", next: "scene_1_choice" }]
    },
    "scene_1_noise_1": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Nurs (thoughts)",
        text: "There's a bug in the code, I have a discrete math exam tomorrow, and now there's this noise in the hallway...",
        choices: [{ text: "Next", next: "scene_1_choice" }]
    },
    "scene_1_choice": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_angry.png", 
        speaker: "Nurs (thoughts)",
        text: "There's a bug in the code, I have a discrete math exam tomorrow, and now there's this noise in the hallway...",
        choices: [
            { text: "[Aggression] 'QUIET! Have you lost your minds?'", next: "scene_2_1" },
            { text: "[Ignore] Put on headphones and keep going", next: "scene_2_2" },
            { text: "[Handle it calmly] Go out and talk", next: "scene_2_3" }
        ]
    },

    // --- BRANCH 2.1: Aggression ---
    "scene_2_1": {
        bg: "assets/backgrounds/room_alikhan.png", // Neighbor's gaming room
        sprite: "assets/sprites/nurs_angry.png",
        speaker: "Nurs (yelling)",
        text: "QUIET! Have you completely lost your minds? People are trying to sleep, and I have a project to submit! I'll go to the dorm supervisor right now and file a report on all of you!",
        statChanges: { stress: 25, awareness: -30, empathy: -20 },
        choices: [{ text: "Wait for an answer", next: "scene_2_1_reaction" }]
    },
    "scene_2_1_reaction": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/alikhan_angry.png", // Alikhan is irritated/aggressive
        speaker: "Alikhan (roommate)",
        text: "Wow, look who woke up, the class rep. Why do you jump straight to threats? Couldn't you just say it normally?",
        choices: [{ text: "Slam the door and leave", next: "scene_2_1_return" }]
    },
    "scene_2_1_return": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_panic.png", 
        speaker: "Nurs (thoughts)",
        text: "My heart is pounding, my hands are shaking. I yelled, but it didn't make me feel any better. Now I definitely won't be able to focus on the code...",
        choices: [{ text: "Try to keep coding...", next: "scene_3" }]
    },

    // --- BRANCH 2.2: Ignore ---
    "scene_2_2": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Nurs (thoughts)",
        text: "Just ignore it...",
        statChanges: { stress: 15, awareness: -10 },
        choices: [{ text: "10 minutes later...", next: "scene_2_2_thoughts" }]
    },
    "scene_2_2_thoughts": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Nurs (thoughts)",
        text: "Damn, I've read the same line three times. The anger is building up - I can feel myself boiling over.",
        choices: [{ text: "Next", next: "scene_2_2_escalation" }]
    },
    "scene_2_2_escalation": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Alikhan's voice (muffled)",
        text: "YOU RAT! MID RAT! HA-HA-HA!",
        choices: [
            { text: "[Lose it] Storm into the hallway", next: "scene_2_2_angry" },
            { text: "[Give up] I'm too tired...", next: "scene_2_2_1" }
        ]
    },
    "scene_2_2_angry": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/nurs_angry.png",
        speaker: "Nurs (snapping)",
        text: "QUIET! I'll report you to the dorm supervisor if you don't shut up! I thought you'd figure it out yourselves and calm down, but you keep going!",
        statChanges: { stress: 20, awareness: -20 },
        choices: [{ text: "Hear Alikhan out", next: "scene_2_1_reaction" }] // Redirects to the aggression reaction
    },
    "scene_2_2_1": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png", 
        speaker: "Nurs (thoughts)",
        text: "Nothing is going to work anyway... I'm too tired. This code is pointless, I won't pass the exam... My brain just refuses to think. Whatever happens, happens.",
        statChanges: { stress: 20, motivation: -50 }, 
        choices: [{ text: "Close the laptop", next: "scene_3_1" }] 
    },

    // --- BRANCH 2.3: Calm solution (golden path) ---
    "scene_2_3": {
        bg: "assets/backgrounds/room_alikhan.png", // Roommates' room
        sprite: "assets/sprites/nurs_neutral.png", 
        speaker: "Nurs (calmly)",
        text: "Alikhan, hey. You're keeping Maksat awake and making it hard for me to focus on the project. Please put on your headphones - the match won't get any quieter without them.",
        statChanges: { stress: -30, awareness: 30, empathy: 40 },
        choices: [{ text: "See Alikhan's reaction", next: "scene_2_3_reaction" }]
    },
    "scene_2_3_reaction": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/alikhan_guilty.png", // Alikhan feels embarrassed/guilty
        speaker: "Alikhan",
        text: "Oh, sorry, Nurs! We got carried away, seriously. I'll fix it right now.",
        choices: [{ text: "Look over at Maksat", next: "scene_2_3_maksat" }]
    },
    "scene_2_3_maksat": {
        bg: "assets/backgrounds/room_alikhan.png",
        sprite: "assets/sprites/maksat.png", // Maksat is glad he was helped
        speaker: "Maksat (roommate)",
        text: "Thanks, Nurs, you seriously saved my sleep.",
        choices: [{ text: "Go back to your room", next: "scene_2_3_return" }]
    },
    "scene_2_3_return": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_neutral.png", 
        speaker: "Nurs (thoughts)",
        text: "Whew. It worked. The conflict is over, and I can get back to work with a clear head. When you talk to people like a human being, they answer in kind.",
        choices: [{ text: "Sit back down to code", next: "scene_3" }]
    },

    // --- SCENE 3: Internal choice ---
    "scene_3": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Nurs (thoughts)",
        text: "Silence is good. But my eyes are already closing. The deadline is in a couple of hours. If I go to sleep now, I might not wake up in time. If I stay up, I'm afraid I'll make even more logic mistakes. What do I do?",
        choices: [
            { text: "Go to sleep", next: "scene_3_1" },
            { text: "Finish the project", next: "scene_4" }
        ]
    },

    // --- SCENE 3.1: Failure loop (nightmare) ---
    "scene_3_1": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/professor.png", 
        speaker: "Professor",
        text: "Bashan Nursayat, go ahead, run your project. We're waiting.",
        choices: [{ text: "Run the code...", next: "scene_3_1_panic" }]
    },
    "scene_3_1_panic": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/nurs_panic.png", 
        speaker: "Nurs (thoughts)",
        text: "No, no, is that an error?! I should have finished that function...",
        choices: [{ text: "Look at the screen", next: "scene_3_1_fail" }]
    },
    "scene_3_1_fail": {
        bg: "assets/backgrounds/nightmare_aitu.png",
        sprite: "assets/sprites/nurs_panic.png",
        speaker: "System",
        text: "WARNING: YOU LOST YOUR SCHOLARSHIP.",
        statChanges: { stress: 20 },
        choices: [{ text: "NO! (Wake up)", next: "scene_3_1_wakeup" }]
    },
    "scene_3_1_wakeup": {
        bg: "assets/backgrounds/room_dark.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Nurs (waking up)",
        text: "No! It was just a nightmare?.. I can't sleep. I have to keep coding.",
        choices: [{ text: "Open the IDE", next: "scene_4" }] 
    },

    // --- SCENE 4: Final motivation choice ---
    "scene_4": {
        bg: "assets/backgrounds/room_night.png",
        sprite: "assets/sprites/nurs_focus.png",
        speaker: "Nurs (thoughts)",
        text: "Okay, the route errors are fixed. I only need to finish the last data-processing function. But I'm running out of energy...\nI need a reason not to close the laptop right now.",
        choices: [
            { text: "For the scholarship and survival", next: "end_fear" },
            { text: "For my future backend career", next: "end_vision" }
        ]
    },

    // --- ENDING: Fear (scholarship) ---
    "end_fear": {
        bg: "assets/backgrounds/room_parents.png",
        sprite: "assets/sprites/nurs_focus.png",
        speaker: "Nurs (thoughts)",
        text: "Okay, if I fail, there goes the scholarship. I'll have to save on everything again. I'll just finish this piece somehow, as long as the tests pass.",
        statChanges: { stress: 15, motivation: -20 },
        choices: [{ text: "Run the build", next: "end_fear_success" }]
    },
    "end_fear_success": {
        bg: "assets/backgrounds/room_parents.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Terminal",
        text: "> Build finished successfully.\n> Ready for deployment.",
        choices: [{ text: "Submit the project", next: "end_fear_epilogue" }]
    },
    "end_fear_epilogue": {
        bg: "assets/backgrounds/room_parents.png",
        sprite: "assets/sprites/nurs_tired.png",
        speaker: "Nurs",
        text: "Whew. I submitted it. The scholarship is safe. But I feel completely drained. I can't stand looking at code anymore, I just want to faceplant into my pillow... Burnout is close.",
        choices: [{ text: "End game (Start over)", next: "start" }]
    },

    // --- ENDING: Vision (internal motivation) ---
    "end_vision": {
        bg: "assets/backgrounds/room_career.png",
        sprite: "assets/sprites/nurs_focus.png",
        speaker: "Nurs (thoughts)",
        text: "Okay, this bug is good practice. I'll sort out the routes properly - in backend work I'll run into this all the time. I need to do it the right way.",
        statChanges: { stress: -20, motivation: 40 },
        choices: [{ text: "Run the build", next: "end_vision_success" }]
    },
    "end_vision_success": {
        bg: "assets/backgrounds/room_career.png",
        sprite: "assets/sprites/nurs_happy.png",
        speaker: "Terminal",
        text: "> Build finished successfully.\n> Ready for deployment.",
        choices: [{ text: "Submit the project", next: "end_vision_epilogue" }]
    },
    "end_vision_epilogue": {
        bg: "assets/backgrounds/room_career.png",
        sprite: "assets/sprites/nurs_neutral.png",
        speaker: "Nurs",
        text: "Nice, it went through. I'm tired, sure, but the code turned out solid. At least now I actually understand how this logic works under the hood.",
        choices: [{ text: "End game (Start over)", next: "start" }]
    }
};

// Render a scene
function renderScene(sceneId) {
    const scene = story[sceneId];
    if (!scene) return;

    // Save the choice for statistics
    if (sceneId === 'end_fear') lastChoice = 'fear';
    if (sceneId === 'end_vision') lastChoice = 'vision';
    
    // If we reached an epilogue, trigger the final results flow
    if (sceneId === 'end_fear_epilogue' || sceneId === 'end_vision_epilogue') {
        // Give the player 2 seconds to finish reading, then show the results
        setTimeout(() => {
            showFinalResults();
        }, 2000);
    }

    // Sprite and fade-in animation
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

    // Text
    const speakerEl = document.getElementById('speaker-name');
    const textEl = document.getElementById('dialogue-text');
    if (speakerEl) speakerEl.innerText = scene.speaker;
    if (textEl) textEl.innerText = scene.text;

    // Stats
    if (scene.statChanges) {
        for (let key in scene.statChanges) {
            stats[key] = Math.max(0, Math.min(100, stats[key] + scene.statChanges[key]));
        }
        updateUI();
    }

    // Choice buttons
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
    currentPlayerName = enteredName || 'Anonymous';

    const nameOverlay = document.getElementById('name-overlay');
    if (nameOverlay) {
        nameOverlay.classList.add('hidden');
    }

    syncPlayerNameInputs();
    renderScene("start");
    updateUI();
}

// Game start
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

// Future backend URL on Render (localhost can still be used for testing)
const BACKEND_URL = 'https://eq-game-tb0x.onrender.com/api';

// Send final choice statistics
async function sendFinalStat(choice) {
    try {
        const response = await fetch(`${BACKEND_URL}/stats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ choiceId: choice })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Statistics received:', data);
        return data;
    } catch (err) {
        console.error('Failed to send statistics:', err.message);
        return [];
    }
}

// Submit the result to the leaderboard
async function submitToLeaderboard(playerName) {
    // Calculate the final EQ score
    const eqScore = (stats.awareness + stats.empathy + stats.motivation) - stats.stress;
    
    try {
        const response = await fetch(`${BACKEND_URL}/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, score: eqScore })
        });
        const top10 = await response.json();
        console.log('Top 10 players:', top10);
        return top10;
    } catch (err) {
        console.error('Leaderboard error', err);
        return [];
    }
}

// Submit a comment
async function submitComment(playerName, commentText) {
    try {
        const response = await fetch(`${BACKEND_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, text: commentText })
        });
        const comments = await response.json();
        console.log('Live comments:', comments);
        return comments;
    } catch (err) {
        console.error('Comment submission error', err);
        return [];
    }
}

async function loadComments() {
    try {
        const response = await fetch(`${BACKEND_URL}/comments`);
        const data = await response.json();
        console.log('Comments loaded:', data);
        return data;
    } catch (err) {
        console.error('Comment loading error:', err);
        return [];
    }
}

// Calculate the final EQ score
function calculateEQScore() {
    // Formula: (Awareness + Empathy + Motivation) - Stress
    return (stats.awareness + stats.empathy + stats.motivation) - stats.stress;
}

// Trigger final actions
function triggerFinalActions() {
    const playerName = currentPlayerName || 'Anonymous';
    
    if (lastChoice) {
        sendFinalStat(lastChoice);
    }
    submitToLeaderboard(playerName);
    loadComments(); // This function now exists
}

// Show the overlay and fetch data
async function showFinalResults() {
    const dialogueBox = document.getElementById('dialogue-box');
    const resultsOverlay = document.getElementById('results-overlay');
    if (dialogueBox) dialogueBox.classList.add('hidden');
    if (resultsOverlay) resultsOverlay.classList.remove('hidden');
    const playerName = currentPlayerName || 'Anonymous';
    syncPlayerNameInputs();

    // 1. Send choice statistics
    if (lastChoice) {
        const stats = await sendFinalStat(lastChoice);
        renderStatsBars(stats);
    }

    await submitToLeaderboard(playerName);

    // 2. Load the leaderboard
    const lbData = await (await fetch(`${BACKEND_URL}/leaderboard`)).json();
    renderLeaderboard(lbData);

    // 3. Load comments
    const comments = await (await fetch(`${BACKEND_URL}/comments`)).json();
    renderComments(comments);
}

// Render helpers
function renderStatsBars(data) {
    const container = document.getElementById('stats-bars');
    if (!container) return; // Ensure the DOM element exists
    container.innerHTML = '';

    // Check if data is missing or empty to prevent the 'reduce' error
    if (!data || !Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div>Statistics unavailable</div>';
        return;
    }

    const total = data.reduce((sum, item) => sum + item.count, 0);
    // Avoid division by zero if total is 0
    if (total === 0) return;

    data.forEach(item => {
        const percent = Math.round((item.count / total) * 100);
        const label = item.choiceId === 'vision' ? 'Vision Path' : 'Fear Path';
        container.innerHTML += `<div>${label}: ${percent}% <div class="bar-bg"><div class="bar-fill" style="width:${percent}%; background:#ffcc00"></div></div></div>`;
    });
}

function renderComments(data) {
    const container = document.getElementById('comments-display');
    if (!container) return;
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div class="comment-item">No comments yet</div>';
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

    const name = nameEl.value.trim() || 'Anonymous';
    const comment = commentEl.value.trim();
    
    if (!comment) return;

    const updatedComments = await submitComment(name, comment);
    renderComments(updatedComments);
    commentEl.value = '';
}

// Show the results block and hide the game
function showFinalOverlay() {
    const gameUI = document.getElementById('dialogue-box');
    const resultsUI = document.getElementById('results-overlay');
    
    if (gameUI) gameUI.classList.add('hidden');
    if (resultsUI) resultsUI.classList.remove('hidden');
}

// Updated restart function
function restartGame() {
    // Reset all stats
    stats = {
        stress: 70,
        awareness: 50,
        empathy: 50,
        motivation: 50
    };
    lastChoice = '';
    currentPlayerName = '';
    
    // Switch screens
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
    
    // Start over
    updateUI();
    syncPlayerNameInputs();
}

// Ensure this function exists and is spelled correctly
function renderLeaderboard(data) {
    const container = document.getElementById('leaderboard-container');
    if (!container) return;
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div class="lb-entry">No results yet</div>';
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
