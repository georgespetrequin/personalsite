const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked for syntax highlighting and other features
marked.setOptions({
    headerIds: true,
    gfm: true
});

// Template for a blog post
const postTemplate = (title, date, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Georges Petrequin</title>
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="../blog.css">
</head>
<body>
    <nav>
        <div class="nav-container">
            <div class="nav-links">
                <a href="/" title="Home">
                    <svg class="home-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
                    </svg>
                </a>
                <a href="/blog/">Blog</a>
            </div>
        </div>
    </nav>

    <main>
        <article class="blog-content">
            <header class="blog-header">
                <h1 class="gradient-text">${title}</h1>
                <div class="post-meta">Posted on ${date}</div>
            </header>

            <div class="blog-body">
                ${content}
            </div>

            <a href="/blog/" class="back-to-blog">← Back to Blog</a>
        </article>
    </main>

    <script src="../../script.js"></script>
</body>
</html>`;

// Template for the blog index page
const indexTemplate = (posts) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Georges Petrequin - Blog</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="blog.css">
</head>
<body>
    <nav>
        <div class="nav-container">
            <div class="nav-links">
                <a href="/" title="Home">
                    <svg class="home-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
                    </svg>
                </a>
                <a href="/blog/">Blog</a>
            </div>
        </div>
    </nav>

    <main>
        <section class="intro-section">
            <h1>Blog</h1>
            <p class="bio">Welcome to my blog where I share my thoughts, experiences, and insights about technology, development, and more.</p>
        </section>

        <section class="blog-posts">
            ${posts}
        </section>
    </main>

    <script src="../script.js"></script>
</body>
</html>`;

// Function to parse frontmatter
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return { content };
    
    const frontmatter = {};
    match[1].split('\n').forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value) {
            frontmatter[key.trim()] = value.join(':').trim();
        }
    });
    
    return {
        ...frontmatter,
        content: match[2]
    };
}

// Function to format date
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Process all markdown files
const markdownDir = path.join(__dirname, 'markdown');
const postsDir = path.join(__dirname, 'posts');

// Create posts directory if it doesn't exist
if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir);
}

// Read all markdown files
const posts = fs.readdirSync(markdownDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const content = fs.readFileSync(path.join(markdownDir, file), 'utf8');
        const { title, date, description, content: markdownContent } = parseFrontmatter(content);
        const htmlContent = marked(markdownContent);
        const slug = file.replace('.md', '');
        
        // Generate individual post HTML
        const postHtml = postTemplate(title, formatDate(date), htmlContent);
        fs.writeFileSync(path.join(postsDir, `${slug}.html`), postHtml);
        
        return {
            title,
            date: new Date(date),
            description,
            slug
        };
    })
    .sort((a, b) => b.date - a.date); // Sort posts by date, newest first

// Generate index page with post previews
const postsHtml = posts.map(post => `
    <article class="blog-post">
        <h2 class="gradient-text">${post.title}</h2>
        <div class="post-meta">Posted on ${formatDate(post.date)}</div>
        <p>${post.description}</p>
        <a href="posts/${post.slug}.html" class="read-more">
            Read more →
        </a>
    </article>
`).join('\n');

const indexHtml = indexTemplate(postsHtml);
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);

console.log('Blog generated successfully!'); 