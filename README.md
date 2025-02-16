# Personal Website

A simple, static personal website with a blog section. Built with plain HTML, CSS, and JavaScript.

## Structure

- `index.html` - The main landing page
- `styles.css` - Global styles
- `script.js` - JavaScript for handling blog posts and markdown conversion
- `/blog` - Directory containing blog posts and metadata
  - `posts.json` - Metadata for all blog posts
  - `*.md` - Individual blog posts in markdown format

## Adding New Blog Posts

1. Create a new markdown file in the `/blog` directory with your post content
2. Add the post metadata to `posts.json` with the following structure:
   ```json
   {
       "title": "Your Post Title",
       "date": "YYYY-MM-DD",
       "slug": "your-post-slug",
       "excerpt": "A brief description of your post"
   }
   ```
3. The post will automatically appear on the home page if it's one of the 3 most recent posts

## Hosting

You can host this website using any static hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Amazon S3

Simply upload the contents of this directory to your chosen hosting service.

## Local Development

To test the website locally, you'll need to serve it through a local web server due to CORS restrictions when loading markdown files. You can use Python's built-in server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Customization

- Edit `styles.css` to change the website's appearance
- Modify `index.html` to update the landing page content
- Adjust `script.js` if you want to change how blog posts are displayed or add new features 