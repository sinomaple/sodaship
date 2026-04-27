// SodaShip Storefront JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('SodaShip storefront loaded');

    const logo = document.querySelector('.brand');

    if (!logo) {
        return;
    }

    logo.addEventListener('click', (event) => {
        const logoClicks = Number(sessionStorage.getItem('sodashipLogoClicks') || 0) + 1;
        sessionStorage.setItem('sodashipLogoClicks', logoClicks);

        if (logoClicks < 3) {
            return;
        }

        event.preventDefault();
        sessionStorage.setItem('sodashipLogoClicks', 0);
        launchYarnParty();
    });
});

function launchYarnParty() {
    if (document.body.classList.contains('yarn-party')) {
        return;
    }

    document.body.classList.add('yarn-party');

    const message = document.createElement('div');
    message.className = 'easter-egg-message';
    message.textContent = 'Secret yarn mode!';
    document.body.appendChild(message);

    for (let i = 0; i < 150; i += 1) {
        const yarn = document.createElement('span');
        yarn.className = 'floating-yarn confetti';
        yarn.style.left = `${Math.random() * 100}%`;
        yarn.style.width = `${3 + Math.random() * 4}px`;
        yarn.style.height = `${14 + Math.random() * 18}px`;
        yarn.style.animationDelay = `${Math.random() * 2.5}s`;
        yarn.style.background = ['#ff7aa8', '#ffb703', '#7b2cbf', '#a2d2ff', '#baffc9'][i % 5];
        document.body.appendChild(yarn);

        setTimeout(() => {
            yarn.remove();
        }, 6500);
    }

    setTimeout(() => {
        message.remove();
        document.body.classList.remove('yarn-party');
        showSecretNote();
    }, 6500);
}

function showSecretNote() {
    const note = document.createElement('div');
    note.className = 'easter-egg-message secret-note';
    note.textContent = 'Congratulations, you found the secret surprise!!';
    document.body.appendChild(note);

    setTimeout(() => {
        note.remove();
    }, 5000);
}
