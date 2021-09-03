window.addEventListener('DOMContentLoaded', () => {
    class AudioController {
        constructor() {
            this.matchSound = new Audio('Audio/match-sound.mp3');
            this.victorySound = new Audio('Audio/victory.mp3');
            this.gameOverSound = new Audio('Audio/game-over.mp3');
        }
        match() {
            this.matchSound.play();
        }
        victory() {
            this.victorySound.play();
        }
        gameOver() {
            this.gameOverSound.play();
        }
    }

    class MemoryGame {
        constructor(totalTime, cards) {
            this.cardsArray = cards;
            this.totalTime = totalTime;
            this.timeRemaining = totalTime;
            this.timer = document.getElementById('timer');
            this.flips = document.getElementById('flips');
            this.audioController = new AudioController();
        }
    
        startGame() {
            this.totalClicks = 0;
            this.timeRemaining = this.totalTime;
            this.cardToCheck = null;
            this.matchedCards = [];
            this.busy = true;
            setTimeout(() => {
                this.mixCards(this.cardsArray);
                this.countdown = this.startCountdown();
                this.busy = false;
            }, 500);
            this.hideCards();
            this.timer.innerText = this.timeRemaining;
            this.flips.innerText = this.totalClicks;
        }
    
        startCountdown() {
            return setInterval(() => {
                this.timeRemaining--;
                this.timer.innerText = this.timeRemaining;
                if(this.timeRemaining === 0) {
                    this.gameOver();
                }
            }, 1000);
        }
    
        gameOver() {
            clearInterval(this.countdown);
            this.audioController.gameOver();
            document.getElementById('game-over').classList.add('visible');
        }
    
        gameVictory() {
            clearInterval(this.countdown);
            this.audioController.victory();
            document.getElementById('victory').classList.add('visible');
        }
    
        hideCards() {
            this.cardsArray.forEach(card => {
                card.classList.remove('is-flipped');
            });
        }
    
        flipCard(card) {
            if(this.canFlipCard(card)) {
                this.totalClicks++;
                this.flips.innerText = this.totalClicks;
                card.classList.add('is-flipped');
    
                if(this.cardToCheck) {
                    this.checkForCardMatch(card);
                } else {
                    this.cardToCheck = card;
                }
            }
        }
    
        checkForCardMatch(card) {
            if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
                this.cardMatch(card, this.cardToCheck);
            } else {
                this.cardMismatch(card, this.cardToCheck);
            }
            this.cardToCheck = null;
        }
    
        cardMatch(card1, card2) {
            this.matchedCards.push(card1);
            this.matchedCards.push(card2);
            this.audioController.match();
            if(this.matchedCards.length === this.cardsArray.length) {
                this.gameVictory();
            }
        }
    
        cardMismatch(card1, card2) {
            this.busy = true;
            setTimeout(() => {
                card1.classList.remove('is-flipped');
                card2.classList.remove('is-flipped');
                this.busy = false;
            }, 1000);
        }
    
        mixCards(cards) {
            cards.forEach(card => {
                const randomIndex = Math.floor(Math.random() * cards.length);
                card.parentElement.style.order = randomIndex;
            });
        }
    
        getCardType(card) {
            return card.dataset.span;
        }
        canFlipCard(card) {
            return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
        }
    }
    
    function ready() {
        let overlays = Array.from(document.getElementsByClassName('overlay-text'));
        let cards = Array.from(document.getElementsByClassName('card__inner'));
        let game = new MemoryGame(100, cards);
    
        overlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.classList.remove('visible');
                game.startGame();
            });
        });
    
        cards.forEach(card => {
            card.addEventListener('click', () => {
                game.flipCard(card);
            });
        });
    }
    
    ready();
});