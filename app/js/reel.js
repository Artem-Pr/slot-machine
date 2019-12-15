let reelItem = (function () {
    return function (config) {
        const reel = document.querySelector(config.reelSelector);
        const reelWrapper = reel.querySelector('.reel__wrapper');
        const landPositions = {
            top: 20,
            center: 30,
            bottom: 40
        };
        let reelContainer = reel.querySelector('.reel__container');
        let symbols = ['3xBAR', 'BAR', '2xBAR', '7', 'CHERRY'];
        let translation = getRandomPosition();

        function createReelContainer(randomSymbolsArr) {
            let newReelContainer = document.createElement('div');
            newReelContainer.className = 'reel__container';
            for (let i = 1; i <= config.reelSpeed; i++) {
                let newReelWrapper = createReelWrapper(randomSymbolsArr);
                newReelContainer.prepend(newReelWrapper);
            }
            let containerTranslation = translation - 100 * config.reelSpeed;
            setTranslation(newReelContainer, containerTranslation);
            setTransform(newReelContainer, config.spinTime, config.spinDelay);
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
            let resultsArr = [null, null, null];
            let j = symbols.length - 1;
            let i = 0;
            let firstSymbolTrans = translation - j * 20;
            while (firstSymbolTrans <= 40) {
                if (firstSymbolTrans === landPositions.top) resultsArr[0] = symbols[i];
                if (firstSymbolTrans === landPositions.center) resultsArr[1] = symbols[i];
                if (firstSymbolTrans === landPositions.bottom) resultsArr[2] = symbols[i];
                if (++i > j) i = 0;
                firstSymbolTrans += 20;
            }
            return resultsArr;
        }

        function getFinishPosition(row, symbol) {
            if (!row || !symbol) return getRandomPosition();
            let trans = landPositions[row];
            let i = symbols.length;
            while (symbol !== symbols[--i]) {
                trans += 20;
                if (trans > 100) trans -= 100;
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
        reelContainer.append(createReelWrapper(symbols));
        setTranslation(reelContainer, translation);

        return (goalRow, goalSymbol) => {
            reelContainer = reel.querySelector('.reel__container');
            removeObsoleteItems();

            let newReelContainer = createReelContainer(symbols);
            reel.prepend(newReelContainer);
            setTransform(reelContainer, config.spinTime, config.spinDelay);

            translation = getFinishPosition(goalRow, goalSymbol);
            let prevReelContainerTrans = 100 * config.reelSpeed + translation;

            setTimeout(() => {
                newReelContainer.style.transform = 'translateY(' + translation + '%)';
                reelContainer.style.transform = 'translateY(' + prevReelContainerTrans + '%)';
            });

            return getResults(translation);
        };

    }
}());