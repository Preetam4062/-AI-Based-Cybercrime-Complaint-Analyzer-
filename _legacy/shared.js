
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

window.AppState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    activePage: 'page-login',
    stats: { today: 0, review: 0, resolved: 0, accuracy: 0 }
};

function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="ti ti-${type === 'success' ? 'check' : 'info-circle'}"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function triggerHaptic(pattern = 50) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}
