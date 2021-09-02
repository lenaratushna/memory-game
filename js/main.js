const cardInners = document.querySelectorAll('.card__inner');
const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let boardLocked = false;
let firstCard, secondCard;

const flipCard = e => {
    if(boardLocked) {
        return;
    }

    const target = e.target.parentElement;

    if(target === firstCard) {
        return;
    }

    target.classList.add('is-flipped');

    if(!hasFlippedCard) {
        //First click
        hasFlippedCard = true;
        firstCard = target;
    } else {
        //Second click
        hasFlippedCard = false;
        secondCard = target;
        //Check for match
        checkForMatch();
    }
};

const checkForMatch = () => {
    const isEqual = firstCard.dataset.span === secondCard.dataset.span;

    isEqual ? disableCards() : unflipCards();
};

const disableCards = () => {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
};

const unflipCards = () => {
    boardLocked = true;
    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');
        resetBoard();
    }, 1000);
};

const resetBoard = () => {
    hasFlippedCard = boardLocked = false;
    firstCard = secondCard = null;
};

cardInners.forEach(card => {
    card.addEventListener('click', flipCard);
});

cards.forEach(card => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    console.log(randomIndex);
    card.style.order = randomIndex;
});
