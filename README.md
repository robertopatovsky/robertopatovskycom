# Personal Website & Blog

A lightweight personal website with a blog, built with vanilla HTML, CSS, and JavaScript — no build tools, no frameworks.

## Features

- **Hash-based Router** — Smooth SPA-like navigation between Home and Blog sections.
- **Markdown Blog** — Write posts in Markdown (`data/posts/`), register them in `data/posts.json`, and they render automatically.
- **Modern Design** — Google Fonts (Inter, Outfit), dark palette, fade-in transitions.

## Setup & Usage

1. Clone/download this repository.
2. Open `index.html` in any modern browser — that's it, no server needed.

> **Tip:** For local development with ES modules, use a simple local server:
> ```bash
> npx serve .
> ```

## Adding a New Blog Post

1. Create a new `.md` file in `data/posts/`, e.g. `my-new-post.md`.
2. Add an entry to `data/posts.json`:
   ```json
   {
     "slug": "my-new-post",
     "title": "My New Post",
     "date": "2026-02-15",
     "excerpt": "A short description of the post.",
     "readTime": "3 min read"
   }
   ```
3. Refresh the page — your post will appear in the Blog section.

## File Structure

```
personal-website/
├── index.html          # Main HTML shell (navbar, footer, #app)
├── css/
│   └── style.css       # All styles (dark theme, typography, layout)
├── js/
│   ├── app.js          # Hash router & page transitions
│   ├── home.js         # Home page renderer
│   ├── blog.js         # Blog list & single post renderer
│   ├── markdown.js     # Markdown helper (imports marked)
│   └── lib/
│       └── marked.esm.js  # Markdown parser (vendored)
├── data/
│   ├── posts.json      # Blog post index
│   └── posts/
│       ├── welcome.md
│       └── why-simple.md
├── .gitignore
└── README.md
```

## Credits

- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) & [Outfit](https://fonts.google.com/specimen/Outfit)
- **Markdown**: [marked.js](https://marked.js.org/)
