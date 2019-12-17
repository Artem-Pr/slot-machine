window.onload = function () {
    let balanceElem = document.querySelector('.balance');
    let winKits = {
        'BAR': 'kit1',
        '2xBAR': 'kit1',
        '3xBAR': 'kit1',
        '7': 'kit2',
        'CHERRY': 'kit2'
    };
    let winPoints = {
        'CHERRY_0': 2000,
        'CHERRY_1': 1000,
        'CHERRY_2': 4000,
        '7_0': 150,
        '7_1': 150,
        '7_2': 150,
        'kit2_0': 75,
        'kit2_1': 75,
        'kit2_2': 75,
        '3xBAR_0': 50,
        '3xBAR_1': 50,
        '3xBAR_2': 50,
        '2xBAR_0': 20,
        '2xBAR_1': 20,
        '2xBAR_2': 20,
        'BAR_0': 10,
        'BAR_1': 10,
        'BAR_2': 10,
        'kit1_0': 5,
        'kit1_1': 5,
        'kit1_2': 5,
    };
    let results = [];
    let spinTime = 2; //s
    let spinDelay = 0.5; //s
    let startSpin1 = reelItem({
        reelSelector: '.reel__1',
        reelSpeed: 4,
        spinTime,
        spinDelay: 0,
    });
    let startSpin2 = reelItem({
        reelSelector: '.reel__2',
        reelSpeed: 5,
        spinTime,
        spinDelay,
    });
    let startSpin3 = reelItem({
        reelSelector: '.reel__3',
        reelSpeed: 6,
        spinTime,
        spinDelay: spinDelay * 2,
    });

    function highlightWinLine(score, lineNumb) {
        let line = document.querySelector('.win-line' + (lineNumb + 1));
        if (score >= 1000) line.classList.add('active-red');
        else line.classList.add('active-yellow');
    }

    function removeWinLine() {
        let lines = document.querySelectorAll('.win-line');
        for (let i = 0; i < lines.length; i++) {
            lines[i].classList.remove('active-red', 'active-yellow');
        }
    }

    function allowGame(balanceElem) {
        if (balanceElem.value > 0) return true;
        alert("You do not have enough points to play! Please recharge points");
        return false;
    }

    function getOneLinePoints(symbol, i) {
        if (!symbol) return 0;
        return winPoints[symbol + '_' + i]
    }
    
    function blinkPoints(score) {
        if (!score) return;
        let blinkElem = document.querySelector('.p' + score);
        blinkElem.classList.add('blink-points');
        setTimeout(() => {
            blinkElem.classList.remove('blink-points');
        }, 3000);
    }

    function getAllPoints(resultsArr) {
        let pointsArr = resultsArr[0];
        return pointsArr.reduce((accum, item, i) => {
            let score = 0;
            if (item === resultsArr[1][i] && item === resultsArr[2][i]) {
                score = getOneLinePoints(item, i);
                blinkPoints(score);
            } else if (winKits[item] === winKits[resultsArr[1][i]] &&
                winKits[item] === winKits[resultsArr[2][i]]) {
                score = getOneLinePoints(winKits[item], i);
                blinkPoints(score);
            }
            if (score !== 0) {
                highlightWinLine(score, i);
            }
            return score + accum;
        }, 0);
    }

    function showWinPoints(points) {
        let modal = document.querySelector('.win-modal');
        let modalText = modal.querySelector('.win-modal__score');
        let audio = new Audio('../sounds/slot-payoff.wav');
        audio.play();
        modalText.textContent = points;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 5000)
    }

    function increaseBalance(balanceElem, receivedPoints) {
        if (!receivedPoints) return;
        let balance = +balanceElem.value;
        let newBalance = balance + receivedPoints;
        let counter;
        if (receivedPoints < 1000) counter = 1;
        if (receivedPoints >= 1000 && receivedPoints <= 2500) counter = 4;
        if (receivedPoints > 2500) counter = 8;

        let timerId = setInterval(() => {
            for (let i = 1; i <= counter; i++) {
                if (balance === newBalance) {
                    balanceElem.value = balance;
                    clearInterval(timerId);
                    return;
                }
                ++balance;
            }
            balanceElem.value = balance;
        }, 10);
    }

    document.querySelector('.btn-start').addEventListener('click', (e) => {
        if (!allowGame(balanceElem)) return;

        let audio = new Audio('../sounds/wheel4.wav');
        audio.play();

        let randomMode = document.querySelector('#random').checked;
        --balanceElem.value;
        e.target.disabled = true;
        results.push(startSpin1(randomMode, '.goal-row-right', '.goal-symbol-right'));
        results.push(startSpin2(randomMode, '.goal-row-middle', '.goal-symbol-middle'));
        results.push(startSpin3(randomMode, '.goal-row-left', '.goal-symbol-left'));
        removeWinLine();

        setTimeout(() => {
            audio.pause();
            let points = getAllPoints(results);
            if (points >= 1000) showWinPoints(points);
            increaseBalance(balanceElem, points);
            results = [];
            e.target.disabled = false;
        }, (spinTime + 2 * spinDelay) * 1000);
    });

    document.getElementById('balance').onkeydown = function (e) {
        return !(/^[\D]$/.test(e.key));
    }
};
