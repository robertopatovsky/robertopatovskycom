# Blog Management Guide

Welcome to the documentation for your personal website. This guide covers how to add content, manage the site, and use the new features.

## 🚀 The Blog Manager App (Recommended)

Managing your blog is now easier with the custom Python GUI application.

### How to Run
1.  Open your terminal.
2.  Run the following command:
    ```bash
    python3 scripts/blog_manager.py
    ```

### App Features
*   **Create/Edit**: Select a post from the left sidebar to edit, or click **+ New Post** to start fresh.
*   **Live Metadata**: Title, Slug, Date, and Excerpt are all editable fields.
*   **Image Handling**: Click **Insert Image** to pick a file from your computer. The app automatically copies it to the `assets/` folder and inserts the Markdown code for you.
*   **One-Click Actions**:
    *   **Save Post**: Updates `posts.json` and the Markdown file.
    *   **Generate Site**: Rebuilds the static HTML pages.
    *   **Deploy to GitHub**: Commits and pushes your changes to the live site.

---

## 🛠️ Manual Method (Power Users)

If you prefer working directly with files, you can still do so.

1.  **Create Content**: Add a `.md` file in `data/posts/` (e.g., `my-post.md`).
2.  **Register**: Add the metadata to `data/posts.json`.
3.  **Generate**: Run `python3 scripts/generate_posts.py`.
4.  **Deploy**: Run `git add .`, `git commit -m "update"`, `git push origin master`.

---

## ✨ New Website Features

### 1. Posts Page (`/posts`)
*   **Renamed Route**: The blog is now located at `/posts` to be more semantic.
*   **Search**: Users can filter posts by title or excerpt keywords in real-time.
*   **Sorting**: Toggle between "Newest First" and "Oldest First".

### 2. Light / Dark Mode
*   **Automatic**: The site respects the user's system preference (e.g., macOS Dark Mode).
*   **Toggle**: A sun/moon button in the navbar allows manual switching.
*   **Persistence**: The preference is saved in the browser so it remembers the user's choice.

### 3. Professional Design
*   **Typography**: Updated to **Outfit** (Headings) and **Inter** (Body) for a clean, modern look.
*   **Colors**: A new "Professional Blue" palette replaces the generic colors.
*   **Logo**: Updated to "Robert Opatovsky | Engineering".
