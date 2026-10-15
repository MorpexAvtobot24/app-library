import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation', () => {
    describe('validateUserId', () => {
        it('повинен пропускати валідне ID (тільки цифри)', () => {
            const result = Validation.validateUserId('123456789');
            expect(result.isValid).to.be.true;
            expect(result.errors.length).to.equal(0);
        });

        it('повинен блокувати ID з літерами', () => {
            const result = Validation.validateUserId('123abc456');
            expect(result.isValid).to.be.false;
            expect(result.errors).to.include('ID користувача має містити лише цифри');
        });
    });

    describe('validateBookForm', () => {
        it('повинен пропускати валідні дані', () => {
            const result = Validation.validateBookForm({ title: 'Книга', author: 'Автор', year: '2024' });
            expect(result.isValid).to.be.true;
        });

        it('повинен блокувати рік, що не складається з 4 цифр', () => {
            const result = Validation.validateBookForm({ title: 'Книга', author: 'Автор', year: '202' });
            expect(result.isValid).to.be.false;
            expect(result.errors[0]).to.include('Рік має бути числом з 4 цифр');
        });
        
        it('повинен блокувати порожні поля', () => {
            const result = Validation.validateBookForm({ title: '', author: '', year: '2024' });
            expect(result.isValid).to.be.false;
        });
    });
});