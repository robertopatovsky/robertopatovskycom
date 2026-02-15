import { parseMarkdown } from './markdown.js';

async function fetchPosts() {
    try {
        const response = await fetch('data/posts.json');
        if (!response.ok) throw new Error('Failed to load posts');
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function renderBlogList(container) {
    container.innerHTML = '<h2>Latest Posts</h2><div class="loading">Loading...</div>';

    const posts = await fetchPosts();

    if (posts.length === 0) {
        container.innerHTML = '<h2>Latest Posts</h2><p>No posts found.</p>';
        return;
    }

    const listHtml = posts.map(post => `
        <article class="blog-card fade-in">
            <h3><a href="#post/${post.slug}">${post.title}</a></h3>
            <div class="meta">${post.date} &middot; ${post.readTime || '5 min read'}</div>
            <p>${post.excerpt}</p>
            <a href="#post/${post.slug}" class="read-more">Read more &rarr;</a>
        </article>
    `).join('');

    container.innerHTML = `
        <h2>Latest Posts</h2>
        <div class="blog-grid">
            ${listHtml}
        </div>
    `;
}

export async function renderBlogPost(container, slug) {
    if (!slug) return renderBlogList(container);

    container.innerHTML = '<div class="loading">Loading post...</div>';

    try {
        // Fetch metadata to get title/date (optional, but nice)
        const posts = await fetchPosts();
        const meta = posts.find(p => p.slug === slug);

        // Fetch content
        const res = await fetch(`data/posts/${slug}.md`);
        if (!res.ok) throw new Error('Post not found');
        const text = await res.text();

        const html = parseMarkdown(text);

        container.innerHTML = `
            <article class="blog-post fade-in">
                <a href="#blog" class="back-link">&larr; Back to Blog</a>
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
            <p>Could not load post. <a href="#blog">Go back</a></p>
        `;
    }
}
