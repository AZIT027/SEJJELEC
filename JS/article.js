// ==========================================================
// ARTICLE PAGE
// ==========================================================

async function loadArticle() {

    const articleContent = document.getElementById("article-content");

    if (!articleContent) return;

    try {

        // ==================================================
        // LOAD BLOG DATABASE
        // ==================================================

        const response = await fetch("data/blogs.json");

        if (!response.ok) {
            throw new Error(`Failed to load blogs.json (${response.status})`);
        }

        const blogs = await response.json();

        // ==================================================
        // GET ARTICLE SLUG
        // ==================================================

        const params = new URLSearchParams(window.location.search);
        const slug = params.get("slug");

        if (!slug) {
            throw new Error("Missing article slug.");
        }

        // ==================================================
        // FIND ARTICLE
        // ==================================================

        const article = blogs.find(blog => blog.slug === slug);

        if (!article) {
            throw new Error("Article not found.");
        }

        // ==================================================
        // PAGE TITLE & SEO
        // ==================================================

        document.title = `${article.title} | SEJJELEC`;
        // Meta Description
        document.querySelector('meta[name="description"]')
            ?.setAttribute("content", article.description);

        // Canonical
        document.getElementById("canonical-link")
            ?.setAttribute(
                "href",
                `https://www.sejjelec.com/article.html?slug=${article.slug}`
            );

        // Open Graph
        document.getElementById("og-title")
            ?.setAttribute("content", article.title);

        document.getElementById("og-description")
            ?.setAttribute("content", article.description);

        document.getElementById("og-image")
            ?.setAttribute(
                "content",
                `https://www.sejjelec.com/${article.image}`
            );

        document.getElementById("og-url")
            ?.setAttribute(
                "content",
                `https://www.sejjelec.com/article.html?slug=${article.slug}`
            );

        // Twitter
        document.getElementById("twitter-title")
            ?.setAttribute("content", article.title);

        document.getElementById("twitter-description")
            ?.setAttribute("content", article.description);

        document.getElementById("twitter-image")
            ?.setAttribute(
                "content",
                `https://www.sejjelec.com/${article.image}`
            );

        const schema = {
            "@context":"https://schema.org",
            "@type":"Article",

            "headline":article.title,

            "description":article.description,

            "image":[
                `https://www.sejjelec.com/${article.image}`
            ],

            "author":{
                "@type":"Organization",
                "name":"SEJJELEC"
            },

            "publisher":{
                "@type":"Organization",

                "name":"SEJJELEC",

                "logo":{
                    "@type":"ImageObject",
                    "url":"https://www.sejjelec.com/images/sejjelek_logo_only.png"
                }
            },

            "datePublished":article.date,

            "dateModified":article.date,

            "mainEntityOfPage":{
                "@type":"WebPage",
                "@id":`https://www.sejjelec.com/article.html?slug=${article.slug}`
            }

        };

        const script=document.createElement("script");

        script.type="application/ld+json";

        script.text=JSON.stringify(schema);

        document.head.appendChild(script);

        // ==================================================
        // HERO
        // ==================================================

        const title = document.getElementById("article-title");
        if (title) {
            title.textContent = article.title;
        }

        document.documentElement.style.setProperty(
            "--hero-image-1",
            `url("${article.image}")`
        );

        const breadcrumbTitle = document.getElementById("article-breadcrumb-title");
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = article.title;
        }

        const description = document.getElementById("article-description");
        if (description) {
            description.textContent = article.description;
        }

        const author = document.getElementById("article-author");
        if (author) {
            author.textContent = article.author || "SEJJELEC";
        }

        // ==================================================
        // ARTICLE META
        // ==================================================

        const category = document.getElementById("article-category");
        if (category) {
            category.textContent = article.service.name;
        }

        const date = document.getElementById("article-date");
        if (date) {
            date.textContent = formatDate(article.date);
        }

        const readingTime = document.getElementById("article-reading-time");
        if (readingTime) {
            readingTime.textContent = article.readingTime;
        }

        // ==================================================
        // LOAD ARTICLE HTML
        // ==================================================

        const articleResponse = await fetch(article.content);

        if (!articleResponse.ok) {
            throw new Error(`Failed to load article (${articleResponse.status})`);
        }

        const html = await articleResponse.text();

        articleContent.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        articleContent.innerHTML = `
            <div class="article-error">
                <h2>Article indisponible</h2>
                <p>
                    Impossible de charger cet article pour le moment.
                </p>
            </div>
        `;

    }

}

// ==========================================================

function formatDate(date) {

    return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}

// ==========================================================

loadArticle();