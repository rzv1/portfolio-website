import {createPlayer} from './player.js'

export const game = (function() {
    const player1 = createPlayer("Player1");
    const player2 = createPlayer("Player2");

    let rows = [0, 0, 0], cols = [0, 0, 0], diag = 0, anti = 0, row = 0, col = 0;
    let player = 0;
    let move = 0;

    let reset = () => {
        move = 0;
        rows.fill(0); cols.fill(0); diag = 0; anti = 0;
    }

    const updatePlayer = () => {
        player = (player + 1) % 2;
    }

    const checkWinner = () => {
        if(Math.abs(rows[row]) === 3 || Math.abs(cols[col]) === 3 || Math.abs(diag) === 3 || Math.abs(anti) === 3)
            return player;
        return null;
    }

    const checkIsTie = () => {
        return move === 9;
    }

    const resetPlayer = () => {
        player = 0;
    }

    const getPlayer = () => {
        return player;
    }

    const getPlayer1 = () => {
        return player1;
    }

    const getPlayer2 = () => {
        return player2;
    }

    let gameMove = (pos) => {
        row = Math.floor(pos / 3); col = pos % 3;
        let s = player === 0 ? 1 : -1;
        rows[row] += s;
        cols[col] += s;
        if(row === col)
            diag += s;
        if(row + col === 2)
            anti += s;
        move++;
    }
    return { gameMove, getPlayer, getPlayer1, getPlayer2, updatePlayer, checkWinner, checkIsTie, resetPlayer, reset };
})();