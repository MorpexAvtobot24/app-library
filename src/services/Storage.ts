export class StorageService<T> {
    // Ключ, за яким дані будуть зберігатися в браузері (наприклад, 'books' або 'users')
    constructor(private storageKey: string) {}

    // Збереження масиву даних у LocalStorage
    save(data: T[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Отримання даних з LocalStorage
    load(): T[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
}