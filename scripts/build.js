const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

async function buildSite() {
    try {
        // Create necessary directories
        await fs.mkdir('dist', { recursive: true });
        await fs.mkdir('src/templates', { recursive: true });
        await fs.mkdir('src/content/pages', { recursive: true });

        // Read base template
        const baseTemplate = await fs.readFile('src/templates/base.html', 'utf-8');
        
        // Build pages from markdown
        const pagesDir = 'src/content/pages';
        const pages = await fs.readdir(pagesDir);
        
        for (const page of pages) {
            if (page.endsWith('.md')) {
                const content = await fs.readFile(path.join(pagesDir, page), 'utf-8');
                const html = marked(content);
                const title = page.replace('.md', '');
                
                const finalHtml = baseTemplate
                    .replace('{{title}}', title.charAt(0).toUpperCase() + title.slice(1))
                    .replace('{{content}}', html);
                
                await fs.writeFile(
                    path.join('dist', `${title}.html`),
                    finalHtml
                );
            }
        }
        console.log('Site built successfully!');
    } catch (error) {
        console.error('Error building site:', error);
        process.exit(1);
    }
}

buildSite(); 