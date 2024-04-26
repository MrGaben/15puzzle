document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('puzzle-container');
    const stopwatch = document.getElementById('stopwatch');
    const tiles = [];
    let moves = -1;
    let startTime;
    let intervalId;

    function createTile(number) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = number;
        tile.dataset.number = number;
        tile.addEventListener('click', () => {
            if (!startTime) {
                startTime = new Date().getTime();
                intervalId = setInterval(updateStopwatch, 1000);
            }
            moveTile(tile);
        });
        return tile;
    }

    function updateStopwatch() {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        const minutes = Math.floor(elapsedTime / (1000 * 60));
        const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        div1.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }


    function shuffleTiles() {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        renderTiles();
    }

    function isSolved() {
        return tiles.every((tile, index) => tile.dataset.number == index + 1);
    }

    function moveTile(tile) {
        const emptyTile = tiles.find(tile => tile.dataset.number == 16);
        const tileIndex = tiles.indexOf(tile);
        const emptyIndex = tiles.indexOf(emptyTile);

        if (tileIndex === emptyIndex - 1 || tileIndex === emptyIndex + 1 ||
            tileIndex === emptyIndex - 4 || tileIndex === emptyIndex + 4) {
            [tiles[tileIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[tileIndex]];
            renderTiles();
            if (isSolved()) {
                clearInterval(intervalId);
                alert('Gratulálok sikeresen megoldotta a 15 puzzle-t!');
            }
        }
    }

    function renderTiles() {
        let movestoHtml = document.getElementById("moves");
        moves++;
        div2.innerHTML = "Moves: " + moves;
        container.innerHTML = '';
        tiles.forEach(tile => container.appendChild(tile));
    }


    for (let i = 1; i <= 15; i++) {
        const tile = createTile(i);
        tiles.push(tile);
    }
    const emptyTile = document.createElement('div');
    emptyTile.classList.add('tile');
    emptyTile.dataset.number = 16;
    emptyTile.textContent = ''; 
    tiles.push(emptyTile);

    shuffleTiles();
});
