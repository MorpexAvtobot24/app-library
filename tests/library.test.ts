import { expect } from 'chai';
import { LibraryService } from '../src/services';
import { Book } from '../src/models';

describe('LibraryService', () => {
    let library: LibraryService<Book>;

    beforeEach(() => {
        library = new LibraryService<Book>();
    });

    it('повинен додавати елемент до колекції', () => {
        const book = new Book('1', '1984', 'Джордж Орвелл', 1949);
        library.add(book);
        
        const allBooks = library.getAll();
        expect(allBooks.length).to.equal(1);
        expect(allBooks[0].title).to.equal('1984');
    });

    it('повинен видаляти елемент за ID', () => {
        const book = new Book('1', '1984', 'Джордж Орвелл', 1949);
        library.add(book);
        library.remove('1');
        
        expect(library.getAll().length).to.equal(0);
    });
});