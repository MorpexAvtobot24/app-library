export function showModal(options: { title: string; message: string; type: string }): void {
    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop fade show';

    const modal = document.createElement('div');
    modal.className = 'modal fade show d-block';
    modal.tabIndex = -1;

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title ${options.type === 'error' ? 'text-danger' : ''}">${options.title}</h5>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p style="white-space: pre-line;">${options.message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-${options.type === 'error' ? 'danger' : 'primary'} close-btn">Зрозуміло!</button>
                </div>
            </div>
        </div>
    `;

    document.body.append(overlay, modal);

    const close = () => {
        modal.remove();
        overlay.remove();
    };

    modal.querySelector('.btn-close')?.addEventListener('click', close);
    modal.querySelector('.close-btn')?.addEventListener('click', close);
}