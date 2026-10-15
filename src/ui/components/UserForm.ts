import { User } from '../../models';
import { Validation } from '../../utils/validators';
import { buildForm } from './FormBuilder';

interface UserFormData extends Record<string, string> {
    name: string;
    email: string;
}

export function renderUserFormBuilder(container: HTMLElement, onSubmit: (user: User) => void): void {
    const form = buildForm<UserFormData>({
        fields: [
            { name: 'name', label: 'Ім\'я', type: 'text' },
            { name: 'email', label: 'Email', type: 'text' },
        ],
        submitLabel: 'Додати Користувача',
        validate: Validation.validateUserForm,
        onValid: (data) => {
            // ID генеруємо як timestamp (що гарантує лише цифри)
            const newUser = new User(Date.now().toString(), data.name, data.email);
            onSubmit(newUser);
        },
    });

    container.append(form);
}