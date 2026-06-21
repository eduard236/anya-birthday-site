// ============================================================
// 1. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК И ПРОГРЕСС (5 шагов)
// ============================================================
const tabs = document.querySelectorAll('.tab-btn');
const panes = document.querySelectorAll('.tab-pane');
const steps = document.querySelectorAll('.step');

const EXPECTED_WORDS = ['СВОБОДА', 'КЛЮЧ', 'ПОБЕДА', 'СЕРДЦЕ'];
let collectedWords = [null, null, null, null];
let questCompleted = [false, false, false, false];

function updateProgress() {
    steps.forEach((step, idx) => {
        step.classList.remove('done', 'active-step');
        if (idx < 4 && questCompleted[idx]) {
            step.classList.add('done');
        } else if (idx === 4 && questCompleted.every(v => v === true)) {
            step.classList.add('done');
        }
    });
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabId = activeTab.dataset.tab;
        const idx = parseInt(tabId.replace('tab', '')) - 1;
        if (idx >= 0 && idx < 5) {
            steps[idx].classList.add('active-step');
        }
    }
}

tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panes.forEach(p => p.classList.remove('active'));
        document.getElementById(btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'tab3') stopTitanGame();
        updateProgress();
    });
});

// ============================================================
// 2. КВЕСТ 1: ВИКТОРИНА (8 вопросов)
// ============================================================
const quizData = [
    { question: 'Кто уничтожил стену Мария?', options: ['Эрен Йегер', 'Берторд Гувер', 'Райнер Браун', 'Ксавер'], correct: 1 },
    { question: 'Как называется титан, в которого превращается Эрен?', options: ['Атакующий титан', 'Колоссальный титан', 'Бронированный титан', 'Титан-прародитель'], correct: 0 },
    { question: 'Сколько лет Ане исполняется сегодня?', options: ['25', '26', '27', '28'], correct: 1 },
    { question: 'Какое имя носит Разведкорпус в оригинале?', options: ['Survey Corps', 'Scout Regiment', 'Recon Corps', 'Все вышеперечисленные'], correct: 3 },
    { question: 'Кто является капитаном Разведкорпуса?', options: ['Эрен', 'Леви', 'Микаса', 'Армин'], correct: 1 },
    { question: 'Как зовут лучшую подругу Эрена?', options: ['Микаса', 'Саша', 'Хистория', 'Энни'], correct: 0 },
    { question: 'Какая стена была разрушена первой?', options: ['Мария', 'Роза', 'Шина', 'Все сразу'], correct: 0 },
    { question: 'Кто предал человечество, став титаном?', options: ['Эрен', 'Армин', 'Райнер', 'Леви'], correct: 2 }
];

let currentQ = 0;
let quizCompleted = false;

function renderQuestion() {
    if (currentQ >= quizData.length) {
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('quizFinal').style.display = 'block';
        generateCandles('candles1');
        quizCompleted = true;
        if (!questCompleted[0]) {
            questCompleted[0] = true;
            collectedWords[0] = EXPECTED_WORDS[0];
            updateProgress();
            document.getElementById('word1').textContent = EXPECTED_WORDS[0];
        }
        return;
    }
    const q = quizData[currentQ];
    document.getElementById('qNum').textContent = currentQ + 1;
    document.getElementById('questionText').textContent = q.question;
    const progress = (currentQ / quizData.length) * 100;
    document.getElementById('quizProgressFill').style.width = progress + '%';
    document.getElementById('quizProgressText').textContent = Math.round(progress) + '%';

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    const feedback = document.getElementById('quizFeedback');
    feedback.textContent = '';
    feedback.className = 'feedback';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.dataset.idx = idx;
        btn.addEventListener('click', () => handleQuizAnswer(idx, btn));
        container.appendChild(btn);
    });
}

function handleQuizAnswer(selected, btnEl) {
    if (quizCompleted) return;
    const q = quizData[currentQ];
    const correct = q.correct;
    const allBtns = document.querySelectorAll('#optionsContainer .quiz-option');
    allBtns.forEach(b => b.disabled = true);

    if (selected === correct) {
        btnEl.classList.add('correct');
        document.getElementById('quizFeedback').textContent = '✅ Верно! Идём дальше.';
        document.getElementById('quizFeedback').className = 'feedback success';
        setTimeout(() => {
            currentQ++;
            renderQuestion();
        }, 800);
    } else {
        btnEl.classList.add('wrong');
        document.getElementById('quizFeedback').textContent = '❌ Неверно, попробуй ещё раз!';
        document.getElementById('quizFeedback').className = 'feedback error';
        setTimeout(() => {
            allBtns.forEach(b => b.disabled = false);
            btnEl.classList.remove('wrong');
        }, 1000);
    }
}

renderQuestion();

// ============================================================
// 3. КВЕСТ 2: НАЙДИ КЛЮЧ (30 предметов с уникальными подсказками)
// ============================================================
const itemsData = [
    { id: 0, name: 'Камень', icon: '🪨', isKey: false, hint: 'Ключ не может быть в камне – он слишком твёрдый.' },
    { id: 1, name: 'Трава', icon: '🌿', isKey: false, hint: 'В траве ключ не спрятать – она слишком тонкая.' },
    { id: 2, name: 'Ящик', icon: '📦', isKey: true, hint: '' },
    { id: 3, name: 'Костёр', icon: '🔥', isKey: false, hint: 'Ключ сгорит в огне – ищи что-то попрохладнее.' },
    { id: 4, name: 'Бочка', icon: '🛢️', isKey: false, hint: 'В бочке слишком темно – ключа там точно нет.' },
    { id: 5, name: 'Книга', icon: '📖', isKey: false, hint: 'Ключ не в книге – это не сказка.' },
    { id: 6, name: 'Меч', icon: '⚔️', isKey: false, hint: 'На мече нет ключа – он не для замков, а для битв.' },
    { id: 7, name: 'Щит', icon: '🛡️', isKey: false, hint: 'За щитом ничего нет – только защита.' },
    { id: 8, name: 'Лук', icon: '🏹', isKey: false, hint: 'Ключ не в луке – стрелы не помогут.' },
    { id: 9, name: 'Шлем', icon: '⛑️', isKey: false, hint: 'В шлеме пусто – как в голове у неосторожного солдата.' },
    { id: 10, name: 'Факел', icon: '🔦', isKey: false, hint: 'Факел не подходит – ключ не любит жару.' },
    { id: 11, name: 'Ведро', icon: '🪣', isKey: false, hint: 'В ведре ничего нет – только вода (если есть).' },
    { id: 12, name: 'Кольцо', icon: '💍', isKey: false, hint: 'Ключ не в кольце – это не Средиземье.' },
    { id: 13, name: 'Сундук', icon: '🧰', isKey: false, hint: 'В сундуке пусто – кто-то уже всё забрал.' },
    { id: 14, name: 'Лопата', icon: '⛏️', isKey: false, hint: 'Под лопатой ничего нет – копай глубже в другом месте.' },
    { id: 15, name: 'Кирка', icon: '⛏️', isKey: false, hint: 'Кирка не подходит – она для скал, а не для замков.' },
    { id: 16, name: 'Виноград', icon: '🍇', isKey: false, hint: 'Виноград не прячет ключ – он слишком сладкий.' },
    { id: 17, name: 'Молот', icon: '🔨', isKey: false, hint: 'Молот не ключ – он слишком тяжёлый.' },
    { id: 18, name: 'Гвоздь', icon: '📌', isKey: false, hint: 'Гвоздь слишком маленький – ключ побольше.' },
    { id: 19, name: 'Верёвка', icon: '🪢', isKey: false, hint: 'Верёвка не подходит – она гнётся, а ключ должен быть твёрдым.' },
    { id: 20, name: 'Перо', icon: '🪶', isKey: false, hint: 'Перо слишком лёгкое – ключ тяжёлый.' },
    { id: 21, name: 'Зеркало', icon: '🪞', isKey: false, hint: 'Зеркало не хранит ключ – оно только отражает.' },
    { id: 22, name: 'Шкатулка', icon: '📿', isKey: false, hint: 'Шкатулка пуста – внутри ничего нет.' },
    { id: 23, name: 'Флейта', icon: '🎵', isKey: false, hint: 'Флейта не подходит – это музыка, а не замок.' },
    { id: 24, name: 'Часы', icon: '🕰️', isKey: false, hint: 'В часах нет ключа – время не поможет.' },
    { id: 25, name: 'Зонт', icon: '☂️', isKey: false, hint: 'Зонт не подходит – он от дождя, а не от дверей.' },
    { id: 26, name: 'Свеча', icon: '🕯️', isKey: false, hint: 'Свеча не хранит ключ – она тает.' },
    { id: 27, name: 'Мяч', icon: '⚽', isKey: false, hint: 'В мяче ничего нет – он пустой.' },
    { id: 28, name: 'Кубок', icon: '🏆', isKey: false, hint: 'Кубок пуст – победа не в нём.' },
    { id: 29, name: 'Фонарь', icon: '🏮', isKey: false, hint: 'В фонаре ничего нет – только свет.' }
];

let keyFound = false;
let attempts = 0;
const MAX_ATTEMPTS = 5;
let hintGiven = false;

function renderItems() {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = '';
    const shuffled = [...itemsData].sort(() => Math.random() - 0.5);
    shuffled.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.dataset.id = item.id;
        div.innerHTML = `<span class="item-icon">${item.icon}</span>${item.name}`;
        div.addEventListener('click', () => handleItemClick(div, item));
        grid.appendChild(div);
    });
    const feedback = document.getElementById('keyFeedback');
    feedback.textContent = `Попыток: ${attempts}`;
    feedback.className = 'feedback';
}

function handleItemClick(el, item) {
    if (keyFound) return;
    if (item.isKey) {
        el.classList.add('found');
        document.getElementById('keyFeedback').textContent = `🔑 Ты нашла ключ! (попыток: ${attempts+1}) Сундук открывается...`;
        document.getElementById('keyFeedback').className = 'feedback success';
        keyFound = true;
        setTimeout(() => {
            document.getElementById('itemsGrid').style.display = 'none';
            document.getElementById('keyFinal').style.display = 'block';
            generateCandles('candles2');
            if (!questCompleted[1]) {
                questCompleted[1] = true;
                collectedWords[1] = EXPECTED_WORDS[1];
                updateProgress();
                document.getElementById('word2').textContent = EXPECTED_WORDS[1];
            }
        }, 800);
    } else {
        attempts++;
        el.classList.add('wrong-item');
        playWrongSound();
        let hintText = item.hint || 'Это не ключ. Попробуй другой предмет.';
        document.getElementById('keyFeedback').textContent = `❌ ${hintText} (попыток: ${attempts})`;
        document.getElementById('keyFeedback').className = 'feedback error';
        
        if (attempts >= MAX_ATTEMPTS && !hintGiven) {
            hintGiven = true;
            const itemsGrid = document.getElementById('itemsGrid');
            const allItems = itemsGrid.querySelectorAll('.item');
            allItems.forEach(el => {
                const id = parseInt(el.dataset.id);
                if (itemsData.find(it => it.id === id && it.isKey)) {
                    el.classList.add('hint');
                }
            });
            document.getElementById('keyFeedback').textContent += ' 💡 Подсказка: ключ спрятан в деревянном предмете!';
        }
        setTimeout(() => {
            el.classList.remove('wrong-item');
        }, 600);
    }
}

function playWrongSound() {
    try {
        if (!window.audioCtxWrong) window.audioCtxWrong = new (window.AudioContext || window.webkitAudioContext)();
        const osc = window.audioCtxWrong.createOscillator();
        const gain = window.audioCtxWrong.createGain();
        osc.connect(gain);
        gain.connect(window.audioCtxWrong.destination);
        osc.frequency.value = 200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.15, window.audioCtxWrong.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, window.audioCtxWrong.currentTime + 0.3);
        osc.start();
        osc.stop(window.audioCtxWrong.currentTime + 0.3);
    } catch(e) {}
}

renderItems();

// ============================================================
// 4. КВЕСТ 3: ПОЙМАЙ ТИТАНА
// ============================================================
let titanTimer = null;
let gameRunning = false;
let timeLeft = 30;
let hits = 0;
const MAX_HITS = 26;
const MAX_TIME = 30;

const titanEl = document.getElementById('titan');
const titanArea = document.getElementById('titanArea');
const timerDisplay = document.getElementById('timerDisplay');
const hitDisplay = document.getElementById('hitCount');
const gameFeedback = document.getElementById('gameFeedback');
const gameFinal = document.getElementById('gameFinal');
const startBtn = document.getElementById('startGameBtn');

function playHitSound() {
    try {
        if (!window.audioCtxHit) window.audioCtxHit = new (window.AudioContext || window.webkitAudioContext)();
        const osc = window.audioCtxHit.createOscillator();
        const gain = window.audioCtxHit.createGain();
        osc.connect(gain);
        gain.connect(window.audioCtxHit.destination);
        osc.frequency.value = 800 + Math.random() * 400;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.1, window.audioCtxHit.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, window.audioCtxHit.currentTime + 0.2);
        osc.start();
        osc.stop(window.audioCtxHit.currentTime + 0.2);
    } catch(e) {}
}

function getRandomPosition() {
    const titanSize = 70;
    const maxX = titanArea.clientWidth - titanSize - 10;
    const maxY = titanArea.clientHeight - titanSize - 10;
    const x = Math.max(10, Math.floor(Math.random() * maxX));
    const y = Math.max(10, Math.floor(Math.random() * maxY));
    return { x, y };
}

function moveTitan() {
    if (!gameRunning) return;
    const pos = getRandomPosition();
    titanEl.style.left = pos.x + 'px';
    titanEl.style.top = pos.y + 'px';
}

function startTitanGame() {
    if (gameRunning) return;
    stopTitanGame();
    gameRunning = true;
    timeLeft = MAX_TIME;
    hits = 0;
    timerDisplay.textContent = timeLeft;
    hitDisplay.textContent = hits;
    gameFinal.style.display = 'none';
    gameFeedback.textContent = '';
    gameFeedback.className = 'feedback';
    startBtn.disabled = true;
    titanEl.style.display = 'block';
    titanEl.classList.remove('hit');
    moveTitan();

    titanTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            stopTitanGame();
            gameFeedback.textContent = '⏰ Время вышло! Попробуй снова.';
            gameFeedback.className = 'feedback error';
            startBtn.disabled = false;
            gameRunning = false;
            titanEl.style.display = 'none';
        }
        if (gameRunning) moveTitan();
    }, 1000);
}

function stopTitanGame() {
    if (titanTimer) {
        clearInterval(titanTimer);
        titanTimer = null;
    }
    gameRunning = false;
    startBtn.disabled = false;
}

titanEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!gameRunning) return;
    playHitSound();
    hits++;
    hitDisplay.textContent = hits;
    titanEl.classList.add('hit');
    setTimeout(() => titanEl.classList.remove('hit'), 300);
    if (hits >= MAX_HITS) {
        stopTitanGame();
        gameFeedback.textContent = '🎉 Ты поймала титана 26 раз! Поздравляем!';
        gameFeedback.className = 'feedback success';
        gameFinal.style.display = 'block';
        generateCandles('candles3');
        titanEl.style.display = 'none';
        startBtn.disabled = false;
        gameRunning = false;
        if (!questCompleted[2]) {
            questCompleted[2] = true;
            collectedWords[2] = EXPECTED_WORDS[2];
            updateProgress();
            document.getElementById('word3').textContent = EXPECTED_WORDS[2];
        }
    } else {
        moveTitan();
    }
});

startBtn.addEventListener('click', startTitanGame);

// ============================================================
// 5. КВЕСТ 4: УГАДАЙ ГЕРОЯ (5 вопросов)
// ============================================================
const heroData = [
    { question: 'Этот герой – капитан Разведкорпуса, самый сильный солдат, известен своей чистотой и любовью к чаю.', options: ['Эрен', 'Леви', 'Микаса', 'Армин'], correct: 1 },
    { question: 'Девушка с красным шарфом, гениальный боец, всегда защищает Эрена.', options: ['Саша', 'Хистория', 'Микаса', 'Энни'], correct: 2 },
    { question: 'Главный герой, обладатель Атакующего титана, стремится к свободе.', options: ['Эрен', 'Райнер', 'Берторд', 'Леви'], correct: 0 },
    { question: 'Самый умный в отряде, стратег, который пожертвовал собой, чтобы победить.', options: ['Армин', 'Эрен', 'Микаса', 'Леви'], correct: 0 },
    { question: 'Она была титаном-женщиной, но потом стала союзницей. Любит спать.', options: ['Энни', 'Саша', 'Хистория', 'Микаса'], correct: 0 }
];

let currentHeroQ = 0;
let heroCompleted = false;

function renderHeroQuestion() {
    if (currentHeroQ >= heroData.length) {
        document.getElementById('heroContainer').style.display = 'none';
        document.getElementById('heroFinal').style.display = 'block';
        generateCandles('candles4');
        heroCompleted = true;
        if (!questCompleted[3]) {
            questCompleted[3] = true;
            collectedWords[3] = EXPECTED_WORDS[3];
            updateProgress();
            document.getElementById('word4').textContent = EXPECTED_WORDS[3];
        }
        return;
    }
    const q = heroData[currentHeroQ];
    document.getElementById('heroQNum').textContent = currentHeroQ + 1;
    document.getElementById('heroQuestionText').textContent = q.question;
    const progress = (currentHeroQ / heroData.length) * 100;
    document.getElementById('heroProgressFill').style.width = progress + '%';
    document.getElementById('heroProgressText').textContent = Math.round(progress) + '%';

    const container = document.getElementById('heroOptionsContainer');
    container.innerHTML = '';
    const feedback = document.getElementById('heroFeedback');
    feedback.textContent = '';
    feedback.className = 'feedback';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.dataset.idx = idx;
        btn.addEventListener('click', () => handleHeroAnswer(idx, btn));
        container.appendChild(btn);
    });
}

function handleHeroAnswer(selected, btnEl) {
    if (heroCompleted) return;
    const q = heroData[currentHeroQ];
    const correct = q.correct;
    const allBtns = document.querySelectorAll('#heroOptionsContainer .quiz-option');
    allBtns.forEach(b => b.disabled = true);

    if (selected === correct) {
        btnEl.classList.add('correct');
        document.getElementById('heroFeedback').textContent = '✅ Верно! Идём дальше.';
        document.getElementById('heroFeedback').className = 'feedback success';
        setTimeout(() => {
            currentHeroQ++;
            renderHeroQuestion();
        }, 800);
    } else {
        btnEl.classList.add('wrong');
        document.getElementById('heroFeedback').textContent = '❌ Неверно, попробуй ещё раз!';
        document.getElementById('heroFeedback').className = 'feedback error';
        setTimeout(() => {
            allBtns.forEach(b => b.disabled = false);
            btnEl.classList.remove('wrong');
        }, 1000);
    }
}

renderHeroQuestion();

// ============================================================
// 6. КВЕСТ 5: СБОР КОДА (4 слова) + КОНФЕТТИ
// ============================================================
const checkBtn = document.getElementById('checkCodeBtn');
const codeFeedback = document.getElementById('codeFeedback');
const finalBig = document.getElementById('finalBig');

checkBtn.addEventListener('click', () => {
    const w1 = document.getElementById('codeWord1').value.trim().toUpperCase();
    const w2 = document.getElementById('codeWord2').value.trim().toUpperCase();
    const w3 = document.getElementById('codeWord3').value.trim().toUpperCase();
    const w4 = document.getElementById('codeWord4').value.trim().toUpperCase();

    if (!w1 || !w2 || !w3 || !w4) {
        codeFeedback.textContent = '❌ Введите все четыре слова!';
        codeFeedback.className = 'feedback error';
        return;
    }

    if (!questCompleted.every(v => v === true)) {
        codeFeedback.textContent = '❌ Сначала пройдите все четыре квеста!';
        codeFeedback.className = 'feedback error';
        return;
    }

    if (w1 === EXPECTED_WORDS[0] && w2 === EXPECTED_WORDS[1] && w3 === EXPECTED_WORDS[2] && w4 === EXPECTED_WORDS[3]) {
        codeFeedback.textContent = '✅ Поздравляем! Код верный!';
        codeFeedback.className = 'feedback success';
        setTimeout(() => {
            document.querySelector('.code-inputs').style.display = 'none';
            checkBtn.style.display = 'none';
            codeFeedback.style.display = 'none';
            finalBig.style.display = 'block';
            generateCandles('candlesFinal');
            startConfetti();
            document.querySelector('.step:nth-child(5)').classList.add('done');
        }, 600);
    } else {
        codeFeedback.textContent = '❌ Неверно! Попробуйте ещё раз.';
        codeFeedback.className = 'feedback error';
    }
});

// ============================================================
// 7. КОНФЕТТИ (улучшенное – больше частиц, ярче)
// ============================================================
let confettiInterval = null;
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f', '#ff8800', '#ff44aa', '#ffd700', '#ff1493', '#00ff7f'];

    for (let i = 0; i < 250; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: 4 + Math.random() * 10,
            h: 4 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 6,
            vy: 2 + Math.random() * 6,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 15,
            opacity: 0.7 + Math.random() * 0.3
        });
    }

    let frame = 0;
    function animate() {
        if (frame > 400) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (confettiInterval) cancelAnimationFrame(confettiInterval);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.06;
            p.rotation += p.rotSpeed;
            if (p.y > canvas.height + 50) {
                p.y = -50;
                p.x = Math.random() * canvas.width;
                p.vy = 2 + Math.random() * 6;
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = p.opacity;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
        });
        frame++;
        confettiInterval = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================================
// 8. ОБЩАЯ ФУНКЦИЯ ДЛЯ СВЕЧЕЙ
// ============================================================
function generateCandles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 26; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(candle);
    }
}

// ============================================================
// 9. ФОНОВЫЕ ЧАСТИЦЫ (разноцветные)
// ============================================================
function createParticles() {
    const container = document.getElementById('particlesContainer');
    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f', '#ff8800', '#ff44aa', '#ffd700'];
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (2 + Math.random() * 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (12 + Math.random() * 25) + 's';
        particle.style.animationDelay = (Math.random() * 20) + 's';
        particle.style.opacity = 0.3 + Math.random() * 0.5;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}
createParticles();

// ============================================================
// 10. ИНИЦИАЛИЗАЦИЯ ПРОГРЕССА
// ============================================================
updateProgress();