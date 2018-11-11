const CARDS_LIST = [{
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhQerag_RFCeCD0cY68cCuA5nL6lOJHWg9rTBj62l65ROndNfokg',
        value: 0,
    },
    {
        image: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Catch_Me_%28TVXQ_Album%29.jpg/220px-Catch_Me_%28TVXQ_Album%29.jpg',
        value: 1,
    },
    {
        image: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Internet_Watch_Foundation_%28logo%29.svg/1200px-Internet_Watch_Foundation_%28logo%29.svg.png',
        value: 2,
    },
    {
        image: 'http://sw13279.smartweb-static.com/upload_dir/shop/A2378p3_p1093982-cacharel--catch-me-edp-vapo-50-ml.w610.h610.fill.jpg',
        value: 3,
    },
    {
        image: 'https://www.perfectlyposh.com/dw/image/v2/BBLP_PRD/on/demandware.static/-/Sites-pp-master-catalog/default/dw46ac1ce9/large/SM7006-2.jpg?sw=768&sh=768',
        value: 4,
    },
    {
        image: 'https://images-na.ssl-images-amazon.com/images/I/41FMVEaaGkL._SX355_.jpg',
        value: 5,
    },
    {
        image: 'https://www.ravelo.pl/pub/mm/multimedia/image/jpeg/100344429.jpg',
        value: 6,
    },
];

class Utility {
    static dublicateList(list) {
        list.push(...list);
        return list;
    }
    static shuffleList(list) {
        for (let i = list.length - 1; i; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }

    static parseHTML(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        const parsedHTML = div.cloneNode(true).firstElementChild;
        div.remove();
        return parsedHTML;
    }

}

class MemoryGameHelper {

    static resetCard() {
        MemoryGameHelper.secondaryCard = null;
        MemoryGameHelper.primaryCard = null;
    }

    static async setCard(card) {
        const m = MemoryGameHelper;
        if (!m.primaryCard || !m.secondaryCard) {
            if (!m.primaryCard) {
                m.primaryCard = card;
            } else {
                if (card.value !== m.primaryCard.value) {
                    if (!m.secondaryCard) {
                        m.secondaryCard = card;
                        await m.compare(m.primaryCard, m.secondaryCard);
                        this.resetCard();
                    }
                } else {
                    this.resetCard();
                }
            }
        } else {
            card.classList.toggle('flip')
        }
    }

    static compare(first, second) {
        return new Promise((resolve) => {
            if (first.value === second.value) {
                resolve();
            } else {
                setTimeout(() => {
                    second.classList.toggle('flip');
                    first.classList.toggle('flip');
                    resolve();
                }, 750);
            }
        })
    }
}

class MemoryGame extends HTMLElement {
    constructor() {
        super();
        this.cardList = CARDS_LIST
        this.initCards();
    }
    initCards() {
        Utility.shuffleList(Utility.dublicateList(this.cardList));
        const content = this.cardList.reduce((acc, curr) => acc += `<div class="col-4 mb-3"><memory-card value="${curr.value}" image="${curr.image}" ></memory-card></div>`, '')
        this.insertAdjacentHTML('afterbegin', `<div class="row card-wrapper" id="card_wrapper">${content}</div>`);
    }
    getCard(index) {
        return this.cardList[index];
    }

}

class MemoryCard extends HTMLElement {
    constructor() {
        super();
        this.flibable = true;
        this.flipped = false;
        this.insertAdjacentElement('afterbegin', this._initTemplate);
        this.addEventListener('click', () => {
            this.flipCard();
        })
    }

    static get observedAttributes() {
        return ['value', 'image'];
    }

    set value(v) {
        this.setAttribute('value', v);
    }
    get value() {
        return this.getAttribute('value');
    }
    set image(v) {
        this.setAttribute('image', v);
    }
    get image() {
        return this.getAttribute('image');
    }
    get _initTemplate() {
        this.classList.add('flip_able');
        const content =
            `<div class="position-relative">
                <div class="front">
                    <img class="img-fluid rounded" src="https://qph.fs.quoracdn.net/main-qimg-6ca15f54b96ee1895c52af319d5a91d4">
                </div>
                <div class="back">
                    <img class="img-fluid rounded h-100" src="${this.image}">
                </div>
            </div>`
        return Utility.parseHTML(content);
    }

    flipCard() {
        MemoryGameHelper.setCard(this);
        this.classList.toggle('flip');
    }
}

window.customElements.define('memory-card', MemoryCard);
window.customElements.define('memory-board', MemoryGame);