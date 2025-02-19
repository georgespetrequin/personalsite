import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Configure marked for syntax highlighting and other features
marked.setOptions({
    headerIds: true,
    gfm: true
});

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

// Function to generate blog content
function generateBlogContent() {
    // Define directories
    const postsDir = path.join(process.cwd(), 'blog/posts');
    const templatesDir = path.join(process.cwd(), 'blog/templates');
    const stylesDir = path.join(process.cwd(), 'blog/styles');
    const outputDir = process.env.NODE_ENV === 'production' ? 'dist' : '.';
    const distBlogDir = path.join(process.cwd(), outputDir, 'blog');
    const distPostsDir = path.join(distBlogDir, 'posts');

    // Create necessary directories
    if (!fs.existsSync(distBlogDir)) {
        fs.mkdirSync(distBlogDir, { recursive: true });
    }
    if (!fs.existsSync(distPostsDir)) {
        fs.mkdirSync(distPostsDir, { recursive: true });
    }

    // Copy styles to dist
    fs.copyFileSync(
        path.join(stylesDir, 'blog.css'),
        path.join(distBlogDir, 'styles/blog.css')
    );

    // Ensure styles directory exists in dist
    const distStylesDir = path.join(distBlogDir, 'styles');
    if (!fs.existsSync(distStylesDir)) {
        fs.mkdirSync(distStylesDir, { recursive: true });
    }

    // Read templates
    const postTemplateContent = fs.readFileSync(path.join(templatesDir, 'post.html'), 'utf8');
    const indexTemplateContent = fs.readFileSync(path.join(templatesDir, 'index.html'), 'utf8');

    // Process all markdown files
    const posts = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
            const { title, date, description, content: markdownContent } = parseFrontmatter(content);
            const htmlContent = marked(markdownContent);
            const slug = file.replace('.md', '');
            
            // Generate individual post HTML using template
            let postHtml = postTemplateContent
                .replace(/\{\{title\}\}/g, title)
                .replace(/\{\{date\}\}/g, formatDate(date))
                .replace(/\{\{content\}\}/g, htmlContent);
            
            fs.writeFileSync(path.join(distPostsDir, `${slug}.html`), postHtml);
            
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
            <div class="post-header">
                <a href="posts/${post.slug}.html" class="post-title-link">
                    <h2 class="post-title">${post.title}</h2>
                </a>
                <div class="post-date">${formatDate(post.date)}</div>
            </div>
        </article>
    `).join('\n');

    let indexHtml = indexTemplateContent.replace('{{#each posts}}', postsHtml);
    fs.writeFileSync(path.join(distBlogDir, 'index.html'), indexHtml);

    console.log('Blog generated successfully!');
}

export default function blogPlugin() {
    return {
        name: 'vite-plugin-blog',
        configureServer(server) {
            // Generate blog content initially
            generateBlogContent();
            
            // Handle blog routes in development
            server.middlewares.use((req, res, next) => {
                if (req.url.startsWith('/blog/')) {
                    // Regenerate blog content on each blog request
                    generateBlogContent();
                }
                next();
            });
        },
        buildStart() {
            generateBlogContent();
        }
    };
} 