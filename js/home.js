import { renderBlogList } from './blog.js';

export function renderHome(container) {
    container.innerHTML = `
        <div class="fade-in">
            <h1>Welcome to My Personal Space</h1>
            <p class="intro-text">
                Hi, I'm Robert Opatovsky. This is where I share my thoughts, projects, and experiments.
                Check out my latest writing below.
            </p>
            <div style="margin: 3rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);"></div>
        </div>
        <div id="home-blog-list"></div>
    `;

    // Render the blog list into the sub-container
    const blogContainer = container.querySelector('#home-blog-list');
    renderBlogList(blogContainer);
}
