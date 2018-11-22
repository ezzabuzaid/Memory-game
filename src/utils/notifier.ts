export class Subject<T = any> {
    observers = [];
    constructor() { }

    countObservers() {
        return this.observers.length;
    }

    get(index: number) {
        return this.observers[index];
    }

    subscribe(observer: any) {
        this.observers.push(observer);
    }

    unsubscribe(observer: any) {
        const index = this.observers.findIndex(_observer => _observer === observer);
        observer = this.observers.splice(index, 1);
    }

    notify(notifcation: T) {
        this.observers.forEach(observer => observer.update(notifcation));
    }

}