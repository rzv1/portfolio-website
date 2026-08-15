
// IIFE gameboard & displayCntrl

//Player Object stores names, scores,
//Game Object stores robot_moves, player_moves, checks for game end
//Gameboaes stores the board placement

export const gameboard = (function () {
    let board = ['-', '-', '-', '-', '-', '-', '-', '-', '-'];
    let moveX = (pos) => {
        board[pos] = 'X';
        console.log("Moved X");
    }
    let moveO = (pos) => {
        board[pos] = 'O';
        console.log("Moved O");
    }
    const isEmpty = (pos) =>  board.at(pos) === '-';

    let reset = () => {
        board.fill('-');
    }

    const isWinningMove = (playerSymbol, pos) => {
        const temp = board.slice();
        temp[pos] = playerSymbol;

        const wins = [[0,1,2],[3,4,5],[6,7,8],  [0,3,6],[1,4,7],[2,5,8],  [0,4,8],[2,4,6]];

        return wins.some(line => temp[line[0]] === playerSymbol &&
            temp[line[1]] === playerSymbol &&
            temp[line[2]] === playerSymbol);
    }

    const getEmptyPos = () => {
        let l = [];
        for (let i = 0; i < 9; i++)
            if(isEmpty(i))
                l.push(i);
        return l;
    }

    const computerMove = (mySymbol, yourSymbol) => {
        const empty = getEmptyPos();

        for(const pos of empty)
            if (isWinningMove(mySymbol, pos))
                return pos;

        for(const pos of empty)
            if (isWinningMove(yourSymbol, pos))
                return pos;

        const idx = Math.floor(Math.random() * empty.length);
        return empty[idx];
    }

    // Console Logs
    const display = () => {
        let k = 0;
        for(let i = 0; i < 3; i++){
            let s = "";
            for(let j = 0; j < 3; j++){
                s += board[j];
                k++;
            }
            console.log(s);
        }
    }

    return { moveX, moveO, isEmpty, computerMove, reset, display };
})();