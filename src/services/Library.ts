export class LibraryService<T extends { id: string }> {
    private items: T[] = [];

    // Додавання об'єкта в список
    add(item: T): void {
        this.items.push(item);
    }

    // Отримання всіх об'єктів (всіх книг або користувачів)
    getAll(): T[] {
        return this.items;
    }

    // Видалення за ID
    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }
    
    // Пошук об'єкта за його ID
    findById(id: string): T | undefined {
        return this.items.find(item => item.id === id);
    }
}