const fs = require('fs');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Read the template file
const template = fs.readFileSync(path.join(__dirname, '../template.html'), 'utf-8');

// Setup directories
const postsDir = path.join(__dirname, '../posts');
const distDir = path.join(__dirname, '../dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Get all markdown files from the posts directory
const posts = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));

// Process each markdown file
posts.forEach(post => {
    const content = fs.readFileSync(path.join(postsDir, post), 'utf-8');
    const { attributes, body } = frontMatter(content);
    
    // Convert markdown to HTML
    const htmlContent = marked.parse(body);
    
    // Replace template placeholders
    let postHtml = template
        .replace('{{title}}', attributes.title || 'Blog Post')
        .replace('{{date}}', attributes.date || new Date().toLocaleDateString())
        .replace('{{content}}', htmlContent);
    
    // Write the HTML file to dist directory
    const htmlFileName = post.replace('.md', '.html');
    fs.writeFileSync(path.join(distDir, htmlFileName), postHtml);
});

console.log('Blog posts built successfully!'); 