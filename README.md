# Your Name - Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript. This website is designed to showcase my projects, skills, and contact information in a clean and professional manner.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Interactive project filtering
- Smooth scrolling navigation
- Contact form
- Modern animations and transitions
- Social media integration

## How to Use

1. Clone this repository to your local machine
2. Customize the HTML content in `index.html` with your information:
   - Update your name, title, and bio
   - Replace project details with your own work
   - Update contact information and social media links
3. Replace the placeholder images:
   - Profile image (`img/profile.jpg`)
   - Hero background image (`img/hero-bg.jpg`)
   - Project images (`img/project1.jpg`, `img/project2.jpg`, etc.)
4. Customize colors in the CSS by modifying the root variables in `css/styles.css`

## Hosting on GitHub Pages

1. Create a new GitHub repository
2. Push your code to the repository
3. Go to the repository settings
4. Scroll down to the GitHub Pages section
5. Select the branch you want to deploy (usually `main`)
6. Click Save

Your website will be available at `https://yourusername.github.io/repository-name/`

## Customization Tips

### Changing Colors

Edit the CSS variables in the `:root` selector in `css/styles.css`:

```css
:root {
    --primary-color: #4e73df;
    --secondary-color: #2e59d9;
    /* Other colors */
}
```

### Adding New Projects

Copy an existing project card structure in the HTML and customize it:

```html
<div class="project-card" data-category="your-category">
    <div class="project-img">
        <img src="img/your-project-image.jpg" alt="Project Title">
    </div>
    <div class="project-info">
        <h3>Project Title</h3>
        <p>Project description goes here</p>
        <div class="project-tags">
            <span>Tag1</span>
            <span>Tag2</span>
        </div>
        <div class="project-links">
            <a href="demo-link" class="btn small-btn">Demo</a>
            <a href="code-link" class="btn small-btn secondary-btn">Code</a>
        </div>
    </div>
</div>
```

### Adding New Skills

Add a new skill item to the appropriate category:

```html
<div class="skill-item
