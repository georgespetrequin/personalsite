// Function to fetch and parse markdown content
async function fetchMarkdown(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch markdown');
        return await response.text();
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return null;
    }
}

// Function to convert markdown to HTML
function markdownToHtml(markdown) {
    // This is a very simple markdown parser
    // You might want to use a library like marked.js for more complex markdown
    return markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// Function to load blog posts
async function loadBlogPosts() {
    const latestPostsElement = document.getElementById('latest-posts');
    if (!latestPostsElement) return;

    try {
        const response = await fetch('/blog/posts.json');
        if (!response.ok) throw new Error('Failed to fetch posts list');
        
        const posts = await response.json();
        
        const postsHtml = posts
            .slice(0, 3) // Show only the 3 most recent posts
            .map(post => `
                <div class="blog-post">
                    <h2>${post.title}</h2>
                    <div class="date">${post.date}</div>
                    <p>${post.excerpt}</p>
                    <a href="/blog/${post.slug}">Read more</a>
                </div>
            `)
            .join('');
        
        latestPostsElement.innerHTML = postsHtml;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        latestPostsElement.innerHTML = '<p>Failed to load blog posts.</p>';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
}); 