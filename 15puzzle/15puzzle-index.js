document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('puzzle-container');
    const stopwatch = document.getElementById('stopwatch');
    const tiles = [];
    let numbre = 1;
    let moves = -1;
    let startTime;
    let intervalId;

$("#file").on("change", function () {
    var file = this.files[0];
    if (!file) {
        // No file selected, exit
        return;
    }

    var filename = file.name,
        $label = $(this).next(".file-custom"),
        $preview = $("#preview"),
        img = document.createElement("img"),
        reader = new FileReader();

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    img.file = file;
    img.classList.add("img-responsive");
    $preview.html(img);

    reader.onload = function (e) {
        img.src = e.target.result;
    };

    reader.onerror = function () {
        alert("There was an error reading the file.");
    };

    reader.readAsDataURL(file);

    $label.attr("data-label", filename).addClass("active");
});


    document.getElementById('file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function() {
                const { width, height } = this;
    
                const containerWidth = 400; // A puzzle-container szélessége
                const containerHeight = 400; // A puzzle-container magassága
    
                const tileWidth = containerWidth / 4;
                const tileHeight = containerHeight / 4;
    
                const backgroundImageUrl = `url(${image.src})`;
    
                tiles.forEach((tile, index) => {
                    if (index !== 15) { // Csak az első 14 csempébe rakjuk be a képet
                        const row = Math.floor(index / 4);
                        const col = index % 4;
                        tile.style.backgroundImage = backgroundImageUrl;
                        tile.style.backgroundSize = `${containerWidth}px ${containerHeight}px`;
                        tile.style.backgroundPosition = `-${col * tileWidth}px -${row * tileHeight}px`;
                        tile.dataset.number = numbre
                        numbre++
                    } else {
                        tile.dataset.number = '16'; // Az üres csempe egyedi azonosítója
                    }
                });
    
                shuffleTiles(); // Összekeverjük a csempéket
            };
        };
        reader.readAsDataURL(file);
    });
    
    function createTile(imageSrc, number) {
        const tileContainer = document.createElement('div');
        tileContainer.classList.add('tile');
        const tile = document.createElement('div');
        tile.classList.add('tile-image');
        tile.style.backgroundImage = `url(${imageSrc})`;
        tileContainer.appendChild(tile);
        tileContainer.addEventListener('click', () => {
            if (!startTime) {
                startTime = new Date().getTime();
                intervalId = setInterval(updateStopwatch, 1000);
            }
            moveTile(tileContainer);
        });
        return tileContainer;
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
                alert('Gratulálok sikeresen megoldotta a puzzle-t!');
                
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
    emptyTile.textContent = ''; 
    tiles.push(emptyTile);
});
