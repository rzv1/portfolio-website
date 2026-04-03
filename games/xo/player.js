export function createPlayer(n) {
    let name = n;
    let score = 0;
    const getScore = () => score;
    const giveScore = () => score++;
    const resetScore = () => score = 0;
    const getName = () => name;
    const setName = (newName) => name = newName;

    return { getScore, giveScore, resetScore, getName, setName };
}