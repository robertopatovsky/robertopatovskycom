import { renderHome } from './home.js';
import { renderBlogList, renderBlogPost } from './blog.js';

// Simple Router
const routes = {
    'home': renderHome,
    'blog': renderBlogList,
    'post': renderBlogPost
};

function router() {
    const hash = window.location.hash.slice(1) || 'home';
    const [route, ...args] = hash.split('/');
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === `#${route}`) {
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

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
