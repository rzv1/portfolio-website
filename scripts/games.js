
function loadGame(gameName){
    const gameTitle = document.getElementById('current-game-title');
    const terminal = document.querySelector('.terminal-container');
    const screen = document.querySelector('.terminal-screen');
    const frame = document.getElementById('game-frame');

    gameTitle.innerText = `game terminal: ${gameName}`;
    frame.src = `../games/${gameName}/index.html`;


    if (gameName === 'xo'){
        terminal.style.maxWidth = '1700px';
        screen.style.height = '800px';
    }
    else if (gameName === 'memorycards'){
        terminal.style.maxWidth = '1700px';
        screen.style.height = '1100px';
    }
    else {
        terminal.style.maxWidth = '900px';
        screen.style.height = '700px';
    }
}

function initGames() {
    const btns = document.querySelectorAll('.game-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(btn => {
                btn.classList.remove('active');
            })
            btn.classList.add('active');
        });
    });
}

initGames();