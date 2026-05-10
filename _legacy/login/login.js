
// Update login success to set localStorage and redirect
function doRedirect() {
    window.location.href = '../main/index.html';
}
window.login = function(e) {
    e.preventDefault();
    const btn = $('login-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-loader ti-spin"></i> Authenticating...';
    btn.disabled = true;
    setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        doRedirect();
    }, 1200);
};
$('login-form').addEventListener('submit', window.login);
