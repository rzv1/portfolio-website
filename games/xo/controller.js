import {gameboard} from './gameboard.js'
import {game} from './game.js'
import {display} from './display.js'

export const controller = (function(){
    let mode = "PVP";
    let inputLocked = false;

    const init = () => {
        initUI();
        updateScores();
        updateInfo(false);
    }

    const initUI = () => {
        display.onCellClick(makeMove);
        display.onReset(reset);
        display.onChangeNames();
        display.onChangeNamesForm(getNames);
        display.onPVP(changeToPVP);
        display.onPVC(changeToPVC);
    }

    const setMode = (m) => {
        mode = m;
    }

    const changeToPVP = () => {
        setMode("PVP");
        game.getPlayer2().setName("Player2");
        resetScores();
        updateScores();
        reset();
    }

    const changeToPVC = () => {
        setMode("PVC");
        game.getPlayer2().setName("Computer");
        resetScores();
        updateScores();
        reset();
    }

    const updateScores = () => {
        display.updateScores(`${game.getPlayer1().getName()}: ${game.getPlayer1().getScore()}`,
            `${game.getPlayer2().getName()}: ${game.getPlayer2().getScore()}`);
    }

    const resetScores = () => {
        game.getPlayer1().resetScore();
        game.getPlayer2().resetScore();
    }

    const updateInfo = (increment=true) => {
        if(increment)
            game.updatePlayer();
        game.getPlayer() === 0 ? display.updateInfo(`${game.getPlayer1().getName()}'s turn.`) :
            display.updateInfo(`${game.getPlayer2().getName()}'s turn.`);
    }

    const checkGameEnd = () => {
        let winner = game.checkWinner();
        if (winner != null) {
            let player = winner === 0 ? game.getPlayer1() : game.getPlayer2();
            display.updateInfo(`${player.getName()} a castigat!`);
            player.giveScore();
            updateScores();
        } else if (game.checkIsTie())
            display.updateInfo("Este egalitate!");
        else
            return false;
        return true;
    }

    const makeMove = (pos) => {
        if(!gameboard.isEmpty(pos) || game.checkWinner() != null || game.checkIsTie() || inputLocked)
            return;

        if(mode === "PVC"){
            inputLocked = true;
            gameboard.moveX(pos);
            game.gameMove(pos);
            display.updateCell(pos, "X");

            if(checkGameEnd()){
                inputLocked = false;
                return;
            }
            updateInfo(); // aici
            const move = gameboard.computerMove("O", "X");
            gameboard.moveO(move);
            game.gameMove(move);
            setTimeout(() => {display.updateCell(move, "O"); inputLocked = false;}, 200);
        }
        else if (mode === "PVP"){
            let x = game.getPlayer();
            game.gameMove(pos);
            if (x === 0){
                gameboard.moveX(pos);
                display.updateCell(pos, "X");
            }
            else{
                gameboard.moveO(pos);
                display.updateCell(pos, "O");
            }
        }
        if(!checkGameEnd()) {
            updateInfo();
        }
    }

    const getNames = (name1, name2) => {
        if(name1)
            game.getPlayer1().setName(name1);
        if(name2)
            game.getPlayer2().setName(name2);
        updateScores();
        updateInfo();
    }

    const reset = () => {
        gameboard.reset();
        game.reset();
        game.resetPlayer();
        display.clearBoard();
        updateInfo(false);
    }

    return { init }
})();