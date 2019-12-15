window.onload = function () {
    let balanceElem = document.querySelector('.balance');
    let goalRowElem = document.querySelector('.goal-row');
    let goalSymbolElem = document.querySelector('.goal-symbol');
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
        let line = document.querySelector('.win-line' + (lineNumb+1));
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

    function getAllPoints(resultsArr) {
        let pointsArr = resultsArr[0];
        return pointsArr.reduce((accum, item, i) => {
            let score = 0;
            if (item === resultsArr[1][i] && item === resultsArr[2][i]) {
                score = getOneLinePoints(item, i);
            } else if (winKits[item] === winKits[resultsArr[1][i]] &&
                winKits[item] === winKits[resultsArr[2][i]]) {
                score = getOneLinePoints(winKits[item], i);
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
        modalText.textContent = points;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 5000)
    }

    document.querySelector('.btn-start').addEventListener('click', (e) => {
        let goalRow = goalRowElem.value;
        let goalSymbol = goalSymbolElem.value;
        if (!allowGame(balanceElem)) return;
        --balanceElem.value;
        e.target.disabled = true;
        results.push(startSpin1(goalRow, goalSymbol));
        results.push(startSpin2(goalRow, goalSymbol));
        results.push(startSpin3(goalRow, goalSymbol));
        removeWinLine();

        setTimeout(() => {
            let points = getAllPoints(results);
            if (points) showWinPoints(points);
            balanceElem.value = +balanceElem.value + points;
            results = [];
            e.target.disabled = false;
        }, (spinTime + 2 * spinDelay) * 1000);
    });
};
