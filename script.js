// SodaShip Storefront JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('SodaShip storefront loaded');

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
});

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

    setTimeout(() => {
        note.remove();
    }, 5000);
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
            return;
        }

        setFooterClicks(0);
        launchKnittingKitQuest();
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
    document.body.appendChild(game.overlay);
    game.start();
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
                    <h2 id="kit-game-title">Lillian vs. the Yarn Monster</h2>
                </div>
                <button class="kit-close" type="button" aria-label="Close game">x</button>
            </div>
            <div class="kit-hud">
                <div class="kit-meter">
                    <span>Lillian</span>
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
        document.addEventListener('keydown', handleGameKeyDown);
        document.addEventListener('keyup', handleGameKeyUp);
        closeButton.addEventListener('click', close);
        overlay.addEventListener('click', handleBackdropClick);
        overlay.querySelectorAll('[data-kit-action]').forEach((button) => {
            button.addEventListener('pointerdown', () => {
                pressed.add(button.dataset.kitAction);
                if (button.dataset.kitAction === 'throw') {
                    throwKit();
                }
                if (button.dataset.kitAction === 'shield') {
                    raiseShield();
                }
            });
            button.addEventListener('pointerup', () => pressed.delete(button.dataset.kitAction));
            button.addEventListener('pointerleave', () => pressed.delete(button.dataset.kitAction));
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

        state.cooldown = 0.34;
        state.kits -= 1;

        const kit = document.createElement('span');
        kit.className = 'kit-projectile';
        kit.style.left = '19%';
        kit.style.top = `${state.playerY}%`;
        arena.appendChild(kit);
        projectiles.push({ element: kit, x: 19, y: state.playerY });
        updateHud();
    }

    function raiseShield() {
        if (!state.active || state.shield > 0) {
            return;
        }

        state.shield = 1.4;
        girl.classList.add('shielded');
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
                } else {
                    state.playerHealth = Math.max(0, state.playerHealth - 14);
                    girl.classList.add('girl-hit');
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
            endGame('You saved SodaShip from the yarn monster!', 'Play again');
            return;
        }

        if (state.playerHealth <= 0) {
            endGame('The yarn monster made a giant knot. Try again!', 'Try again');
        }
    }

    function endGame(message, buttonText) {
        state.active = false;
        cancelAnimationFrame(state.frame);
        document.removeEventListener('keydown', handleGameKeyDown);
        document.removeEventListener('keyup', handleGameKeyUp);

        announcement.innerHTML = `
            <span>${message}</span>
            <button class="kit-restart" type="button">${buttonText}</button>
        `;

        const restart = announcement.querySelector('.kit-restart');
        restart.addEventListener('click', () => {
            close();
            launchKnittingKitQuest();
        });
    }

    return { overlay, start };
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}
