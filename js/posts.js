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
let sortOrder = 'newest'; // 'newest' | 'oldest'

export async function renderPosts(container) {
    container.innerHTML = `
        <div class="posts-header fade-in">
            <h2>Latest Posts</h2>
            <div class="controls">
                <input type="text" id="post-search" placeholder="Search posts..." class="search-input">
                <button id="sort-toggle" class="sort-btn">Newest &darr;</button>
            </div>
        </div>
        <div id="posts-container" class="blog-grid">
            <div class="loading">Loading...</div>
        </div>
    `;

    if (allPosts.length === 0) {
        allPosts = await fetchPosts();
    }

    const searchInput = container.querySelector('#post-search');
    const sortBtn = container.querySelector('#sort-toggle');

    // Initial Render
    filterAndRender(container);

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        filterAndRender(container, e.target.value);
    });

    sortBtn.addEventListener('click', () => {
        sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
        sortBtn.innerHTML = sortOrder === 'newest' ? 'Newest &darr;' : 'Oldest &uarr;';
        filterAndRender(container, searchInput.value);
    });
}

function filterAndRender(container, query = '') {
    const listContainer = container.querySelector('#posts-container');
    const q = query.toLowerCase();

    // Filter
    let filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q)
    );

    // Sort
    filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = '<p>No posts found.</p>';
        return;
    }

    listContainer.innerHTML = filtered.map(post => `
        <article class="blog-card fade-in">
            <h3><a href="/post/${post.slug}">${post.title}</a></h3>
            <div class="meta">${post.date} &middot; ${post.readTime || '5 min read'}</div>
            <p>${post.excerpt}</p>
            <a href="/post/${post.slug}" class="read-more">Read more &rarr;</a>
        </article>
    `).join('');
}

export async function renderBlogPost(container, slug) {
    if (!slug) return renderPosts(container);

    container.innerHTML = '<div class="loading">Loading post...</div>';

    try {
        // Fetch metadata to get title/date (optional, but nice)
        const posts = await fetchPosts();
        const meta = posts.find(p => p.slug === slug);

        // Fetch content
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
            <p>Could not load post. <a href="/blog">Go back</a></p>
        `;
    }
}
