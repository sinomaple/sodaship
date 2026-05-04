// SodaShip Storefront JavaScript
const MINI_GAME_VERSION_FALLBACK = 'v1.2';

let sodaAudioContext;
let sodaMasterGain;
let miniGameVersion = MINI_GAME_VERSION_FALLBACK;
let miniGameVersionRequest;

document.addEventListener('DOMContentLoaded', () => {
    console.log('SodaShip storefront loaded');

    // Setup hamburger menu
    setupMobileMenu();

    const logo = document.querySelector('.brand');

    if (logo) {
        logo.addEventListener('click', (event) => {
            const logoClicks = getLogoClicks() + 1;
            setLogoClicks(logoClicks);

            if (logoClicks < 5) {
                return;
            }

            event.preventDefault();
            setLogoClicks(0);
            launchYarnParty();
        });
    }

    setupKitQuestEasterEgg();
    setupYarnDashEasterEgg();
    setupProtectedEmail();
    setupVisitorCounter();
    setupDailyYarnMood();
    loadMiniGameVersion();
});

function loadMiniGameVersion() {
    if (miniGameVersionRequest) {
        return miniGameVersionRequest;
    }

    if (!window.fetch) {
        return Promise.resolve(miniGameVersion);
    }

    miniGameVersionRequest = fetch('mini-game-version.json', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Mini game version unavailable');
            }

            return response.json();
        })
        .then((data) => {
            const version = data && typeof data.version === 'string' ? data.version.trim() : '';

            if (/^v\d+\.\d+$/.test(version)) {
                miniGameVersion = version;
                updateMiniGameVersionBadges();
            }

            return miniGameVersion;
        })
        .catch(() => miniGameVersion);

    return miniGameVersionRequest;
}

function updateMiniGameVersionBadges(root = document) {
    root.querySelectorAll('.kit-game-version').forEach((badge) => {
        const spokenVersion = miniGameVersion.replace(/^v/, '');
        badge.textContent = miniGameVersion;
        badge.setAttribute('aria-label', `version ${spokenVersion}`);
    });
}

function setupVisitorCounter() {
    const counter = document.querySelector('[data-visitor-counter]');
    const countOutput = document.querySelector('[data-visitor-count]');

    if (!counter || !countOutput || !window.fetch) {
        return;
    }

    fetch('/api/visit', {
        method: 'POST',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Visitor count unavailable');
            }

            return response.json();
        })
        .then((data) => {
            const visitors = Number(data && data.visitors);

            if (!Number.isFinite(visitors) || visitors < 0) {
                return;
            }

            countOutput.textContent = visitors.toLocaleString();
            counter.hidden = false;
        })
        .catch(() => {
            counter.hidden = true;
        });
}

function setupDailyYarnMood() {
    const moodOutput = document.querySelector('[data-yarn-mood]');

    if (!moodOutput) {
        return;
    }

    const moods = [
        'extra squishy',
        'secretly rainbow',
        'ready for a tiny adventure',
        'soft but very determined',
        'covered in sticker ideas',
        'weekend cozy',
        'mystery color mode'
    ];

    moodOutput.textContent = `Today's yarn mood: ${pickRandom(moods)}`;
}

function getLogoClicks() {
    try {
        return Number(sessionStorage.getItem('sodashipLogoClicks') || 0);
    } catch (error) {
        return Number(document.body.dataset.logoClicks || 0);
    }
}

function setLogoClicks(count) {
    try {
        sessionStorage.setItem('sodashipLogoClicks', count);
    } catch (error) {
        document.body.dataset.logoClicks = count;
    }
}

function launchYarnParty() {
    if (document.body.classList.contains('yarn-party')) {
        return;
    }

    document.body.classList.add('yarn-party');

    const message = document.createElement('div');
    message.className = 'easter-egg-message';
    message.textContent = 'Secret yarn party unlocked!';
    document.body.appendChild(message);

    playYarnPartySound();
    launchConfetti();
    launchSparkles();

    setTimeout(() => {
        message.remove();
        document.body.classList.remove('yarn-party');
        showSecretNote();
    }, 6500);
}

function launchConfetti() {
    const colors = ['#ff7aa8', '#ffb703', '#7b2cbf', '#a2d2ff', '#baffc9'];

    for (let i = 0; i < 220; i += 1) {
        const confetti = document.createElement('span');
        confetti.className = 'falling-confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.width = `${3 + Math.random() * 4}px`;
        confetti.style.height = `${14 + Math.random() * 22}px`;
        confetti.style.animationDelay = `${Math.random() * 3.2}s`;
        confetti.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
        confetti.style.background = colors[i % colors.length];
        confetti.style.setProperty('--drift', `${Math.random() * 140 - 70}px`);
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 7200);
    }
}

function launchSparkles() {
    const words = ['WOW', 'YAY', 'COZY', 'KNIT', 'SECRET'];

    for (let i = 0; i < 14; i += 1) {
        const sparkle = document.createElement('span');
        sparkle.className = 'surprise-sparkle';
        sparkle.textContent = i % 2 === 0 ? '*' : words[i % words.length];
        sparkle.style.left = `${8 + Math.random() * 84}%`;
        sparkle.style.top = `${18 + Math.random() * 58}%`;
        sparkle.style.animationDelay = `${Math.random() * 1.8}s`;
        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 5200);
    }
}

function showSecretNote() {
    const note = document.createElement('div');
    note.className = 'easter-egg-message secret-note';
    note.textContent = 'Congratulations, you found the secret surprise!! Yarn party champion!';
    document.body.appendChild(note);
    playSecretNoteSound();

    setTimeout(() => {
        note.remove();
    }, 5000);
}

function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        return null;
    }

    try {
        if (!sodaAudioContext) {
            sodaAudioContext = new AudioContextClass();
            sodaMasterGain = sodaAudioContext.createGain();
            sodaMasterGain.gain.value = 0.11;
            sodaMasterGain.connect(sodaAudioContext.destination);
        }

        if (sodaAudioContext.state === 'suspended') {
            sodaAudioContext.resume().catch(() => {});
        }

        return sodaAudioContext;
    } catch (error) {
        return null;
    }
}

function playTone(frequency, duration, options = {}) {
    const context = getAudioContext();

    if (!context || !sodaMasterGain) {
        return;
    }

    const delay = options.delay || 0;
    const volume = options.volume || 0.5;
    const type = options.type || 'sine';
    const when = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);

    if (options.endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, when + duration);
    }

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    oscillator.connect(gain);
    gain.connect(sodaMasterGain);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.04);
}

function playNoise(duration, options = {}) {
    const context = getAudioContext();

    if (!context || !sodaMasterGain) {
        return;
    }

    const delay = options.delay || 0;
    const volume = options.volume || 0.18;
    const when = context.currentTime + delay;
    const buffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * duration)), context.sampleRate);
    const data = buffer.getChannelData(0);
    const source = context.createBufferSource();
    const gain = context.createGain();

    for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(gain);
    gain.connect(sodaMasterGain);
    source.start(when);
}

function playYarnPartySound() {
    [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
        playTone(note, 0.16, { delay: index * 0.09, volume: 0.42, type: 'triangle' });
    });
    playNoise(0.35, { delay: 0.15, volume: 0.07 });
}

function playSecretNoteSound() {
    playTone(880, 0.14, { volume: 0.32, type: 'sine' });
    playTone(1174.66, 0.2, { delay: 0.11, volume: 0.28, type: 'sine' });
}

function playGameStartSound() {
    playTone(392, 0.11, { volume: 0.32, type: 'square' });
    playTone(523.25, 0.11, { delay: 0.1, volume: 0.28, type: 'square' });
    playTone(659.25, 0.18, { delay: 0.2, volume: 0.26, type: 'triangle' });
}

function playKitThrowSound() {
    playTone(740, 0.12, { volume: 0.18, type: 'triangle', endFrequency: 1120 });
}

function playShieldSound() {
    playTone(330, 0.2, { volume: 0.22, type: 'sine', endFrequency: 660 });
    playTone(990, 0.12, { delay: 0.04, volume: 0.12, type: 'triangle' });
}

function playMonsterTangleSound() {
    playTone(185, 0.14, { volume: 0.08, type: 'sawtooth', endFrequency: 120 });
}

function playMonsterHitSound() {
    playTone(260, 0.08, { volume: 0.2, type: 'square', endFrequency: 180 });
    playTone(520, 0.1, { delay: 0.04, volume: 0.14, type: 'triangle', endFrequency: 390 });
}

function playBlockSound() {
    playTone(620, 0.08, { volume: 0.16, type: 'triangle' });
    playTone(930, 0.12, { delay: 0.05, volume: 0.12, type: 'sine' });
}

function playPlayerHitSound() {
    playTone(160, 0.18, { volume: 0.2, type: 'sawtooth', endFrequency: 90 });
}

function playWinSound() {
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((note, index) => {
        playTone(note, 0.16, { delay: index * 0.08, volume: 0.25, type: 'triangle' });
    });
}

function playLoseSound() {
    playTone(330, 0.18, { volume: 0.22, type: 'sine', endFrequency: 220 });
    playTone(220, 0.24, { delay: 0.16, volume: 0.18, type: 'sine', endFrequency: 146.83 });
}

function setupProtectedEmail() {
    const revealButton = document.querySelector('[data-protected-email]');
    const copyButton = document.querySelector('[data-copy-email]');
    const output = document.querySelector('.email-output');
    const status = document.querySelector('.email-status');

    if (!revealButton || !copyButton || !output || !status) {
        return;
    }

    const emailCodes = [
        76, 105, 108, 121, 80, 97, 100, 64, 115, 111,
        100, 97, 115, 104, 105, 112, 46, 99, 111, 109
    ];
    let protectedEmail = '';

    revealButton.addEventListener('click', () => {
        protectedEmail = buildProtectedEmail(emailCodes);
        output.replaceChildren(drawEmailPicture(protectedEmail));
        status.textContent = 'Email picture shown. Use the copy button if you need to paste it.';
        copyButton.hidden = false;

        revealButton.textContent = 'Email picture shown';
        revealButton.disabled = true;
    });

    copyButton.addEventListener('click', async () => {
        protectedEmail = protectedEmail || buildProtectedEmail(emailCodes);

        if (!navigator.clipboard || !window.isSecureContext) {
            status.textContent = 'Copy is not available in this browser. Please read the email picture.';
            return;
        }

        try {
            await navigator.clipboard.writeText(protectedEmail);
            status.textContent = 'Email copied.';
        } catch (error) {
            status.textContent = 'Copy did not work. Please read the email picture.';
        }
    });
}

function buildProtectedEmail(codes) {
    return codes.map((code) => String.fromCharCode(code)).join('');
}

function drawEmailPicture(email) {
    const canvas = document.createElement('canvas');
    const scale = window.devicePixelRatio || 1;
    const width = 292;
    const height = 54;
    const ctx = canvas.getContext('2d');

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = 'auto';
    canvas.className = 'email-picture';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Protected email picture');

    ctx.scale(scale, scale);
    ctx.fillStyle = '#fffdf5';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#3d3150';
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.strokeRect(4, 4, width - 8, height - 8);
    ctx.setLineDash([]);
    ctx.fillStyle = '#3d3150';
    ctx.font = 'bold 21px "Comic Sans MS", "Trebuchet MS", cursive, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(email, 18, height / 2);

    return canvas;
}

function setupKitQuestEasterEgg() {
    const secretCode = 'knitkit';
    let typedCode = '';

    document.addEventListener('keydown', (event) => {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';

        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
            return;
        }

        if (event.key.length !== 1) {
            return;
        }

        typedCode = `${typedCode}${event.key.toLowerCase()}`.slice(-secretCode.length);

        if (typedCode === secretCode) {
            typedCode = '';
            launchKnittingKitQuest();
        }
    });

    const footer = document.querySelector('footer');

    if (!footer) {
        return;
    }

    footer.addEventListener('click', () => {
        const footerClicks = getFooterClicks() + 1;

        if (footerClicks < 4) {
            setFooterClicks(footerClicks);
            showFooterTapHint(footerClicks);
            return;
        }

        setFooterClicks(0);
        showFooterTapHint(4);
        launchKnittingKitQuest();
    });
}

function setupYarnDashEasterEgg() {
    const secretCode = 'yarndash';
    let typedCode = '';
    const dashTriggers = document.querySelectorAll('[data-yarn-dash-trigger]');

    document.addEventListener('keydown', (event) => {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';

        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
            return;
        }

        if (event.key.length !== 1) {
            return;
        }

        typedCode = `${typedCode}${event.key.toLowerCase()}`.slice(-secretCode.length);

        if (typedCode === secretCode) {
            typedCode = '';
            launchYarnDashRun();
        }
    });

    dashTriggers.forEach((trigger) => {
        trigger.addEventListener('click', launchYarnDashRun);
    });
}

function getFooterClicks() {
    try {
        return Number(sessionStorage.getItem('sodashipFooterClicks') || 0);
    } catch (error) {
        return Number(document.body.dataset.footerClicks || 0);
    }
}

function setFooterClicks(count) {
    try {
        sessionStorage.setItem('sodashipFooterClicks', count);
    } catch (error) {
        document.body.dataset.footerClicks = count;
    }
}

function launchKnittingKitQuest() {
    if (document.querySelector('.kit-game')) {
        return;
    }

    const game = createKitGame();
    setMiniGameActive(true);
    document.body.appendChild(game.overlay);
    updateMiniGameVersionBadges(game.overlay);
    loadMiniGameVersion().then(() => updateMiniGameVersionBadges(game.overlay));
    game.start();
}

function showFooterTapHint(count) {
    const oldNote = document.querySelector('.footer-tap-note');

    if (oldNote) {
        oldNote.remove();
    }

    const note = document.createElement('div');
    note.className = 'easter-egg-message footer-tap-note';
    note.textContent = count < 4 ? `bottom stitch noticed you (${count}/4)` : 'bottom stitch opened the secret basket';
    document.body.appendChild(note);

    setTimeout(() => {
        note.remove();
    }, 1350);
}

function launchYarnDashRun() {
    if (document.querySelector('.kit-game')) {
        return;
    }

    const game = createYarnDashRun();
    setMiniGameActive(true);
    document.body.appendChild(game.overlay);
    updateMiniGameVersionBadges(game.overlay);
    loadMiniGameVersion().then(() => updateMiniGameVersionBadges(game.overlay));
    game.start();
}

function setMiniGameActive(isActive) {
    document.body.classList.toggle('mini-game-active', isActive);
}

function createYarnDashRun() {
    const overlay = document.createElement('div');
    overlay.className = 'kit-game dash-game';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'dash-game-title');

    overlay.innerHTML = `
        <div class="kit-game-panel dash-game-panel">
            <div class="kit-game-top">
                <div>
                    <p class="kit-game-kicker">Secret mini game</p>
                    <h2 id="dash-game-title">LilyPad Yarn Dash <span class="kit-game-version" aria-label="version 1.2">${MINI_GAME_VERSION_FALLBACK}</span></h2>
                </div>
                <button class="kit-close" type="button" aria-label="Close game">x</button>
            </div>
            <div class="dash-hud">
                <div class="kit-score">Progress: <strong class="dash-progress">0%</strong></div>
                <div class="kit-score">Jumps: <strong class="dash-jumps">0</strong></div>
                <div class="kit-score">Cleared: <strong class="dash-cleared">0</strong></div>
            </div>
            <div class="kit-arena dash-arena" tabindex="0" aria-label="Yarn dash obstacle lane">
                <div class="dash-cloud cloud-one"></div>
                <div class="dash-cloud cloud-two"></div>
                <div class="dash-road-line line-one"></div>
                <div class="dash-road-line line-two"></div>
                <div class="dash-runner" aria-hidden="true">
                    <span class="girl-hair"></span>
                    <span class="girl-head"></span>
                    <span class="girl-body"></span>
                    <span class="girl-arm"></span>
                    <span class="girl-kit"></span>
                </div>
                <div class="dash-monster" aria-hidden="true">
                    <span class="monster-ball"></span>
                    <span class="monster-eye eye-left"></span>
                    <span class="monster-eye eye-right"></span>
                    <span class="monster-mouth"></span>
                    <span class="monster-tentacle tentacle-one"></span>
                    <span class="monster-tentacle tentacle-two"></span>
                    <span class="monster-tentacle tentacle-three"></span>
                </div>
                <p class="kit-announcement">Tap through spikes, blocks, gaps, and bounce pads to reach the finish!</p>
            </div>
            <div class="kit-controls dash-controls">
                <button type="button" data-dash-action="jump">Jump</button>
            </div>
            <p class="kit-directions">Space, Arrow Up, W, or the Jump button hops. One bonk restarts the run.</p>
        </div>
    `;

    const arena = overlay.querySelector('.dash-arena');
    const runner = overlay.querySelector('.dash-runner');
    const monster = overlay.querySelector('.dash-monster');
    const progressText = overlay.querySelector('.dash-progress');
    const jumpsText = overlay.querySelector('.dash-jumps');
    const clearedText = overlay.querySelector('.dash-cleared');
    const announcement = overlay.querySelector('.kit-announcement');
    const closeButton = overlay.querySelector('.kit-close');
    const roadObjects = [];
    const runnerBox = {
        x: 92,
        width: 42,
        height: 86,
        ground: 46
    };
    const finishDistance = 210;
    const dashCourse = buildDashCourse(finishDistance);
    const state = {
        active: true,
        lastTime: 0,
        frame: 0,
        distance: 0,
        jumps: 0,
        cleared: 0,
        nextCourseIndex: 0,
        runnerY: 0,
        runnerVelocity: 0,
        speed: 245
    };

    function buildDashCourse(courseFinish) {
        const course = [];
        const obstacleTypes = ['button-bump', 'soda-crate', 'needle-gate', 'yarn-shot', 'road-gap', 'yarn-spike', 'yarn-tower', 'bounce-pad'];
        let nextDistance = 4;
        let previousType = '';

        while (nextDistance < courseFinish - 14) {
            let type = pickRandom(obstacleTypes);

            if (type === previousType) {
                type = pickRandom(obstacleTypes.filter((obstacleType) => obstacleType !== previousType));
            }

            course.push({ at: nextDistance, type });
            previousType = type;

            const baseGap = ['road-gap', 'bounce-pad'].includes(type) ? 11 : ['needle-gate', 'yarn-tower'].includes(type) ? 9 : 7;
            const wobble = 2 + Math.floor(Math.random() * 7);
            nextDistance += baseGap + wobble;
        }

        return course;
    }

    function start() {
        arena.focus();
        playGameStartSound();
        document.addEventListener('keydown', handleDashKeyDown);
        closeButton.addEventListener('click', close);
        overlay.addEventListener('click', handleBackdropClick);
        overlay.querySelectorAll('[data-dash-action]').forEach((button) => {
            button.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                button.classList.add('active');
                if (button.dataset.dashAction === 'jump') {
                    jump();
                }
            });
            button.addEventListener('pointerup', () => button.classList.remove('active'));
            button.addEventListener('pointerleave', () => button.classList.remove('active'));
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (button.dataset.dashAction === 'jump') {
                    jump();
                }
            });
        });
        updateDashHud();
        state.frame = requestAnimationFrame(tick);
    }

    function close() {
        state.active = false;
        cancelAnimationFrame(state.frame);
        document.removeEventListener('keydown', handleDashKeyDown);
        setMiniGameActive(false);
        overlay.remove();
    }

    function handleBackdropClick(event) {
        if (event.target === overlay) {
            close();
        }
    }

    function handleDashKeyDown(event) {
        if (!document.body.contains(overlay)) {
            return;
        }

        const key = event.key.toLowerCase();

        if (['arrowup', 'w', ' '].includes(key)) {
            event.preventDefault();
            jump();
        }

        if (key === 'escape') {
            close();
        }
    }

    function jump() {
        if (!state.active || state.runnerY > 2) {
            return;
        }

        state.runnerVelocity = 435;
        state.jumps += 1;
        playBlockSound();
    }

    function tick(time) {
        if (!state.active) {
            return;
        }

        if (!state.lastTime) {
            state.lastTime = time;
        }

        const dt = Math.min((time - state.lastTime) / 1000, 0.05);
        state.lastTime = time;
        state.distance += dt * 6.4;
        state.speed = Math.min(355, 245 + state.distance * 0.7);

        updateDashRunner(dt);
        updateDashCourse();
        updateDashObjects(dt);

        if (!state.active) {
            return;
        }

        updateDashHud();
        checkDashGameOver();

        if (state.active) {
            state.frame = requestAnimationFrame(tick);
        }
    }

    function updateDashRunner(dt) {
        state.runnerVelocity -= 980 * dt;
        state.runnerY = Math.max(0, state.runnerY + state.runnerVelocity * dt);

        if (state.runnerY === 0 && state.runnerVelocity < 0) {
            state.runnerVelocity = 0;
        }

        runner.style.bottom = `${runnerBox.ground + state.runnerY}px`;
        runner.style.setProperty('--dash-runner-rotation', state.runnerY > 1 ? `${Math.min(32, state.runnerY * 0.22)}deg` : '0deg');
    }

    function updateDashCourse() {
        while (dashCourse[state.nextCourseIndex] && state.distance >= dashCourse[state.nextCourseIndex].at) {
            const event = dashCourse[state.nextCourseIndex];
            state.nextCourseIndex += 1;

            if (event.type === 'yarn-shot') {
                spawnDashYarnShot();
            } else {
                spawnDashObstacle(event.type);
            }
        }
    }

    function spawnDashObstacle(type) {
        const specs = {
            'soda-crate': { width: 48, height: 48, bottom: runnerBox.ground },
            'button-bump': { width: 58, height: 34, bottom: runnerBox.ground },
            'needle-gate': { width: 34, height: 76, bottom: runnerBox.ground },
            'road-gap': { width: 88, height: 24, bottom: runnerBox.ground - 17, isGap: true },
            'yarn-spike': { width: 48, height: 46, bottom: runnerBox.ground, isSpike: true },
            'yarn-tower': { width: 54, height: 72, bottom: runnerBox.ground },
            'bounce-pad': { width: 64, height: 18, bottom: runnerBox.ground, isPad: true }
        };
        const obstacle = document.createElement('span');
        const spec = specs[type];

        obstacle.className = `dash-obstacle ${type}`;
        obstacle.style.left = `${arena.clientWidth + 70}px`;
        obstacle.style.bottom = `${spec.bottom}px`;
        arena.appendChild(obstacle);
        roadObjects.push({
            element: obstacle,
            x: arena.clientWidth + 70,
            width: spec.width,
            height: spec.height,
            bottom: spec.bottom,
            isGap: Boolean(spec.isGap),
            isPad: Boolean(spec.isPad),
            isSpike: Boolean(spec.isSpike),
            hit: false
        });
    }

    function spawnDashYarnShot() {
        const shot = document.createElement('span');
        const bottom = runnerBox.ground + 12;

        shot.className = 'dash-yarn-shot';
        shot.style.left = `${arena.clientWidth + 92}px`;
        shot.style.bottom = `${bottom}px`;
        arena.appendChild(shot);
        roadObjects.push({
            element: shot,
            x: arena.clientWidth + 92,
            width: 34,
            height: 34,
            bottom,
            hit: false
        });
        monster.classList.add('dash-throwing');
        playMonsterTangleSound();
        setTimeout(() => monster.classList.remove('dash-throwing'), 220);
    }

    function updateDashObjects(dt) {
        const player = getDashPlayerBox();

        for (let i = roadObjects.length - 1; i >= 0; i -= 1) {
            const item = roadObjects[i];
            item.x -= state.speed * dt;
            item.element.style.left = `${item.x}px`;

            const itemBox = getDashItemBox(item);

            if (!item.hit && item.isPad && dashPadTouchesRunner(player, itemBox)) {
                item.hit = true;
                item.element.classList.add('pad-used');
                state.runnerY = Math.max(state.runnerY, 14);
                state.runnerVelocity = 560;
                playShieldSound();
            } else if (!item.hit && itemCatchesDashRunner(player, item, itemBox)) {
                item.hit = true;
                playLoseSound();
                endDashGame(item.isGap ? 'Whoops! LilyPad slipped into a yarn gap.' : 'Bonk! One yarn bump restarts the course.', 'Try again', 'lose');
                return;
            }

            if (item.x < -90) {
                state.cleared += 1;
                item.element.remove();
                roadObjects.splice(i, 1);
            }
        }
    }

    function getDashPlayerBox() {
        const arenaHeight = arena.clientHeight || 360;

        return {
            x: runnerBox.x,
            y: arenaHeight - runnerBox.ground - state.runnerY - runnerBox.height,
            width: runnerBox.width,
            height: runnerBox.height
        };
    }

    function getDashItemBox(item) {
        const arenaHeight = arena.clientHeight || 360;

        return {
            x: item.x,
            y: arenaHeight - item.bottom - item.height,
            width: item.width,
            height: item.height
        };
    }

    function itemCatchesDashRunner(player, item, itemBox) {
        if (!item.isGap) {
            if (item.isPad) {
                return false;
            }

            if (item.isSpike) {
                return boxesOverlap(player, {
                    x: itemBox.x + 8,
                    y: itemBox.y + 8,
                    width: itemBox.width - 16,
                    height: itemBox.height - 8
                });
            }

            return boxesOverlap(player, itemBox);
        }

        const runnerFeetLeft = player.x + 8;
        const runnerFeetRight = player.x + player.width - 6;
        const gapLeft = itemBox.x + 7;
        const gapRight = itemBox.x + itemBox.width - 7;
        const feetOverGap = runnerFeetRight > gapLeft && runnerFeetLeft < gapRight;

        return feetOverGap && state.runnerY < 38;
    }

    function dashPadTouchesRunner(player, itemBox) {
        const runnerFeet = player.y + player.height;
        const runnerCenter = player.x + player.width / 2;
        const padLeft = itemBox.x - 4;
        const padRight = itemBox.x + itemBox.width + 4;

        return runnerCenter > padLeft && runnerCenter < padRight && runnerFeet >= itemBox.y - 12 && runnerFeet <= itemBox.y + itemBox.height + 16;
    }

    function boxesOverlap(first, second) {
        return first.x < second.x + second.width &&
            first.x + first.width > second.x &&
            first.y < second.y + second.height &&
            first.y + first.height > second.y;
    }

    function updateDashHud() {
        progressText.textContent = `${Math.min(100, Math.floor((state.distance / finishDistance) * 100))}%`;
        jumpsText.textContent = state.jumps;
        clearedText.textContent = state.cleared;
    }

    function checkDashGameOver() {
        if (state.distance >= finishDistance) {
            playWinSound();
            endDashGame('Finish reached! The yarn monster finally unraveled!', 'Run again', 'win');
        }
    }

    function endDashGame(message, buttonText, result) {
        state.active = false;
        cancelAnimationFrame(state.frame);
        document.removeEventListener('keydown', handleDashKeyDown);
        roadObjects.splice(0).forEach((item) => item.element.remove());

        const badge = document.createElement('div');
        badge.className = `kit-finish-badge dash-finish-badge ${result === 'win' ? 'boss-badge' : 'soft-badge'}`;
        badge.textContent = result === 'win' ? 'FINISH! BOSS UNRAVELED!' : 'YARN ROADBLOCK!';
        arena.appendChild(badge);
        runner.classList.add(result === 'win' ? 'dash-victory' : 'dash-crash');
        monster.classList.add(result === 'win' ? 'boss-defeated' : 'boss-gloat');

        const messageText = document.createElement('span');
        const restart = document.createElement('button');
        messageText.textContent = message;
        restart.className = 'kit-restart';
        restart.type = 'button';
        restart.textContent = buttonText;
        announcement.replaceChildren(messageText, restart);

        restart.addEventListener('click', () => {
            close();
            launchYarnDashRun();
        });
    }

    return { overlay, start };
}

function createKitGame() {
    const overlay = document.createElement('div');
    overlay.className = 'kit-game';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'kit-game-title');

    overlay.innerHTML = `
        <div class="kit-game-panel">
            <div class="kit-game-top">
                <div>
                    <p class="kit-game-kicker">Secret mini game</p>
                    <h2 id="kit-game-title">LilyPad vs. the Yarn Monster <span class="kit-game-version" aria-label="version 1.1">${MINI_GAME_VERSION_FALLBACK}</span></h2>
                </div>
                <button class="kit-close" type="button" aria-label="Close game">x</button>
            </div>
            <div class="kit-hud">
                <div class="kit-meter">
                    <span>LilyPad</span>
                    <div class="kit-meter-track"><div class="kit-meter-fill player-health"></div></div>
                </div>
                <div class="kit-score">Kits: <strong class="kit-count">24</strong></div>
                <div class="kit-meter">
                    <span>Monster</span>
                    <div class="kit-meter-track"><div class="kit-meter-fill monster-health"></div></div>
                </div>
            </div>
            <div class="kit-arena" tabindex="0" aria-label="Knitting kit battle arena">
                <div class="kit-cloud cloud-one"></div>
                <div class="kit-cloud cloud-two"></div>
                <div class="knit-girl" aria-hidden="true">
                    <span class="girl-hair"></span>
                    <span class="girl-head"></span>
                    <span class="girl-body"></span>
                    <span class="girl-arm"></span>
                    <span class="girl-kit"></span>
                </div>
                <div class="yarn-monster" aria-hidden="true">
                    <span class="monster-ball"></span>
                    <span class="monster-eye eye-left"></span>
                    <span class="monster-eye eye-right"></span>
                    <span class="monster-mouth"></span>
                    <span class="monster-tentacle tentacle-one"></span>
                    <span class="monster-tentacle tentacle-two"></span>
                    <span class="monster-tentacle tentacle-three"></span>
                </div>
                <p class="kit-announcement">Throw knitting kits before the yarn tangles you!</p>
            </div>
            <div class="kit-controls">
                <button type="button" data-kit-action="up">Up</button>
                <button type="button" data-kit-action="throw">Throw kit</button>
                <button type="button" data-kit-action="shield">Shield</button>
                <button type="button" data-kit-action="down">Down</button>
            </div>
            <p class="kit-directions">Arrow keys or W/S move. Space throws. Shift makes a stitch shield.</p>
        </div>
    `;

    const arena = overlay.querySelector('.kit-arena');
    const girl = overlay.querySelector('.knit-girl');
    const monster = overlay.querySelector('.yarn-monster');
    const playerHealth = overlay.querySelector('.player-health');
    const monsterHealth = overlay.querySelector('.monster-health');
    const kitCount = overlay.querySelector('.kit-count');
    const announcement = overlay.querySelector('.kit-announcement');
    const closeButton = overlay.querySelector('.kit-close');
    const pressed = new Set();
    const projectiles = [];
    const tangles = [];
    const state = {
        active: true,
        playerY: 50,
        monsterY: 46,
        playerHealth: 100,
        monsterHealth: 100,
        kits: 24,
        cooldown: 0,
        shield: 0,
        tangleTimer: 0,
        monsterTimer: 0,
        lastTime: 0,
        frame: 0
    };

    function start() {
        arena.focus();
        playGameStartSound();
        document.addEventListener('keydown', handleGameKeyDown);
        document.addEventListener('keyup', handleGameKeyUp);
        closeButton.addEventListener('click', close);
        overlay.addEventListener('click', handleBackdropClick);
        overlay.querySelectorAll('[data-kit-action]').forEach((button) => {
            button.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                button.classList.add('active');
                pressed.add(button.dataset.kitAction);
                if (button.dataset.kitAction === 'throw') {
                    throwKit();
                }
                if (button.dataset.kitAction === 'shield') {
                    raiseShield();
                }
            });
            button.addEventListener('pointerup', () => {
                button.classList.remove('active');
                pressed.delete(button.dataset.kitAction);
            });
            button.addEventListener('pointerleave', () => {
                button.classList.remove('active');
                pressed.delete(button.dataset.kitAction);
            });
            button.addEventListener('click', () => {
                if (button.dataset.kitAction === 'throw') {
                    throwKit();
                }
                if (button.dataset.kitAction === 'shield') {
                    raiseShield();
                }
            });
        });
        updateHud();
        state.frame = requestAnimationFrame(tick);
    }

    function close() {
        state.active = false;
        cancelAnimationFrame(state.frame);
        document.removeEventListener('keydown', handleGameKeyDown);
        document.removeEventListener('keyup', handleGameKeyUp);
        setMiniGameActive(false);
        overlay.remove();
    }

    function handleBackdropClick(event) {
        if (event.target === overlay) {
            close();
        }
    }

    function handleGameKeyDown(event) {
        if (!document.body.contains(overlay)) {
            return;
        }

        const key = event.key.toLowerCase();

        if (['arrowup', 'w'].includes(key)) {
            event.preventDefault();
            pressed.add('up');
        }

        if (['arrowdown', 's'].includes(key)) {
            event.preventDefault();
            pressed.add('down');
        }

        if (key === ' ') {
            event.preventDefault();
            throwKit();
        }

        if (key === 'shift') {
            event.preventDefault();
            raiseShield();
        }

        if (key === 'escape') {
            close();
        }
    }

    function handleGameKeyUp(event) {
        const key = event.key.toLowerCase();

        if (['arrowup', 'w'].includes(key)) {
            pressed.delete('up');
        }

        if (['arrowdown', 's'].includes(key)) {
            pressed.delete('down');
        }
    }

    function throwKit() {
        if (!state.active || state.cooldown > 0 || state.kits <= 0) {
            return;
        }

        state.cooldown = 0.2;
        state.kits -= 1;

        const kit = document.createElement('span');
        kit.className = 'kit-projectile';
        kit.style.left = '19%';
        kit.style.top = `${state.playerY}%`;
        arena.appendChild(kit);
        projectiles.push({ element: kit, x: 19, y: state.playerY });
        playKitThrowSound();
        updateHud();
    }

    function raiseShield() {
        if (!state.active || state.shield > 0) {
            return;
        }

        state.shield = 1.4;
        girl.classList.add('shielded');
        playShieldSound();
        setTimeout(() => {
            girl.classList.remove('shielded');
        }, 1400);
    }

    function launchTangle() {
        const tangle = document.createElement('span');
        tangle.className = 'yarn-tangle';
        tangle.style.left = '78%';
        tangle.style.top = `${state.monsterY}%`;
        arena.appendChild(tangle);
        tangles.push({ element: tangle, x: 78, y: state.monsterY });
        playMonsterTangleSound();
    }

    function tick(time) {
        if (!state.active) {
            return;
        }

        if (!state.lastTime) {
            state.lastTime = time;
        }

        const dt = Math.min((time - state.lastTime) / 1000, 0.05);
        state.lastTime = time;

        updatePlayer(dt);
        updateMonster(dt, time);
        updateProjectiles(dt);
        updateTangles(dt);
        updateTimers(dt);
        updateHud();
        checkGameOver();

        if (state.active) {
            state.frame = requestAnimationFrame(tick);
        }
    }

    function updatePlayer(dt) {
        const speed = 58;

        if (pressed.has('up')) {
            state.playerY -= speed * dt;
        }

        if (pressed.has('down')) {
            state.playerY += speed * dt;
        }

        state.playerY = clamp(state.playerY, 18, 82);
        girl.style.top = `${state.playerY}%`;
    }

    function updateMonster(dt, time) {
        state.monsterTimer += dt;
        state.monsterY = 48 + Math.sin(time / 520) * 21 + Math.sin(time / 210) * 4;
        monster.style.top = `${state.monsterY}%`;

        if (state.monsterTimer > 0.92) {
            state.monsterTimer = 0;
            launchTangle();
        }
    }

    function updateProjectiles(dt) {
        for (let i = projectiles.length - 1; i >= 0; i -= 1) {
            const projectile = projectiles[i];
            projectile.x += 76 * dt;
            projectile.element.style.left = `${projectile.x}%`;

            if (projectile.x > 73 && Math.abs(projectile.y - state.monsterY) < 15) {
                state.monsterHealth = Math.max(0, state.monsterHealth - 9);
                monster.classList.add('monster-hit');
                playMonsterHitSound();
                setTimeout(() => monster.classList.remove('monster-hit'), 160);
                projectile.element.remove();
                projectiles.splice(i, 1);
                announcement.textContent = pickRandom([
                    'Direct hit! That kit had extra cozy power!',
                    'The yarn monster is unraveling!',
                    'Needles up! Great throw!'
                ]);
            } else if (projectile.x > 96) {
                projectile.element.remove();
                projectiles.splice(i, 1);
            }
        }
    }

    function updateTangles(dt) {
        for (let i = tangles.length - 1; i >= 0; i -= 1) {
            const tangle = tangles[i];
            tangle.x -= 34 * dt;
            tangle.element.style.left = `${tangle.x}%`;

            if (tangle.x < 27 && Math.abs(tangle.y - state.playerY) < 13) {
                if (state.shield > 0) {
                    announcement.textContent = 'Stitch shield blocked the tangle!';
                    playBlockSound();
                } else {
                    state.playerHealth = Math.max(0, state.playerHealth - 14);
                    girl.classList.add('girl-hit');
                    playPlayerHitSound();
                    setTimeout(() => girl.classList.remove('girl-hit'), 180);
                    announcement.textContent = 'Oh no, a yarn tangle landed!';
                }

                tangle.element.remove();
                tangles.splice(i, 1);
            } else if (tangle.x < 2) {
                tangle.element.remove();
                tangles.splice(i, 1);
            }
        }
    }

    function updateTimers(dt) {
        state.cooldown = Math.max(0, state.cooldown - dt);
        state.shield = Math.max(0, state.shield - dt);

        if (state.kits === 0 && state.monsterHealth > 0 && projectiles.length === 0) {
            state.kits = 8;
            announcement.textContent = 'A new kit basket slid in!';
        }
    }

    function updateHud() {
        playerHealth.style.width = `${state.playerHealth}%`;
        monsterHealth.style.width = `${state.monsterHealth}%`;
        kitCount.textContent = state.kits;
    }

    function checkGameOver() {
        if (state.monsterHealth <= 0) {
            playWinSound();
            endGame('You saved SodaShip from the yarn monster!', 'Play again', 'win');
            return;
        }

        if (state.playerHealth <= 0) {
            playLoseSound();
            endGame('The yarn monster made a giant knot. Try again!', 'Try again', 'lose');
        }
    }

    function endGame(message, buttonText, result) {
        state.active = false;
        cancelAnimationFrame(state.frame);
        document.removeEventListener('keydown', handleGameKeyDown);
        document.removeEventListener('keyup', handleGameKeyUp);
        clearMovingPieces();
        showFinishEffect(result);

        const messageText = document.createElement('span');
        const restart = document.createElement('button');
        messageText.textContent = message;
        restart.className = 'kit-restart';
        restart.type = 'button';
        restart.textContent = buttonText;
        announcement.replaceChildren(messageText, restart);

        restart.addEventListener('click', () => {
            close();
            launchKnittingKitQuest();
        });
    }

    function clearMovingPieces() {
        projectiles.splice(0).forEach((projectile) => projectile.element.remove());
        tangles.splice(0).forEach((tangle) => tangle.element.remove());
    }

    function showFinishEffect(result) {
        const badge = document.createElement('div');
        badge.className = `kit-finish-badge ${result === 'win' ? 'boss-badge' : 'soft-badge'}`;
        badge.textContent = result === 'win' ? 'YARN BOSS UNRAVELED!' : 'SOFT LANDING!';
        arena.appendChild(badge);

        if (result === 'win') {
            monster.classList.add('boss-defeated');
            girl.classList.add('girl-victory');
            launchBossBurst();
            return;
        }

        girl.classList.add('lilypad-ko');
        monster.classList.add('boss-gloat');
        launchSoftLandingPuffs();
    }

    function launchBossBurst() {
        for (let i = 0; i < 30; i += 1) {
            const yarnBit = document.createElement('span');
            const angle = (Math.PI * 2 * i) / 30;
            const distance = 46 + Math.random() * 78;
            yarnBit.className = 'boss-yarn-pop';
            yarnBit.style.left = '82%';
            yarnBit.style.top = `${state.monsterY}%`;
            yarnBit.style.background = pickRandom(['#ff7aa8', '#e0bbff', '#a2d2ff', '#ffffba']);
            yarnBit.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`);
            yarnBit.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
            yarnBit.style.animationDelay = `${Math.random() * 0.16}s`;
            arena.appendChild(yarnBit);
        }
    }

    function launchSoftLandingPuffs() {
        for (let i = 0; i < 12; i += 1) {
            const puff = document.createElement('span');
            const drift = (i - 5.5) * 13;
            puff.className = 'soft-landing-puff';
            puff.style.left = '18%';
            puff.style.top = `${clamp(state.playerY + 19, 25, 88)}%`;
            puff.style.setProperty('--puff-x', `${drift}px`);
            puff.style.setProperty('--puff-y', `${-18 - Math.random() * 26}px`);
            puff.style.animationDelay = `${Math.random() * 0.2}s`;
            arena.appendChild(puff);
        }
    }

    return { overlay, start };
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuQuery = window.matchMedia('(max-width: 768px)');

    if (!menuToggle || !navMenu) {
        return;
    }

    function setMenuOpen(isOpen) {
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        navMenu.classList.toggle('active', isOpen);
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        setMenuOpen(!isOpen);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            setMenuOpen(false);
        });
    });

    document.addEventListener('click', (event) => {
        if (!mobileMenuQuery.matches || menuToggle.getAttribute('aria-expanded') !== 'true') {
            return;
        }

        if (menuToggle.contains(event.target) || navMenu.contains(event.target)) {
            return;
        }

        setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuOpen(false);
        }
    });

    mobileMenuQuery.addEventListener('change', (event) => {
        if (!event.matches) {
            setMenuOpen(false);
        }
    });
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}
