// SodaShip Storefront JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('SodaShip storefront loaded');

    const logo = document.querySelector('.brand');

    if (!logo) {
        return;
    }

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
