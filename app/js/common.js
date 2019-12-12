window.onload = function () {

    const btnStart = document.querySelector('.btn-start');
    const reel = document.querySelector('.reel');
    const reelWrapper = reel.querySelector('.reel__wrapper');
    const reelSpeed = 5;
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

    function createImage (symbolsArr, wrapper) {
        symbolsArr.forEach(function (item) {
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


    let randomSymbols = getRandomSymbols(symbols);
    createImage(randomSymbols, reelWrapper);

    btnStart.addEventListener('click', (e) => {
        e.target.disabled = true;
        let reelContainer = reel.querySelector('.reel__container');
        let goalRow = document.querySelector('.goal-row').value;
        let goalSymbol = document.querySelector('.goal-symbol').value;
        let randomSymbols = getRandomSymbols(symbols);

        removeObsoleteItems();
        setCertainPosition(randomSymbols, goalRow, goalSymbol);
        let newReelContainer = createReelContainer(randomSymbols);
        reel.prepend(newReelContainer);

        setTimeout(() => {
            newReelContainer.style.transform = 'translateY(' + translation + '%)';
            if (firstReelContainer) {
                firstReelContainer.style.transform = 'translateY(' + translation + '%)';
                firstReelContainer = null;
            } else reelContainer.style.transform = 'translateY(' + translation * 2 + '%)';
        });
        setTimeout(() => {
            e.target.disabled = false;
        }, 2000);
    });
};
