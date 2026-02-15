const fs = require('fs');
const path = require('path');

// Configuration
const postsDir = path.join(__dirname, '../data/posts.json');
const templatePath = path.join(__dirname, '../index.html');
const outputDir = path.join(__dirname, '../post');

// Read data
const posts = JSON.parse(fs.readFileSync(postsDir, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

posts.forEach(post => {
    console.log(`Generating page for: ${post.title}`);

    // Create slug directory
    const postDir = path.join(outputDir, post.slug);
    if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir);
    }

    // Replace meta tags
    let html = template;

    // Title
    html = html.replace('<title>My Personal Space</title>', `<title>${post.title} | Robert Opatovsky</title>`);
    html = html.replace('content="My Personal Space"', `content="${post.title}"`);

    // Description
    html = html.replace('content="Personal Website & Blog of Robert Opatovsky"', `content="${post.excerpt || post.title}"`);

    // URL
    const postUrl = `https://blog.robertopatovsky.com/post/${post.slug}`;
    html = html.replace('content="https://blog.robertopatovsky.com/"', `content="${postUrl}"`);

    // Write file
    fs.writeFileSync(path.join(postDir, 'index.html'), html);
});

console.log('Static generation complete.');
