import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os
import shutil
import subprocess
from datetime import datetime

class BlogManager(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Robert's Blog Manager")
        self.geometry("900x700")

        # Configuration
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.posts_json_path = os.path.join(self.base_dir, 'data', 'posts.json')
        self.posts_dir = os.path.join(self.base_dir, 'data', 'posts')
        self.assets_dir = os.path.join(self.base_dir, 'assets')
        
        self.posts_data = []
        self.current_post = None

        self._setup_ui()
        self._load_posts()

    def _setup_ui(self):
        # Layout: Sidebar (List) + Main (Editor)
        paned_window = ttk.PanedWindow(self, orient=tk.HORIZONTAL)
        paned_window.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Sidebar
        sidebar_frame = ttk.Frame(paned_window, width=250)
        paned_window.add(sidebar_frame, weight=1)

        ttk.Label(sidebar_frame, text="Posts").pack(anchor=tk.W, pady=5)
        self.post_listbox = tk.Listbox(sidebar_frame)
        self.post_listbox.pack(fill=tk.BOTH, expand=True)
        self.post_listbox.bind('<<ListboxSelect>>', self._on_post_select)

        btn_new = ttk.Button(sidebar_frame, text="+ New Post", command=self._new_post)
        btn_new.pack(fill=tk.X, pady=5)

        # Main Editor
        editor_frame = ttk.Frame(paned_window)
        paned_window.add(editor_frame, weight=3)

        # Fields
        # Title
        ttk.Label(editor_frame, text="Title:").grid(row=0, column=0, sticky=tk.W)
        self.entry_title = ttk.Entry(editor_frame)
        self.entry_title.grid(row=0, column=1, sticky=tk.EW, padx=5, pady=2)
        
        # Slug
        ttk.Label(editor_frame, text="Slug:").grid(row=1, column=0, sticky=tk.W)
        self.entry_slug = ttk.Entry(editor_frame)
        self.entry_slug.grid(row=1, column=1, sticky=tk.EW, padx=5, pady=2)

        # Date
        ttk.Label(editor_frame, text="Date:").grid(row=2, column=0, sticky=tk.W)
        self.entry_date = ttk.Entry(editor_frame)
        self.entry_date.grid(row=2, column=1, sticky=tk.EW, padx=5, pady=2)

        # Excerpt
        ttk.Label(editor_frame, text="Excerpt:").grid(row=3, column=0, sticky=tk.W)
        self.entry_excerpt = ttk.Entry(editor_frame)
        self.entry_excerpt.grid(row=3, column=1, sticky=tk.EW, padx=5, pady=2)

        # Read Time
        ttk.Label(editor_frame, text="Read Time:").grid(row=4, column=0, sticky=tk.W)
        self.entry_readtime = ttk.Entry(editor_frame)
        self.entry_readtime.grid(row=4, column=1, sticky=tk.EW, padx=5, pady=2)
        
        # Content
        ttk.Label(editor_frame, text="Content (Markdown):").grid(row=5, column=0, sticky=tk.NW, pady=5)
        self.text_content = tk.Text(editor_frame, wrap=tk.WORD, height=20)
        self.text_content.grid(row=5, column=1, sticky=tk.NSEW, padx=5, pady=2)

        # Toolbar
        toolbar_frame = ttk.Frame(editor_frame)
        toolbar_frame.grid(row=6, column=1, sticky=tk.EW, pady=5)
        
        ttk.Button(toolbar_frame, text="Insert Image", command=self._insert_image).pack(side=tk.LEFT, padx=5)
        ttk.Button(toolbar_frame, text="Save Post", command=self._save_post).pack(side=tk.RIGHT, padx=5)

        # Bottom Actions
        bottom_frame = ttk.Frame(self)
        bottom_frame.pack(fill=tk.X, padx=10, pady=10)

        ttk.Button(bottom_frame, text="Generate Site", command=self._generate_site).pack(side=tk.LEFT, padx=5)
        ttk.Button(bottom_frame, text="Deploy to GitHub", command=self._deploy_site).pack(side=tk.LEFT, padx=5)
        
        # Grid config
        editor_frame.columnconfigure(1, weight=1)
        editor_frame.rowconfigure(5, weight=1)

    def _load_posts(self):
        try:
            with open(self.posts_json_path, 'r') as f:
                self.posts_data = json.load(f)
        except Exception as e:
            self.posts_data = []
            messagebox.showerror("Error", f"Failed to load posts: {e}")

        self.post_listbox.delete(0, tk.END)
        for post in self.posts_data:
            self.post_listbox.insert(tk.END, post['title'])

    def _on_post_select(self, event):
        selection = self.post_listbox.curselection()
        if not selection:
            return
        
        index = selection[0]
        post = self.posts_data[index]
        self.current_post = post
        
        self._fill_form(post)
        
        # Load content
        md_path = os.path.join(self.posts_dir, f"{post['slug']}.md")
        if os.path.exists(md_path):
            with open(md_path, 'r') as f:
                content = f.read()
            self.text_content.delete("1.0", tk.END)
            self.text_content.insert("1.0", content)
        else:
            self.text_content.delete("1.0", tk.END)

    def _fill_form(self, post):
        self.entry_title.delete(0, tk.END)
        self.entry_title.insert(0, post.get('title', ''))
        
        self.entry_slug.delete(0, tk.END)
        self.entry_slug.insert(0, post.get('slug', ''))
        
        self.entry_date.delete(0, tk.END)
        self.entry_date.insert(0, post.get('date', ''))
        
        self.entry_excerpt.delete(0, tk.END)
        self.entry_excerpt.insert(0, post.get('excerpt', ''))
        
        self.entry_readtime.delete(0, tk.END)
        self.entry_readtime.insert(0, post.get('readTime', ''))

    def _new_post(self):
        self.current_post = None
        self.post_listbox.selection_clear(0, tk.END)
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        self._fill_form({
            'title': '',
            'slug': '',
            'date': today,
            'excerpt': '',
            'readTime': '5 min read'
        })
        self.text_content.delete("1.0", tk.END)
        self.entry_title.focus_set()

    def _insert_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("Images", "*.png *.jpg *.jpeg *.gif *.webp")])
        if not file_path:
            return
            
        filename = os.path.basename(file_path)
        dest_path = os.path.join(self.assets_dir, filename)
        
        try:
            shutil.copy2(file_path, dest_path)
            markdown_img = f"![Alt Text](/assets/{filename})"
            self.text_content.insert(tk.INSERT, markdown_img)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to copy image: {e}")

    def _save_post(self):
        title = self.entry_title.get()
        slug = self.entry_slug.get()
        date_str = self.entry_date.get()
        excerpt = self.entry_excerpt.get()
        read_time = self.entry_readtime.get()
        content = self.text_content.get("1.0", tk.END).strip()

        if not title or not slug:
            messagebox.showwarning("Validation", "Title and Slug are required.")
            return

        new_post_data = {
            "slug": slug,
            "title": title,
            "date": date_str,
            "excerpt": excerpt,
            "readTime": read_time
        }

        # Update JSON list
        if self.current_post:
            # Update existing
            for i, p in enumerate(self.posts_data):
                if p['slug'] == self.current_post['slug']: # Match by old slug
                    self.posts_data[i] = new_post_data
                    break
        else:
            # Add new to top
            self.posts_data.insert(0, new_post_data)

        # Save JSON
        try:
            with open(self.posts_json_path, 'w') as f:
                json.dump(self.posts_data, f, indent=4)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save JSON: {e}")
            return

        # Save Markdown
        md_path = os.path.join(self.posts_dir, f"{slug}.md")
        try:
            with open(md_path, 'w') as f:
                f.write(content)
        except Exception as e:
             messagebox.showerror("Error", f"Failed to save content: {e}")
             return
             
        messagebox.showinfo("Success", "Post saved successfully!")
        self._load_posts()
        
        # Re-select the saved post
        for i, p in enumerate(self.posts_data):
            if p['slug'] == slug:
                self.post_listbox.selection_set(i)
                self.current_post = p
                break

    def _generate_site(self):
        script_path = os.path.join(self.base_dir, 'scripts', 'generate_posts.py')
        try:
            subprocess.run(['python3', script_path], check=True)
            messagebox.showinfo("Success", "Site generated successfully!")
        except Exception as e:
             messagebox.showerror("Error", f"Generation failed: {e}")

    def _deploy_site(self):
        if not messagebox.askyesno("Confirm", "Are you sure you want to deploy to GitHub?"):
            return
            
        try:
            subprocess.run(['git', 'add', '.'], cwd=self.base_dir, check=True)
            subprocess.run(['git', 'commit', '-m', 'Content update via GUI'], cwd=self.base_dir, check=True)
            subprocess.run(['git', 'push', 'origin', 'master'], cwd=self.base_dir, check=True)
            messagebox.showinfo("Success", "Site deployed successfully!")
        except Exception as e:
             messagebox.showerror("Error", f"Deployment failed: {e}")

if __name__ == "__main__":
    app = BlogManager()
    app.mainloop()
