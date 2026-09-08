(function () {
  const grid = document.getElementById("blog-grid");
  const status = document.getElementById("blog-status");

  function formatDate(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? dateValue
      : new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(date);
  }

  function createTag(tagText) {
    const tag = document.createElement("span");
    tag.className = "tech-tag";
    tag.textContent = tagText;
    return tag;
  }

  function createPostCard(post) {
    const card = document.createElement("article");
    card.className = "portfolio-card blog-card";

    const header = document.createElement("div");
    header.className = "portfolio-card-header blog-card-header";

    const icon = document.createElement("i");
    icon.className = "fas fa-pen-nib portfolio-icon";
    icon.setAttribute("aria-hidden", "true");

    const title = document.createElement("h2");
    title.className = "portfolio-card-title text-white fs-4 lh-sm mb-0";
    title.textContent = post.title;
    header.append(icon, title);

    const body = document.createElement("div");
    body.className = "portfolio-card-body";

    const metadata = document.createElement("p");
    metadata.className = "blog-metadata";
    metadata.textContent = `${formatDate(post.publishedDate)} by ${post.author}`;

    const summary = document.createElement("p");
    summary.textContent = post.summary;
    body.append(metadata, summary);

    if (Array.isArray(post.tags) && post.tags.length > 0) {
      const tags = document.createElement("div");
      tags.className = "tech-tags";
      tags.setAttribute("aria-label", "Article topics");
      post.tags.forEach((tag) => tags.append(createTag(tag)));
      body.append(tags);
    }

    const footer = document.createElement("div");
    footer.className = "portfolio-card-footer";

    const detailLink = document.createElement("a");
    detailLink.className = "btn-primary-custom btn-sm";
    detailLink.href = `blog-post.html?id=${encodeURIComponent(post.id)}`;
    detailLink.textContent = "Read article";
    footer.append(detailLink);

    card.append(header, body, footer);
    return card;
  }

  async function renderPosts() {
    try {
      const posts = await window.BlogData.loadPosts();

      if (posts.length === 0) {
        status.className = "content-status content-status-empty";
        status.textContent = "No articles are available yet.";
        return;
      }

      posts.forEach((post) => grid.append(createPostCard(post)));
      status.hidden = true;
      grid.hidden = false;
    } catch (error) {
      console.error(error);
      status.className = "content-status content-status-error";
      status.textContent = "Articles could not be loaded. Please try again later.";
    }
  }

  window.pageContentReady = renderPosts();
})();
