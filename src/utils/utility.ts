export class Utility {
    static dublicateList(list: any[]) {
        list.push(...list);
        return list;
    }
    static shuffleList(list: any[]) {
        for (let i = list.length - 1; i; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }
    static parseHTML(html: string) {
        var div = document.createElement('div');
        div.innerHTML = html;
        const parsedHTML = div.cloneNode(true).firstChild;
        div.remove();
        return parsedHTML;
    }
}