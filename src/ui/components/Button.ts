export function createButton(
    text: string, 
    style: string, 
    type: 'button' | 'submit' | 'reset' = 'button', 
    onClick?: () => void
): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = `btn btn-${style} mt-2`;
    btn.type = type;
    if (onClick) {
        btn.addEventListener('click', onClick);
    }
    return btn;
}