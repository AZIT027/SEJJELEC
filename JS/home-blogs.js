async function loadHomeBlogs() {

    const container = document.getElementById("home-blog-grid");

    // Stop if the container doesn't exist
    if (!container) return;

    try {

        const response = await fetch("/data/blogs.json");

        if (!response.ok) {
            throw new Error(`Failed to load blogs.json (${response.status})`);
        }

        const blogs = await response.json();

        // Get the 3 most recent articles without modifying the original array
        const latestBlogs = [...blogs]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        let html = "";

        latestBlogs.forEach(blog => {

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

        container.innerHTML = html;

    } catch (error) {

        console.error("Unable to load home blogs:", error);

        container.innerHTML = `
            <p class="blog-error">
                Impossible de charger les articles pour le moment.
            </p>
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

loadHomeBlogs();