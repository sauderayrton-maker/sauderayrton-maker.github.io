// ============================================================
// VIBE CODE OS — app.js
// ============================================================

// ── API KEYS ─────────────────────────────────────────────────
const API_KEYS = {
    claude: '',   // https://console.anthropic.com/
    gemini: '',   // https://aistudio.google.com/app/apikey
    gpt:    '',   // https://platform.openai.com/api-keys
};

// ── AI config ────────────────────────────────────────────────
const AI_CONFIG = {
    claude: { label: 'Claude',  color: '#D97757' },
    gemini: { label: 'Gemini',  color: '#4285F4' },
    gpt:    { label: 'GPT-4o',  color: '#10A37F' },
};

let currentModel = 'claude';
let chatHistory  = [];

// ============================================================
// DOCK
// ============================================================
function togglePanel(panelId, dockId) {
    document.getElementById(panelId).classList.toggle('hidden');
    document.getElementById(dockId).classList.toggle('visible');
}

// ============================================================
// CLOCK
// ============================================================
function updateClock() {
    const now = new Date();
    let h = now.getHours() % 12 || 12;
    const m = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock-time').textContent = `${h}:${m}`;

    const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    document.getElementById('clock-date').textContent =
        `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`;
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
// TIMER
// ============================================================
let timerSecs = 0, timerMax = 25 * 60, timerRunning = false, timerInterval = null;

function setTimerPreset(secs) {
    resetTimer();
    timerMax = secs;
    timerSecs = secs;
    updateTimerDisplay();
}

function toggleTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        timerInterval = null;
        document.getElementById('timer-start-btn').textContent = 'Resume';
        document.getElementById('timer-display').classList.remove('running');
    } else {
        if (timerSecs === 0) timerSecs = timerMax;
        timerRunning = true;
        document.getElementById('timer-start-btn').textContent = 'Pause';
        document.getElementById('timer-display').classList.add('running');
        timerInterval = setInterval(() => {
            if (timerSecs <= 0) { resetTimer(); return; }
            timerSecs--;
            updateTimerDisplay();
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning  = false;
    timerSecs     = 0;
    document.getElementById('timer-start-btn').textContent = 'Start';
    document.getElementById('timer-display').classList.remove('running');
    updateTimerDisplay();
    document.getElementById('timer-bar').style.width = '0%';
}

function updateTimerDisplay() {
    const m = Math.floor(timerSecs / 60).toString().padStart(2, '0');
    const s = (timerSecs % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').textContent = `${m}:${s}`;
    const pct = timerMax > 0 ? ((timerMax - timerSecs) / timerMax * 100) : 0;
    document.getElementById('timer-bar').style.width = pct + '%';
}

// ============================================================
// TASKS
// ============================================================
let tasks = JSON.parse(localStorage.getItem('vibe_tasks') || '[]');

function saveTasks()  { localStorage.setItem('vibe_tasks', JSON.stringify(tasks)); }
function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach((task, i) => {
        const item = document.createElement('div');
        item.className = `task-item${task.done ? ' done' : ''}`;
        item.innerHTML = `
            <div class="task-check" onclick="toggleTask(${i})">${task.done ? '✓' : ''}</div>
            <div class="task-text">${escapeHtml(task.text)}</div>
            <button class="task-del" onclick="deleteTask(${i})">×</button>`;
        list.appendChild(item);
    });
}

function addTask() {
    const input = document.getElementById('task-input');
    const text  = input.value.trim();
    if (!text) return;
    tasks.unshift({ text, done: false });
    input.value = '';
    saveTasks();
    renderTasks();
}

function toggleTask(i) { tasks[i].done = !tasks[i].done; saveTasks(); renderTasks(); }
function deleteTask(i) { tasks.splice(i, 1); saveTasks(); renderTasks(); }
function handleTaskKey(e) { if (e.key === 'Enter') addTask(); }

renderTasks();

// ============================================================
// EDITOR / SCRATCHPAD
// ============================================================
const editorEl = document.getElementById('editor-area');

editorEl.addEventListener('input', function () {
    const words = this.value.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById('editor-wc').textContent = `${words} word${words !== 1 ? 's' : ''}`;
    localStorage.setItem('vibe_editor', this.value);
});

const savedText = localStorage.getItem('vibe_editor');
if (savedText) {
    editorEl.value = savedText;
    const words = savedText.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById('editor-wc').textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

// ============================================================
// GITHUB CONTRIBUTION GRID
// ============================================================
function buildContribGrid() {
    const grid  = document.getElementById('contrib-grid');
    const cells = 7 * 26;
    let weekCommits = 0;

    for (let i = 0; i < cells; i++) {
        const cell     = document.createElement('div');
        const isRecent = i > cells - 8;
        const r        = Math.random();
        const level    = r < 0.45 ? 0 : r < 0.65 ? 1 : r < 0.80 ? 2 : r < 0.92 ? 3 : 4;
        if (isRecent && level > 0) weekCommits += level;
        cell.className = `contrib-cell contrib-${level}`;
        grid.appendChild(cell);
    }
    document.getElementById('commit-count').textContent = weekCommits;
}
buildContribGrid();

// ============================================================
// AI CHAT — helpers
// ============================================================
function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function appendMessage(role, content, model) {
    const body   = document.getElementById('chat-body');
    const m      = model || currentModel;
    const sender = role === 'user' ? 'you' : AI_CONFIG[m].label.toLowerCase();
    const style  = role === 'ai'   ? `color:${AI_CONFIG[m].color}` : '';

    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg ${role}`;
    wrapper.innerHTML = `
        <div class="chat-sender" style="${style}">${sender}</div>
        <div class="chat-bubble">${escHtml(content).replace(/\n/g, '<br>')}</div>`;
    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;
}

function appendThinking() {
    const body    = document.getElementById('chat-body');
    const m       = currentModel;
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg ai';
    wrapper.id = 'thinking-indicator';
    wrapper.innerHTML = `
        <div class="chat-sender" style="color:${AI_CONFIG[m].color}">${AI_CONFIG[m].label.toLowerCase()}</div>
        <div class="chat-bubble thinking-dots"><span>•</span><span>•</span><span>•</span></div>`;
    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;
}

function removeThinking() {
    document.getElementById('thinking-indicator')?.remove();
}

function switchAI(model, btn) {
    currentModel = model;
    document.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ============================================================
// AI CHAT — API callers
// ============================================================
async function callClaude(messages) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: 'You are a focused AI assistant in "vibe code", a developer productivity OS. Be concise and helpful.',
            messages,
        }),
    });
    if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
    const d = await res.json();
    return d.content?.map(b => b.text || '').join('') || '(empty)';
}

async function callGemini(messages) {
    const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEYS.gemini}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: 'You are a focused AI assistant in "vibe code", a developer productivity OS. Be concise and helpful.' }] },
            contents,
            generationConfig: { maxOutputTokens: 1024 },
        }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const d = await res.json();
    return d.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '(empty)';
}

async function callGPT(messages) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEYS.gpt}` },
        body: JSON.stringify({
            model: 'gpt-4o',
            max_tokens: 1024,
            messages: [
                { role: 'system', content: 'You are a focused AI assistant in "vibe code", a developer productivity OS. Be concise and helpful.' },
                ...messages,
            ],
        }),
    });
    if (!res.ok) throw new Error(`GPT ${res.status}: ${await res.text()}`);
    const d = await res.json();
    return d.choices?.[0]?.message?.content || '(empty)';
}

// ============================================================
// AI CHAT — send
// ============================================================
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text  = input.value.trim();
    if (!text) return;

    if (!API_KEYS[currentModel]) {
        appendMessage('ai',
            `⚠️ No API key for ${AI_CONFIG[currentModel].label}. Add it to API_KEYS at the top of app.js.`,
            currentModel);
        return;
    }

    appendMessage('user', text);
    input.value = '';
    input.style.height = '';
    chatHistory.push({ role: 'user', content: text });

    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    appendThinking();

    try {
        let reply;
        if      (currentModel === 'claude') reply = await callClaude(chatHistory);
        else if (currentModel === 'gemini') reply = await callGemini(chatHistory);
        else                                reply = await callGPT(chatHistory);

        removeThinking();
        chatHistory.push({ role: 'assistant', content: reply });
        appendMessage('ai', reply);
    } catch (err) {
        removeThinking();
        appendMessage('ai', `❌ ${err.message}`, currentModel);
        console.error(err);
    } finally {
        sendBtn.disabled = false;
    }
}

function handleChatKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ── Initial welcome message ──────────────────────────────────
appendMessage('ai',
    "Hey! I'm Claude. Add your API keys at the top of app.js to unlock Gemini and GPT-4o too.",
    'claude');
