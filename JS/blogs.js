async function loadBlogs() {

    const blogGrid = document.getElementById("blog-grid");

    // Stop if the container doesn't exist
    if (!blogGrid) return;

    try {

        const response = await fetch("/data/blogs.json");

        if (!response.ok) {
            throw new Error(`Failed to load blogs.json (${response.status})`);
        }

        const blogs = await response.json();

        // Sort without modifying the original array
        const sortedBlogs = [...blogs].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        let html = "";

        sortedBlogs.forEach(blog => {

            html += `
                <article class="blog-card">

                    <a href="article.html?slug=${blog.slug}">

                        <div class="blog-image">

                            <img
                                src="${blog.image}"
                                alt="${blog.title}"
                                loading="lazy">

                        </div>

                        <div class="blog-content">

                            <div class="blog-category">
                                <span>${blog.service.name}</span>
                            </div>

                            <div class="blog-meta">

                                <div class="blog-date">

                                    <img
                                        src="images/icons/calendar.png"
                                        alt="">

                                    <span>${formatDate(blog.date)}</span>

                                </div>

                                <div class="blog-reading-time">

                                    <img
                                        src="images/icons/clock.png"
                                        alt="">

                                    <span>${blog.readingTime}</span>

                                </div>

                            </div>

                            <h3>${blog.title}</h3>

                            <p class="blog-description">
                                ${blog.description}
                            </p>

                            <div class="blog-link">

                                <span>Lire l'article</span>

                                <img
                                    src="images/icons/arrow.png"
                                    alt="">

                            </div>

                        </div>

                    </a>

                </article>
            `;

        });

        blogGrid.innerHTML = html;

    } catch (error) {

        console.error("Unable to load blogs:", error);

        blogGrid.innerHTML = `
            <div class="blog-error">
                <h3>Impossible de charger les articles</h3>
                <p>Veuillez réessayer ultérieurement.</p>
            </div>
        `;

    }

}

function formatDate(date) {

    return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}

loadBlogs();

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: sortedBlogs.map((blog, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.sejjelec.com/article.html?slug=${blog.slug}`
  }))
};

const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = JSON.stringify(blogSchema);

document.head.appendChild(script);