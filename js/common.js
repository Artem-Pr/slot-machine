window.onload = function () {
    let balanceElem = document.querySelector('.balance');
    let btnStart = document.querySelector('.btn-start');
    let selectElems = document.querySelectorAll('select');
    let radioElems = document.querySelectorAll('input[type=\'radio\']');
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
    let muted = true;
    let soundWheel = null;
    let soundPayOff = null;
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
        if (+balanceElem.value > 0) return true;
        let modal = document.querySelector('.modal');
        modal.classList.add('active');
        setTimeout(() => {
            modal.classList.add('show');
        });
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
        }, 5000);
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
        if (!muted) setSounds('play', soundPayOff);
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

    function disableElements(isDisabled) {
        btnStart.disabled = isDisabled;
        balanceElem.disabled = isDisabled;
        selectElems.forEach((item) => item.disabled = isDisabled);
        radioElems.forEach((item) => item.disabled = isDisabled);
    }

    function initSounds() {
        if (!soundPayOff) soundPayOff = new Audio('../sounds/slot-payoff.wav');
        if (!soundWheel) soundWheel = new Audio('../sounds/wheel4.wav');
    }

    function setSounds(action, elem, currentTime = 0) {
        if (action === 'init') {initSounds(); return;}
        if (action === 'play') elem.play();
        if (action === 'stop') elem.pause();
        elem.currentTime = currentTime;
    }

    btnStart.addEventListener('click', (e) => {
        if (!allowGame(balanceElem)) return;
        if (!muted) setSounds('play', soundWheel, 2);
        let randomMode = document.querySelector('#random').checked;
        --balanceElem.value;
        disableElements(true);
        results.push(startSpin1(randomMode, '.goal-row-right', '.goal-symbol-right'));
        results.push(startSpin2(randomMode, '.goal-row-middle', '.goal-symbol-middle'));
        results.push(startSpin3(randomMode, '.goal-row-left', '.goal-symbol-left'));
        removeWinLine();

        setTimeout(() => {
            if (!muted) setSounds('stop', soundWheel);
            let points = getAllPoints(results);
            if (points >= 1000) showWinPoints(points);
            increaseBalance(balanceElem, points);
            results = [];
            disableElements(false);
        }, (spinTime + 2 * spinDelay) * 1000);
    });

    document.getElementById('balance').onkeydown = function (e) {
        let numberSrt = e.target.value;
        let newNumberStr = numberSrt + e.key;
        if (+newNumberStr > 5000) {
            e.preventDefault();
            e.target.value = 5000;
            return ;
        }
        return !(/^[\D]$/.test(e.key));
    };

    document.querySelector('.modal__close').addEventListener('click', () => {
        let modal = document.querySelector('.modal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.remove('active');
        }, 300);
    });

    document.querySelectorAll('.speaker').forEach(speaker => {
        speaker.addEventListener('click', (e) => {
            e.target.classList.remove('active');
            if (muted) {
                document.querySelector('.unmuted').classList.add('active');
                setSounds('init');
                muted = false;
            } else {
                document.querySelector('.muted').classList.add('active');
                setSounds('stop', soundWheel);
                setSounds('stop', soundPayOff);
                muted = true;
            }
        })
    })
};
