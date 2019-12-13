window.onload = function () {
    let reelItem = (function () {
        return function (reelSelector, reelSpeed, spinTime, spinDelay) {

            const btnStart = document.querySelector('.btn-start');
            const reel = document.querySelector(reelSelector);
            const reelWrapper = reel.querySelector('.reel__wrapper');
            const landPositions = {
                top: 20,
                center: 30,
                bottom: 40
            };
            let ReelContainer = reel.querySelector('.reel__container');
            let symbols = ['3xBAR', 'BAR', '2xBAR', '7', 'CHERRY'];
            let translation = getRandomPosition();


            // function getRandomSymbols(symbols) {
            //     let j = 0,
            //         temp,
            //         mountOfElements = symbols.length;
            //
            //     while (mountOfElements--) {
            //         j = Math.floor(Math.random() * (mountOfElements + 1));
            //         temp = symbols[mountOfElements];
            //         symbols[mountOfElements] = symbols[j];
            //         symbols[j] = temp;
            //     }
            //     return symbols;
            // }

            // function setCertainPosition(symbolsArr, goalRow, goalSymbol) {
            //     if (goalRow && goalSymbol) {
            //         let winTranslation = landPositions[goalRow];
            //         while (symbolsArr[winTranslation] !== goalSymbol) {
            //             symbolsArr.unshift(symbolsArr.pop());
            //         }
            //     }
            // }

            function createReelContainer(randomSymbolsArr) {
                let newReelContainer = document.createElement('div');
                newReelContainer.className = 'reel__container';
                for (let i = 1; i <= reelSpeed; i++) {
                    let newReelWrapper = createReelWrapper(randomSymbolsArr);
                    newReelContainer.prepend(newReelWrapper);
                }
                let containerTranslation = translation - 100 * reelSpeed;
                setTranslation(newReelContainer, containerTranslation);
                setTransform(newReelContainer, spinTime, spinDelay);
                return newReelContainer;
            }

            function createReelWrapper(symbolsArr) {
                let newReelWrapper = document.createElement('div');
                newReelWrapper.className = 'reel__wrapper';
                createImages(symbolsArr, newReelWrapper);
                return newReelWrapper;
            }

            function createImages(symbolsArr, wrapper) {
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








            function getResults(translation) {
                let resultsArr = [];
                let j = symbols.length - 1;
                let i = 0;
                let firstSymbolTrans = translation - j * 20;
                while (firstSymbolTrans <= 40 ) {
                    if (firstSymbolTrans === landPositions.top) resultsArr[0] = symbols[i];
                    if (firstSymbolTrans === landPositions.center) resultsArr[1] = symbols[i];
                    if (firstSymbolTrans === landPositions.bottom) resultsArr[2] = symbols[i];
                    if (++i > j) i = 0;
                    firstSymbolTrans += 20;
                }
                return resultsArr;
            }

            function getFinishPosition(row, symbol) {
                if (!row && !symbol) return getRandomPosition();
                let trans = landPositions[row];
                let i = symbols.length;
                while (symbol !== symbols[--i]) {
                    trans += 20;
                    if (trans > 100) trans -=100;
                }
                return trans;
            }

            function getRandomPosition() {
                return Math.ceil(Math.random() * 10) * 10;
            }

            function setTranslation(element, translation) {
                element.style.transform = 'translateY(' + translation + '%)';
            }

            function setTransform(element, spinTime, spinDelay) {
                element.style.transition = 'transform ' + (spinTime + spinDelay) + 's cubic-bezier(.3,.13,.79,1.11)';
            }

            createImages(symbols, reelWrapper);
            ReelContainer.append(createReelWrapper(symbols));
            setTranslation(ReelContainer, translation);



            btnStart.addEventListener('click', () => {
                let reelContainer = reel.querySelector('.reel__container');
                let goalRow = document.querySelector('.goal-row').value;
                let goalSymbol = document.querySelector('.goal-symbol').value;

                removeWinLine();
                removeObsoleteItems();
                let newReelContainer = createReelContainer(symbols);
                reel.prepend(newReelContainer);
                setTransform(ReelContainer, spinTime, spinDelay);

                translation = getFinishPosition(goalRow, goalSymbol);
                let prevReelContainerTrans = 100 * reelSpeed + translation;
                results.push(getResults(translation));

                setTimeout(() => {
                    newReelContainer.style.transform = 'translateY(' + translation + '%)';
                    reelContainer.style.transform = 'translateY(' + prevReelContainerTrans + '%)';
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
    let spinTime = 2; //s
    let spinDelay = 0.5; //s

    reelItem('.reel__1', 4, spinTime, 0);
    reelItem('.reel__2', 5, spinTime, spinDelay);
    reelItem('.reel__3', 6, spinTime, spinDelay * 2);

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
        console.log(results);
        setTimeout(() => {
            checkResults(results);
            e.target.disabled = false;
        }, (spinTime + 2 * spinDelay) * 1000);
    });
};
