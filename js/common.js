window.onload = function () {

    const btnStart = document.querySelector('.btn-start');
    const reel = document.querySelector('.reel');
    let reelStage = reel.querySelector('.reel__stage');
    const reelWrapper = reelStage.querySelector('.reel__wrapper');
    let symbols = ['BAR', '2xBAR', '3xBAR', '7', 'CHERRY'];
    const landPositions = {
        top: 1,
        center: 2,
        bottom: 3
    };


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

    let randomSymbols = getRandomSymbols(symbols);

    randomSymbols.forEach(function (item) {
        let reelImg = document.createElement('img');
        reelImg.src = 'img/reel/' + item + '.png';
        reelImg.alt = item;
        reelImg.className = 'reel__img';
        reelWrapper.append(reelImg);
    });

    function setCertainPosition(symbolsArr, goalRow, goalSymbol) {
        if (goalRow && goalSymbol) {
            let rowNumber = landPositions[goalRow];
            while (symbolsArr[rowNumber] !== goalSymbol) {
                symbolsArr.unshift(symbolsArr.pop());
            }
        }
    }


    btnStart.addEventListener('click', () => {
        let goalRow = document.querySelector('.goal-row').value;
        let goalSymbol = document.querySelector('.goal-symbol').value;
        let transform = 0;

        if (reel.childElementCount > 1) reel.children[1].remove();
        reelStage = reel.querySelector('.reel__stage');

        let randomSymbols = getRandomSymbols(symbols);
        setCertainPosition(randomSymbols, goalRow, goalSymbol);

        let newReelStage = document.createElement('div');
        newReelStage.className = 'reel__stage';
        for (let i = 1; i <= 5; i++) {
            transform = 100 * i;
            let newReelWrapper = document.createElement('div');
            newReelWrapper.className = 'reel__wrapper';

            randomSymbols.forEach(function (item) {
                let reelImg = document.createElement('img');
                reelImg.src = 'img/reel/' + item + '.png';
                reelImg.alt = item;
                reelImg.className = 'reel__img';
                newReelWrapper.append(reelImg);
            });
            newReelStage.prepend(newReelWrapper);
            newReelWrapper.style.transform = 'translateY(' + -transform + '%)';
        }
        reel.prepend(newReelStage);

        setTimeout(() => {
            newReelStage.style.transform = 'translateY(' + transform + '%)';
            reelStage.style.transform = 'translateY(' + transform * 2 + '%)';
        });

    });

};
