import json
import os

# Configuration
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
posts_path = os.path.join(base_dir, 'data', 'posts.json')
template_path = os.path.join(base_dir, 'index.html')
output_dir = os.path.join(base_dir, 'post')

# Read data
with open(posts_path, 'r', encoding='utf-8') as f:
    posts = json.load(f)

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

# Ensure output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for post in posts:
    print(f"Generating page for: {post['title']}")
    
    # Create slug directory
    post_dir = os.path.join(output_dir, post['slug'])
    if not os.path.exists(post_dir):
        os.makedirs(post_dir)

    # Replace meta tags
    html = template
    
    # Title
    html = html.replace('<title>My Personal Space</title>', f"<title>{post['title']} | Robert Opatovsky</title>")
    
    # Open Graph Title
    html = html.replace('content="My Personal Space"', f'content="{post["title"]}"')
    
    # Description (OG and Standard)
    description = post.get('excerpt', post['title'])
    html = html.replace('content="Personal Website & Blog of Robert Opatovsky"', f'content="{description}"')
    
    # URL
    post_url = f"https://blog.robertopatovsky.com/post/{post['slug']}"
    html = html.replace('content="https://blog.robertopatovsky.com/"', f'content="{post_url}"')
    
    # Write file
    output_path = os.path.join(post_dir, 'index.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

# Generate Core Pages
core_pages = [
    {
        'slug': 'home',
        'title': 'Home',
        'description': 'Personal Website & Blog of Robert Opatovsky',
        'url': 'https://blog.robertopatovsky.com/home'
    },
    {
        'slug': 'posts',
        'title': 'Posts',
        'description': 'Latest thoughts and writings by Robert Opatovsky',
        'url': 'https://blog.robertopatovsky.com/posts'
    }
]

for page in core_pages:
    print(f"Generating page for: {page['title']}")
    
    page_dir = os.path.join(base_dir, page['slug'])
    if not os.path.exists(page_dir):
        os.makedirs(page_dir)
        
    html = template
    html = html.replace('<title>My Personal Space</title>', f"<title>{page['title']} | Robert Opatovsky</title>")
    html = html.replace('content="My Personal Space"', f'content="{page["title"]} | Robert Opatovsky"')
    html = html.replace('content="Personal Website & Blog of Robert Opatovsky"', f'content="{page["description"]}"')
    html = html.replace('content="https://blog.robertopatovsky.com/"', f'content="{page["url"]}"')
    
    with open(os.path.join(page_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

print('Static generation complete.')
