# How to Add a New Blog Post

Adding a new post involves three simple steps: creating the content, updating the list, and generating the pages.

## Step 1: Create the Content
1.  Navigate to the `data/posts/` directory.
2.  Create a new Markdown file (e.g., `my-new-post.md`).
3.  Write your content using standard Markdown.
    ```markdown
    # My New Post Title
    
    This is the first paragraph of my *new* post.
    ```

## Step 2: Register the Post
1.  Open `data/posts.json`.
2.  Add a new entry to the top of the list (so it appears first):
    ```json
    {
        "slug": "my-new-post",
        "title": "My New Post Title",
        "date": "February 15, 2026",
        "excerpt": "A short summary of the post that appears on the homepage.",
        "readTime": "3 min read"
    },
    ```
    *Note: The `slug` must match the filename you created in Step 1 (without .md).*

## Step 3: Generate & Deploy
1.  Open your terminal.
2.  Run the generator script to create the HTML pages:
    ```bash
    python3 scripts/generate_posts.py
    ```
    *You should see output saying "Generating page for: My New Post Title".*

3.  Commit and push your changes:
    ```bash
    git add .
    git commit -m "Add new post: My New Post Title"
    git push origin master
    ```

**That's it!** Your new post will be live on `https://blog.robertopatovsky.com` in a minute or two.
