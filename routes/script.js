function redirectToLogin(role) {
    window.location.href = `/${role}-login`; // Redirects to '/teacher-login' or '/student-login'
}

function loginWithGoogle() {
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=your-redirect-url&response_type=code&client_id=your-client-id&scope=email%20profile&access_type=online';
}

// Throttle function to reduce frequency of `mousemove` event calls
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

document.addEventListener(
    'mousemove',
    throttle(function (e) {
        // Select both elements
        const container = document.querySelector('.container');
        const loginContainer = document.querySelector('.login-container');

        // Apply transformation if the elements exist
        if (container) {
            const rect = container.getBoundingClientRect();
            const offsetX = (e.clientX - (rect.left + rect.width / 2)) / 15;
            const offsetY = (e.clientY - (rect.top + rect.height / 2)) / 15;
            container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }

        if (loginContainer) {
            const rect = loginContainer.getBoundingClientRect();
            const offsetX = (e.clientX - (rect.left + rect.width / 2)) / 15;
            const offsetY = (e.clientY - (rect.top + rect.height / 2)) / 15;
            loginContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
    }, 50) // Adjust the throttle limit as needed (in ms)
);
