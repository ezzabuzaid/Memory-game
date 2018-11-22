import { CARDS_LIST } from "./data";
import { Subject } from "./utils/notifier";
import { Utility } from "./utils/utility";
const movesSubject = new Subject();

interface MemoryGame { }
class MemoryGameHelper {
    private static moves = 0;
    private static cards: MemoryCard[] = []
    private static resetCards() {
        this.cards.forEach(el => el = null);
        this.cards = [];
    }
    private static flipCard(card) {
        card.classList.toggle('flip');
    }

    private static cardsCount(len): boolean {
        return this.cards.length === len;
    }

    private static addCard(card: MemoryCard) {
        this.cards.push(card);
    }

    private static getCard(index: number) {
        return this.cards[index];
    }

    private static disFlipCard(...card: MemoryCard[]) {
        card.forEach(el => el.flipable = false);
    }

    static async setCard(card: MemoryCard) {
        if (!card.flipable) return;
        if (this.cardsCount(0)) {
            this.addCard(card);
            this.flipCard(card);
            this.move();
        } else {
            if (this.cardsCount(1) && this.getCard(0).hash !== card.hash) {
                this.addCard(card);
                this.flipCard(card);
                this.move();
                const equal = await this.compare(this.getCard(0), this.getCard(1));
                if (equal) {
                    this.disFlipCard(this.getCard(0), this.getCard(1));
                };
                this.resetCards();
            }
        }
    }
    static compare(first, second) {
        return new Promise((resolve) => {
            if (first.value === second.value) {
                resolve(true);
            } else {
                setTimeout(() => {
                    second.classList.toggle('flip');
                    first.classList.toggle('flip');
                    resolve(false);
                }, 750);
            }
        })
    }
    private static move() {
        movesSubject.notify(++this.moves);
    };
    static get getMoves() {
        return this.moves;
    }
}
class MemoryGame extends HTMLElement {
    cardList = Utility.shuffleList(Utility.dublicateList(CARDS_LIST));
    constructor() {
        super();
        this.initTemplate(this.template(this.initCards));
    }
    get initCards() {
        return this.cardList.reduce((acc, curr) => acc += `
        <div class="col-md-2 col-4 mb-3">
            <memory-card value="${curr.value}" image="${curr.image}"></memory-card>
        </div>`,
            '')
    }
    private template(content) {
        return `
            <div class="row card-wrapper" id="card_wrapper">${content}</div>
        `;
    }
    private initTemplate(content) {
        this.insertAdjacentHTML('afterbegin', content);
    }
}
class MemoryCard extends HTMLElement implements Card {
    flipped = false;
    flipable = true;
    hash = Math.random() * Math.PI;
    constructor() {
        super();
        this.initTemplate();
        this.addEventListener('click', () => {
            this.catchMe();
        })
    }
    private static get observedAttributes() {
        return ['value', 'image'];
    }
    private set value(v) {
        this.setAttribute('value', v);
    }
    private get value() {
        return this.getAttribute('value');
    }
    private set image(v) {
        this.setAttribute('image', v);
    }
    private get image() {
        return this.getAttribute('image');
    }
    private template() {
        return `<div class="position-relative">
            <div class="front">
                <img class="img-fluid" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Circle-question.svg">
            </div>
            <div class="back">
                <img class="img-fluid h-100" src="${this.image}">
            </div>
        </div>`;
    }
    private initTemplate() {
        this.classList.add('flip_able');
        this.insertAdjacentHTML('afterbegin', this.template());
    }

    catchMe() {
        MemoryGameHelper.setCard(this);
    }
}
class MemoryHeader extends HTMLElement {
    update(notifcation) {
        this.querySelector('[data-memory-move]').textContent = notifcation;
    }

    constructor() {
        super();
        movesSubject.subscribe(this);
        this.initTemplate();
    }

    private initTemplate() {
        this.insertAdjacentHTML('afterbegin', this.template());
    }

    private template() {
        return `
        <div class="mt-3 text-center">
            <span>Moves <span data-memory-move></span></span>
            <h2>Match the cards</h2>
        </div>`
    }

}
class GameStyle {
    static elapsedTime() {
        const now = Date.now();
        setTimeout(() => {

        }, 1000);
    }
}
window.customElements.define('memory-card', MemoryCard);
window.customElements.define('memory-board', MemoryGame);
window.customElements.define('memory-header', MemoryHeader);
