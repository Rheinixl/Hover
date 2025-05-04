let round = 1;
let switchCount = 0;
let startTime, endTime;
let activeWindow = 'typing';
let results = [];
let errorCount = 0;
let isCtrlPressed = false;
const paragraphs = [
    "Cook draws from Yothers the foundational concept that Melville’s writing is shaped by a lifelong engagement with religious doubt and “sacred uncertainty.” Yothers’s idea that Melville approaches religion not through orthodox belief or fixed skepticism but through an ongoing, morally serious questioning provides a framework for understanding the complexities of Melville’s “quarrel with God.”",
    "For instance, he doesn’t discuss Yothers’s treatment of Battle-Pieces, Melville’s poetry, or the thematic analysis of religious difference and transcultural dialogues in Clarel or other late works. He also doesn’t talk about Yothers’s commitment to exploring “difference” rather than “skepticism” or “pluralism,” or how Yothers sees Melville’s work as an interfaith encounter across global traditions."
];
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffleArray(paragraphs);
document.getElementById('textTab').addEventListener('click', () => {
    if (round === 1) {
        activeWindow = 'para';
        updateWindowVisibility();
        switchCount++;
    }
});

document.getElementById('typeTab').addEventListener('click', () => {
    if (round === 1) {
        activeWindow = 'typing';
        updateWindowVisibility();
        switchCount++;
    }
});



function updateWindowVisibility() {
    const paraWindow = document.getElementById('paraWindow');
    const typingWindow = document.getElementById('inputWindow');
    paraWindow.style.display = activeWindow === 'para' ? 'block' : 'none';
    typingWindow.style.display = activeWindow === 'typing' ? 'block' : 'none';
}

function handleHover(e) {
    const paraWindow = document.getElementById('paraWindow');
    if (e.key === 'Control') {
        if (e.type === 'keydown' && !isCtrlPressed) {
            isCtrlPressed = true;
            paraWindow.style.display = 'block';
            paraWindow.style.opacity = 0.8;
            switchCount++;
        }
        if (e.type === 'keyup') {
            isCtrlPressed = false;
            paraWindow.style.display = 'none';
        }
    }
}


document.getElementById('startRound').addEventListener('click', () => {
    if (round <= 2) {
        // Show the tab bar and window container when starting
        document.getElementById('tabBar').style.display = 'block';
        document.getElementById('windowContainer').style.display = 'block';

        document.getElementById('typingArea').value = '';
        switchCount = 0;
        errorCount = 0;
        activeWindow = 'typing';
        // Set the current round's paragraph
        document.getElementById('paragraph').textContent = paragraphs[round - 1];
        updateWindowVisibility();
        document.getElementById('roundNum').textContent = round;

        document.getElementById('startRound').disabled = true;

        if (round === 2) {
            alert('Reminder: In this round, hold the Ctrl key to temporarily show the text window.');
            document.addEventListener('keydown', handleHover);
            document.addEventListener('keyup', handleHover);
        }

        startTime = new Date();
    }
});


document.getElementById('typingArea').addEventListener('input', () => {
    const typed = document.getElementById('typingArea').value;
    const target = document.getElementById('paragraph').textContent;

    if (typed.length >= target.length) {
        errorCount = 0;
        for (let i = 0; i < target.length; i++) {
            if (typed[i] !== target[i]) {
                errorCount++;
            }
        }
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        alert(`Round ${round} done!\nTime: ${timeTaken}s\nSwitches: ${switchCount}`);
        results.push({ round, timeTaken, switchCount, errorCount });

        // Hide windows and tabs
        document.getElementById('tabBar').style.display = 'none';
        document.getElementById('windowContainer').style.display = 'none';

        round++;

        if (round <= 2) {
            document.getElementById('roundNum').textContent = round;
            document.getElementById('typingArea').value = '';
            switchCount = 0;
            activeWindow = 'typing';
            updateWindowVisibility();
            document.getElementById('startRound').disabled = false;
            alert('Click "Start Round" to begin Round ' + round);
        } else {
            alert('Test complete! Downloading results...');
            downloadResults();
            document.getElementById('startRound').disabled = true;
        }
    }

});



function downloadResults() {
    let csvContent = "data:text/csv;charset=utf-8,Round,Time(s),Switches,Errors\n";
    results.forEach(r => {
        csvContent += `${r.round},${r.timeTaken},${r.switchCount},${r.errorCount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);
    link.click();
}
