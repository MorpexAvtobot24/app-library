import 'bootstrap/dist/css/bootstrap.min.css';
import { Book, User } from './models';
import { LibraryService, StorageService } from './services';
import { renderBookFormBuilder } from './ui/components/BookForm';
import { renderUserFormBuilder } from './ui/components/UserForm';
import { showModal } from './ui/components/Modal';
import { Validation } from './utils/validators';

class App {
    private bookLibrary: LibraryService<Book>;
    private userLibrary: LibraryService<User>;
    private bookStorage: StorageService<Book>;
    private userStorage: StorageService<User>;
    private appElement: HTMLElement;
    private currentBookPage: number = 1;
    private currentUserPage: number = 1;
    private bookSearchQuery: string = '';
    private itemsPerPage: number = 5;

    constructor() {
        this.bookLibrary = new LibraryService<Book>();
        this.userLibrary = new LibraryService<User>();
        this.bookStorage = new StorageService<Book>('library_books');
        this.userStorage = new StorageService<User>('library_users');
        this.appElement = document.getElementById('app') as HTMLElement;

        this.bookStorage.load().forEach(b => this.bookLibrary.add(b));
        this.userStorage.load().forEach(u => this.userLibrary.add(u));

        this.render();
    }

    private saveData() {
        this.bookStorage.save(this.bookLibrary.getAll());
        this.userStorage.save(this.userLibrary.getAll());
        this.render();
    }

    private render() {
        if (!this.appElement) return;
        this.appElement.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'container mt-5 mb-5';
        
        const title = document.createElement('h2');
        title.className = 'mb-4 text-center fw-bold';
        title.textContent = 'Система Управління Бібліотекою';
        container.append(title);

        // Форми
        renderBookFormBuilder(container, (newBook: Book) => {
            this.bookLibrary.add(newBook);
            this.saveData();
        });

        renderUserFormBuilder(container, (newUser: User) => {
            this.userLibrary.add(newUser);
            this.saveData();
        });

        // Списки
        this.renderBooksList(container);
        this.renderUsersList(container);

        this.appElement.append(container);
    }

    private renderBooksList(container: HTMLElement) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mt-4 bg-white p-3 border rounded shadow-sm mb-4';

        const title = document.createElement('h4');
        title.textContent = 'Список Книг та Пошук';
        wrapper.append(title);

        // Поле пошуку
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control mb-3';
        searchInput.placeholder = 'Пошук за назвою або автором...';
        searchInput.value = this.bookSearchQuery;
        searchInput.addEventListener('input', (e) => {
            this.bookSearchQuery = (e.target as HTMLInputElement).value.toLowerCase();
            this.currentBookPage = 1; // Скидаємо на першу сторінку при пошуку
            this.render(); // Перемальовуємо
        });
        wrapper.append(searchInput);

        const list = document.createElement('ul');
        list.className = 'list-group shadow-sm mb-3';

        // Фільтрація та пагінація
        const allBooks = this.bookLibrary.getAll();
        const filteredBooks = allBooks.filter(b => 
            b.title.toLowerCase().includes(this.bookSearchQuery) || 
            b.author.toLowerCase().includes(this.bookSearchQuery)
        );

        const startIndex = (this.currentBookPage - 1) * this.itemsPerPage;
        const paginatedBooks = filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);
        
        if (paginatedBooks.length === 0) {
            list.innerHTML = `<li class="list-group-item text-muted text-center p-4">Книг не знайдено.</li>`;
        } else {
            paginatedBooks.forEach(book => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                const isBorrowed = (book as any).isBorrowed;
                
                li.innerHTML = `
                    <div>
                        <strong class="fs-5">${book.title} by ${book.author} (${book.year})</strong>
                    </div>
                `;
                
                const btnGroup = document.createElement('div');
                
                // Кнопка позичання/повернення (старий функціонал)
                const btnAction = document.createElement('button');
                btnAction.className = `btn btn-sm me-2 ${isBorrowed ? 'btn-warning' : 'btn-primary'}`;
                btnAction.textContent = isBorrowed ? 'Повернути' : 'Позичити';
                btnAction.onclick = () => {
                    if (isBorrowed) {
                        (book as any).isBorrowed = false;
                        (book as any).borrowedBy = null;
                        showModal({ title: 'Успіх', message: `Книгу повернуто.`, type: 'success' });
                        this.saveData();
                    } else {
                        const userId = prompt('Введіть ID користувача для позичення книги:');
                        if (!userId) return;

                        const valid = Validation.validateUserId(userId);
                        if (!valid.isValid) {
                            showModal({ title: 'Помилка', message: valid.errors[0], type: 'error' });
                            return;
                        }

                        const user = this.userLibrary.getAll().find(u => u.id === userId);
                        if (!user) {
                            showModal({ title: 'Помилка', message: 'Користувача не знайдено', type: 'error' });
                            return;
                        }

                        const borrowedCount = this.bookLibrary.getAll().filter(b => (b as any).borrowedBy === userId).length;
                        if (borrowedCount >= 3) {
                            showModal({ title: 'Ліміт перевищено', message: 'Користувач не може позичити більше 3-х книг одночасно!', type: 'error' });
                            return;
                        }

                        (book as any).isBorrowed = true;
                        (book as any).borrowedBy = userId;
                        showModal({ title: 'Позичено', message: `Книгу позичено користувачем ${user.name}.`, type: 'success' });
                        this.saveData();
                    }
                };

                // Кнопка видалення книги
                const btnDelete = document.createElement('button');
                btnDelete.className = 'btn btn-sm btn-danger';
                btnDelete.textContent = 'Видалити';
                btnDelete.onclick = () => {
                    this.bookLibrary.remove(book.id);
                    this.saveData();
                };
                
                btnGroup.append(btnAction, btnDelete);
                li.append(btnGroup);
                list.append(li);
            });
        }
        wrapper.append(list);

        // Кнопки пагінації для книг
        const totalPages = Math.ceil(filteredBooks.length / this.itemsPerPage);
        if (totalPages > 1) {
            const paginationControls = this.createPaginationControls(this.currentBookPage, totalPages, (newPage) => {
                this.currentBookPage = newPage;
                this.render();
            });
            wrapper.append(paginationControls);
        }

        container.append(wrapper);
    }

    private renderUsersList(container: HTMLElement) {
        const wrapper = document.createElement('div');
        wrapper.className = 'bg-white p-3 border rounded shadow-sm';

        const title = document.createElement('h4');
        title.textContent = 'Список Користувачів';
        wrapper.append(title);

        const list = document.createElement('ul');
        list.className = 'list-group shadow-sm mb-3';

        const allUsers = this.userLibrary.getAll();
        const startIndex = (this.currentUserPage - 1) * this.itemsPerPage;
        const paginatedUsers = allUsers.slice(startIndex, startIndex + this.itemsPerPage);
        
        if (paginatedUsers.length === 0) {
            list.innerHTML = `<li class="list-group-item text-muted text-center p-4">Користувачів поки немає.</li>`;
        } else {
            paginatedUsers.forEach(user => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `<span><strong>${user.id}</strong> ${user.name} (${user.email})</span>`;
                
                // Кнопка видалення користувача
                const btnDelete = document.createElement('button');
                btnDelete.className = 'btn btn-sm btn-danger';
                btnDelete.textContent = 'Видалити';
                btnDelete.onclick = () => {
                    this.userLibrary.remove(user.id);
                    this.saveData();
                };

                li.append(btnDelete);
                list.append(li);
            });
        }
        wrapper.append(list);

        // Кнопки пагінації для користувачів
        const totalPages = Math.ceil(allUsers.length / this.itemsPerPage);
        if (totalPages > 1) {
            const paginationControls = this.createPaginationControls(this.currentUserPage, totalPages, (newPage) => {
                this.currentUserPage = newPage;
                this.render();
            });
            wrapper.append(paginationControls);
        }

        container.append(wrapper);
    }
    
    private createPaginationControls(currentPage: number, totalPages: number, onPageChange: (page: number) => void): HTMLElement {
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'd-flex justify-content-between align-items-center mt-2';

        const btnPrev = document.createElement('button');
        btnPrev.className = 'btn btn-outline-secondary btn-sm';
        btnPrev.textContent = 'Попередня';
        btnPrev.disabled = currentPage === 1;
        btnPrev.onclick = () => onPageChange(currentPage - 1);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Сторінка ${currentPage} з ${totalPages}`;

        const btnNext = document.createElement('button');
        btnNext.className = 'btn btn-outline-secondary btn-sm';
        btnNext.textContent = 'Наступна';
        btnNext.disabled = currentPage === totalPages;
        btnNext.onclick = () => onPageChange(currentPage + 1);

        paginationWrapper.append(btnPrev, pageInfo, btnNext);
        return paginationWrapper;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});