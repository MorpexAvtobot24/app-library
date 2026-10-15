export namespace Validation {
    export function validateBookForm(data: { title: string; author: string; year: string }) {
        const errors: string[] = [];
        if (!data.title.trim()) errors.push("Назва не може бути порожньою");
        if (!data.author.trim()) errors.push("Автор не може бути порожнім");

        const yearRegex = /^\d{4}$/;
        if (!data.year || !yearRegex.test(data.year)) {
            errors.push("Рік має бути числом з 4 цифр (наприклад, 2024)");
        }

        return { isValid: errors.length === 0, errors };
    }

    export function validateUserForm(data: { name: string; email: string }) {
        const errors: string[] = [];
        if (!data.name.trim()) errors.push("Ім'я не може бути порожнім");
        if (!data.email.trim()) errors.push("Email не може бути порожнім");
        return { isValid: errors.length === 0, errors };
    }

    export function validateUserId(id: string) {
        const idRegex = /^\d+$/; // Тільки цифри
        if (!id || !idRegex.test(id)) {
            return { isValid: false, errors: ["ID користувача має містити лише цифри"] };
        }
        return { isValid: true, errors: [] };
    }
}