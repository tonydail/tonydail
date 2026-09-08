(function () {
  const detail = document.getElementById("blog-post-detail");
  const status = document.getElementById("blog-post-status");

  function formatDate(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? dateValue
      : new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(date);
  }

  function renderTags(post) {
    if (!Array.isArray(post.tags) || post.tags.length === 0) {
      return;
    }

    const tags = document.createElement("div");
    tags.className = "tech-tags blog-post-tags";
    tags.setAttribute("aria-label", "Article topics");

    post.tags.forEach((tagText) => {
      const tag = document.createElement("span");
      tag.className = "tech-tag";
      tag.textContent = tagText;
      tags.append(tag);
    });

    detail.append(tags);
  }

  function renderSections(post) {
    if (!Array.isArray(post.sections)) {
      return;
    }

    post.sections.forEach((sectionData) => {
      const section = document.createElement("section");
      section.className = "project-section blog-post-section";

      if (sectionData.heading) {
        const heading = document.createElement("h2");
        heading.className = "section-heading";
        heading.textContent = sectionData.heading;
        section.append(heading);
      }

      if (Array.isArray(sectionData.paragraphs)) {
        sectionData.paragraphs.forEach((paragraphText) => {
          const paragraph = document.createElement("p");
          paragraph.className = "page-content";
          paragraph.textContent = paragraphText;
          section.append(paragraph);
        });
      }

      detail.append(section);
    });
  }

  function updateMetadata(post) {
    const pageTitle = `${post.title} - Charles Dail`;
    document.title = `${pageTitle} | Engineering Blog`;
    document.getElementById("page-description").content = post.summary;
    document.getElementById("og-title").content = pageTitle;
    document.getElementById("og-description").content = post.summary;
  }

  function renderPost(post) {
    const heading = document.createElement("h1");
    heading.className = "page-title color-primary";
    heading.textContent = post.title;

    const metadata = document.createElement("p");
    metadata.className = "blog-post-metadata";
    metadata.textContent = `${formatDate(post.publishedDate)} by ${post.author}`;

    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = post.summary;

    detail.append(heading, metadata, summary);
    renderTags(post);
    renderSections(post);
    updateMetadata(post);

    status.hidden = true;
    detail.hidden = false;
  }

  function showNotFound() {
    status.className = "content-status content-status-error";
    status.replaceChildren();

    const heading = document.createElement("h1");
    heading.className = "content-status-title";
    heading.textContent = "Article not found";

    const message = document.createElement("p");
    message.textContent = "The requested article does not exist or the article ID is missing.";

    const link = document.createElement("a");
    link.className = "btn-primary-custom";
    link.href = "blog.html";
    link.textContent = "View all articles";

    status.append(heading, message, link);
    document.title = "Article Not Found - Charles Dail";
  }

  async function loadPost() {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
      showNotFound();
      return;
    }

    try {
      const posts = await window.BlogData.loadPosts();
      const post = window.BlogData.findPost(posts, id);

      if (!post) {
        showNotFound();
        return;
      }

      renderPost(post);
    } catch (error) {
      console.error(error);
      status.className = "content-status content-status-error";
      status.textContent = "This article could not be loaded. Please try again later.";
    }
  }

  window.pageContentReady = loadPost();
})();
