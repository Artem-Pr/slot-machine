window.onload = function () {
    let reelItem = (function () {
        return function (reelSelector, speed) {

            const btnStart = document.querySelector('.btn-start');
            const reel = document.querySelector(reelSelector);
            const reelWrapper = reel.querySelector('.reel__wrapper');
            const reelSpeed = speed;
            const landPositions = {
                top: 1,
                center: 2,
                bottom: 3
            };
            let firstReelContainer = reel.querySelector('.reel__container');
            let symbols = ['BAR', '2xBAR', '3xBAR', '7', 'CHERRY'];
            let translation = 0;


            function getRandomSymbols(symbols) {
                let j = 0,
                    temp,
                    mountOfElements = symbols.length;

                while (mountOfElements--) {
                    j = Math.floor(Math.random() * (mountOfElements + 1));
                    temp = symbols[mountOfElements];
                    symbols[mountOfElements] = symbols[j];
                    symbols[j] = temp;
                }
                return symbols;
            }

            function setCertainPosition(symbolsArr, goalRow, goalSymbol) {
                if (goalRow && goalSymbol) {
                    let rowNumber = landPositions[goalRow];
                    while (symbolsArr[rowNumber] !== goalSymbol) {
                        symbolsArr.unshift(symbolsArr.pop());
                    }
                }
            }

            function createReelContainer(randomSymbolsArr) {
                let newReelContainer = document.createElement('div');
                newReelContainer.className = 'reel__container';
                for (let i = 1; i <= reelSpeed; i++) {
                    translation = 100 * i;
                    let newReelWrapper = createReelWrapper(randomSymbolsArr);
                    newReelContainer.prepend(newReelWrapper);
                }
                return newReelContainer;
            }

            function createReelWrapper(randomSymbolsArr) {
                let newReelWrapper = document.createElement('div');
                newReelWrapper.className = 'reel__wrapper';
                createImage(randomSymbolsArr, newReelWrapper);
                newReelWrapper.style.transform = 'translateY(' + -translation + '%)';
                return newReelWrapper;
            }

            function createImage(symbolsArr, wrapper) {
                symbolsArr.forEach(item => {
                    let reelImg = document.createElement('img');
                    reelImg.src = 'img/reel/' + item + '.png';
                    reelImg.alt = item;
                    reelImg.className = 'reel__img';
                    wrapper.append(reelImg);
                });
            }

            function removeObsoleteItems() {
                if (reel.childElementCount > 1) reel.children[1].remove();
            }

            function addWinResult(symbols) {
                if (reelSelector === '.reel__1') results = [symbols[1], symbols[2], symbols[3]];
                else results.forEach((item, i, array) => {
                    if (item === symbols[i+1]) return;
                    if (winKits[item] === winKits[symbols[i+1]]) array[i] = winKits[item];
                })
            }


            let randomSymbols = getRandomSymbols(symbols);
            createImage(randomSymbols, reelWrapper);

            btnStart.addEventListener('click', () => {
                let reelContainer = reel.querySelector('.reel__container');
                let goalRow = document.querySelector('.goal-row').value;
                let goalSymbol = document.querySelector('.goal-symbol').value;
                let randomSymbols = getRandomSymbols(symbols);

                removeWinLine();
                removeObsoleteItems();
                setCertainPosition(randomSymbols, goalRow, goalSymbol);
                let newReelContainer = createReelContainer(randomSymbols);
                reel.prepend(newReelContainer);

                results.push(randomSymbols.slice(1,4));

                // addWinResult(randomSymbols);
                setTimeout(() => {
                    newReelContainer.style.transform = 'translateY(' + translation + '%)';
                    if (firstReelContainer) {
                        firstReelContainer.style.transform = 'translateY(' + translation + '%)';
                        firstReelContainer = null;
                    } else reelContainer.style.transform = 'translateY(' + translation * 2 + '%)';
                });
            });

        }
    }());

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
    reelItem('.reel__1', 8);
    reelItem('.reel__2', 10);
    reelItem('.reel__3', 12);

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
    
    function calcWinScore(symbol, i) {
        console.log(winPoints[symbol + '_' + i]);
        if (symbol === null) return;
        highlightWinLine(winPoints[symbol + '_' + i], i);
    }

    function checkResults(resultsArr) {
        resultsArr[0].forEach((item, i) => {
            if (item === resultsArr[1][i] && item === resultsArr[2][i]) {
                calcWinScore(item, i);
                return;
            }
            if (winKits[item] === winKits[resultsArr[1][i]] &&
                winKits[item] === winKits[resultsArr[2][i]]) {
                calcWinScore(winKits[item], i);
                return;
            }
            calcWinScore(null);
        });
        results = [];
        console.log('------');
    }

    document.querySelector('.btn-start').addEventListener('click', (e) => {
        e.target.disabled = true;
        setTimeout(() => {
            checkResults(results);
            e.target.disabled = false;
        }, 3000);
    });
};
