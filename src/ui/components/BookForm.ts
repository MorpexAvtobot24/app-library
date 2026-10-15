import { Book } from '../../models';
import { Validation } from '../../utils/validators';
import { buildForm } from './FormBuilder';

interface BookFormData extends Record<string, string> {
    title: string;
    author: string;
    year: string;
}

export function renderBookFormBuilder(container: HTMLElement, onSubmit: (book: Book) => void): void {
    const form = buildForm<BookFormData>({
        fields: [
            { name: 'title', label: 'Назва книги', type: 'text' },
            { name: 'author', label: 'Автор', type: 'text' },
            { name: 'year', label: 'Рік видання', type: 'text' },
        ],
        submitLabel: 'Додати книгу',
        validate: Validation.validateBookForm,
        onValid: (data) => {
            const newBook = new Book(Date.now().toString(), data.title, data.author, Number(data.year));
            onSubmit(newBook);
        },
    });

    container.append(form);
}