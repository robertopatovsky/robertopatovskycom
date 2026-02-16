import { parseMarkdown } from './markdown.js';

async function fetchPosts() {
    try {
        const response = await fetch('/data/posts.json');
        if (!response.ok) throw new Error('Failed to load posts');
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

// State
let allPosts = [];

export async function renderPosts(container) {
    container.innerHTML = `
        <div class="posts-header fade-in">
            <h2>Timeline</h2>
            <div class="controls">
                <input type="text" id="post-search" placeholder="Search posts..." class="search-input">
            </div>
        </div>
        <div id="timeline-container" class="timeline-wrapper">
            <div class="loading">Loading...</div>
        </div>
    `;

    if (allPosts.length === 0) {
        allPosts = await fetchPosts();
    }

    const searchInput = container.querySelector('#post-search');

    // Initial Render
    renderTimeline(container);

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        renderTimeline(container, e.target.value);
    });
}

function renderTimeline(container, query = '') {
    const listContainer = container.querySelector('#timeline-container');
    const q = query.toLowerCase();

    // Filter
    let filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
        listContainer.innerHTML = '<p>No posts found.</p>';
        return;
    }

    // Sort by Date Descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by Year -> Month
    const grouped = {};
    filtered.forEach(post => {
        const date = new Date(post.date);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });

        if (!grouped[year]) grouped[year] = {};
        if (!grouped[year][month]) grouped[year][month] = [];

        grouped[year][month].push(post);
    });

    // Generate HTML
    let html = '';
    const years = Object.keys(grouped).sort((a, b) => b - a);

    years.forEach(year => {
        html += `<div class="timeline-year">
            <h2 class="year-header">${year}</h2>`;

        // Process months in reverse order (easiest way is to sort by date of first post in month)
        // Or simply strict month order if prefered.
        const months = Object.keys(grouped[year]).sort((a, b) => {
            return new Date(`${b} 1, 2000`) - new Date(`${a} 1, 2000`);
        });

        months.forEach(month => {
            html += `<div class="timeline-month">
                <h3 class="month-header">${month}</h3>
                <div class="month-posts">`;

            grouped[year][month].forEach(post => {
                const dateObj = new Date(post.date);
                const day = dateObj.getDate();

                html += `
                    <article class="blog-card timeline-card fade-in">
                        <div class="card-date">${month} ${day}</div>
                        <h3><a href="/post/${post.slug}">${post.title}</a></h3>
                        <div class="meta">${post.readTime || '5 min read'}</div>
                        <p>${post.excerpt}</p>
                        <a href="/post/${post.slug}" class="read-more">Read &rarr;</a>
                    </article>
                `;
            });
            html += `</div></div>`; // Close month-posts and timeline-month
        });

        html += `</div>`; // Close timeline-year
    });

    listContainer.innerHTML = html;
}

export async function renderBlogPost(container, slug) {
    if (!slug) return renderPosts(container);

    container.innerHTML = '<div class="loading">Loading post...</div>';

    try {
        const posts = await fetchPosts();
        const meta = posts.find(p => p.slug === slug);

        const res = await fetch(`/data/posts/${slug}.md`);
        if (!res.ok) throw new Error('Post not found');
        const text = await res.text();

        const html = parseMarkdown(text);

        container.innerHTML = `
            <article class="blog-post fade-in">
                <a href="/posts" class="back-link">&larr; Back to Posts</a>
                <header class="post-header">
                    <h1>${meta ? meta.title : slug}</h1>
                    ${meta ? `<div class="meta">${meta.date}</div>` : ''}
                </header>
                <div class="markdown-content">
                    ${html}
                </div>
            </article>
        `;
    } catch (e) {
        container.innerHTML = `
            <h2>Error</h2>
            <p>Could not load post. <a href="/posts">Go back</a></p>
        `;
    }
}
