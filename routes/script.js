function redirectToLogin(userType) {
    if (userType === 'student') {
        window.location.href = 'student-login';
    } else if (userType === 'teacher') {
        window.location.href = 'teacher-login';
    }
}

document.addEventListener('mousemove', function (e) {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) / 15;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) / 15;
    container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});
function loginWithGoogle() {
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=your-redirect-url&response_type=code&client_id=your-client-id&scope=email%20profile&access_type=online';
}

document.addEventListener('mousemove', function (e) {
    const container = document.querySelector('.login-container');
    const rect = container.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) / 15;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) / 15;
    container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

document.addEventListener('mousemove', function (e) {
    const container = document.querySelector('.login-container');
    const rect = container.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) / 15;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) / 15;
    container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});