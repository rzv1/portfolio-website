
export const display = (function() {
    const grid = document.querySelector("#grid");
    const info = document.querySelector("#info");
    const resetBtn = document.querySelector("#reset");
    const changeNamesBtn = document.querySelector("#changeNames");
    const player1score = document.querySelector("#player1");
    const player2score = document.querySelector("#player2");
    const changeNames = document.querySelector("#changeNamesForm");
    const PVPButton = document.querySelector("#PVP");
    const PVCButton = document.querySelector("#PVC");

    const onReset = (callback) => {
        resetBtn.addEventListener("click", (_) => {
            callback();
        })
    }

    const onChangeNames = () => {
        changeNamesBtn.addEventListener("click", (_) => {
            changeNames.classList.toggle("visible");
        })
    }

    const onChangeNamesForm = (callback) => {
        changeNames.addEventListener("submit", (e) => {
            e.preventDefault();
            const player1 = changeNames.querySelector("#player1New").value;
            const player2 = changeNames.querySelector("#player2New").value;
            changeNames.classList.toggle("visible");
            changeNames.reset();
            callback(player1, player2);
        })
    }

    const onPVP = (callback) => {
        PVPButton.addEventListener("click", (_) => {
            callback();
        })
    }

    const onPVC = (callback) => {
        PVCButton.addEventListener("click", (_) => {
            callback();
        })
    }

    const onCellClick = (callback) => {
        grid.addEventListener("click", (e) => {
            let cell = e.target;
            if(!cell.matches(".cell"))
                return;
            const pos = cell.getAttribute("data-pos");
            callback(pos);
        })
    }

    const updateCell = (pos, symbol) => {
        const cell = grid.querySelector(`[data-pos="${pos}"]`);
        cell.textContent = symbol;
    }

    const updateScores = (player1, player2) => {
        player1score.textContent = player1;
        player2score.textContent = player2;
    }
    const updateInfo = (i) => {
        info.textContent = i;
    }
    let clearBoard = () => {
        for(let el of grid.childNodes){
            el.textContent = "";
        }
    }
    return { onReset, onCellClick, onChangeNames, onChangeNamesForm, onPVP, onPVC, updateCell, updateScores, updateInfo, clearBoard };
})();