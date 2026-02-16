import { renderHome } from './home.js';
import { renderPosts, renderBlogPost } from './posts.js';

// Simple Router
const routes = {
    'home': renderHome,
    'posts': renderPosts,
    'post': renderBlogPost
};

function router() {
    const path = window.location.pathname;
    let route = path.split('/')[1] || 'home';
    const args = path.split('/').slice(2);

    // Handle root path
    if (path === '/' || path === '') {
        route = 'home';
        // Optional: Update URL to /home without reloading
        window.history.replaceState(null, '', '/home');
    }

    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === `/${route}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const viewFn = routes[route] || routes['home'];
    const mainContent = document.getElementById('main-content');

    // Clear content and fade in new content
    mainContent.innerHTML = '';
    mainContent.classList.remove('fade-in');

    // Small delay to reset animation
    void mainContent.offsetWidth;

    viewFn(mainContent, ...args);
    mainContent.classList.add('fade-in');
}

// Handle navigation links
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState(null, '', href);
        router();
    }
});

window.addEventListener('popstate', router);
window.addEventListener('load', () => {
    router();
    initTheme();
});

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        toggleBtn.textContent = '🌙';
    } else {
        toggleBtn.textContent = '☀';
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        toggleBtn.textContent = isLight ? '🌙' : '☀';
    });
}
