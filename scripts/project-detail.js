(function () {
  const detail = document.getElementById("project-detail");
  const status = document.getElementById("project-status");

  function createSection(title, className) {
    const section = document.createElement("section");
    section.className = className;

    const heading = document.createElement("h2");
    heading.className = "section-heading";
    heading.textContent = title;
    section.append(heading);

    return section;
  }

  function createExternalLink(url, label, className, iconClass) {
    const link = document.createElement("a");
    link.className = className;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const icon = document.createElement("i");
    icon.className = iconClass;
    icon.setAttribute("aria-hidden", "true");

    link.append(icon, document.createTextNode(` ${label}`));
    return link;
  }

  function renderDescription(project) {
    if (!Array.isArray(project.description) || project.description.length === 0) {
      return;
    }

    const section = createSection("Overview", "project-section");
    project.description.forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.className = "page-content";
      paragraph.textContent = paragraphText;
      section.append(paragraph);
    });
    detail.append(section);
  }

  function renderHighlights(project) {
    if (!Array.isArray(project.highlights) || project.highlights.length === 0) {
      return;
    }

    const section = createSection("Highlights", "project-section");
    const list = document.createElement("ul");
    list.className = "project-highlights";

    project.highlights.forEach((highlight) => {
      const item = document.createElement("li");
      item.textContent = highlight;
      list.append(item);
    });

    section.append(list);
    detail.append(section);
  }

  function renderTechnologies(project) {
    if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
      return;
    }

    const section = createSection("Technologies", "project-section");
    const technologies = document.createElement("div");
    technologies.className = "tech-tags project-tech-tags";

    project.technologies.forEach((technology) => {
      const tag = document.createElement("span");
      tag.className = "tech-tag";
      tag.textContent = technology;
      technologies.append(tag);
    });

    section.append(technologies);
    detail.append(section);
  }

  function renderImages(project) {
    if (!Array.isArray(project.images) || project.images.length === 0) {
      return;
    }

    const section = createSection("Project images", "project-section");
    const gallery = document.createElement("div");
    gallery.className = "project-gallery";

    project.images.forEach((imageData) => {
      const figure = document.createElement("figure");
      figure.className = "project-image";

      const image = document.createElement("img");
      image.src = imageData.src;
      image.alt = imageData.alt;
      image.loading = "lazy";
      figure.append(image);

      if (imageData.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = imageData.caption;
        figure.append(caption);
      }

      gallery.append(figure);
    });

    section.append(gallery);
    detail.append(section);
  }

  function renderActions(project) {
    if (!project.repositoryUrl && !project.demoUrl) {
      return;
    }

    const actions = document.createElement("div");
    actions.className = "project-actions";

    if (project.repositoryUrl) {
      actions.append(
        createExternalLink(
          project.repositoryUrl,
          "View code on GitHub",
          "btn-primary-custom",
          "fab fa-github",
        ),
      );
    }

    if (project.demoUrl) {
      actions.append(
        createExternalLink(
          project.demoUrl,
          "View live project",
          "btn-secondary-custom",
          "fas fa-arrow-up-right-from-square",
        ),
      );
    }

    detail.append(actions);
  }

  function updateMetadata(project) {
    const pageTitle = `${project.title} - Charles Dail`;
    document.title = `${pageTitle} | Engineering Leader & Software Architect`;
    document.getElementById("page-description").content = project.summary;
    document.getElementById("og-title").content = pageTitle;
    document.getElementById("og-description").content = project.summary;
  }

  function renderProject(project) {
    const heading = document.createElement("h1");
    heading.className = "page-title color-primary";
    heading.textContent = project.title;

    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary;

    detail.append(heading, summary);
    renderActions(project);
    renderDescription(project);
    renderHighlights(project);
    renderTechnologies(project);
    renderImages(project);
    updateMetadata(project);

    status.hidden = true;
    detail.hidden = false;
  }

  function showNotFound() {
    status.className = "content-status content-status-error";
    status.replaceChildren();

    const heading = document.createElement("h1");
    heading.className = "content-status-title";
    heading.textContent = "Project not found";

    const message = document.createElement("p");
    message.textContent = "The requested project does not exist or the project ID is missing.";

    const link = document.createElement("a");
    link.className = "btn-primary-custom";
    link.href = "projects.html";
    link.textContent = "View all projects";

    status.append(heading, message, link);
    document.title = "Project Not Found - Charles Dail";
  }

  async function loadProject() {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
      showNotFound();
      return;
    }

    try {
      const projects = await window.ProjectData.loadProjects();
      const project = window.ProjectData.findProject(projects, id);

      if (!project) {
        showNotFound();
        return;
      }

      renderProject(project);
    } catch (error) {
      console.error(error);
      status.className = "content-status content-status-error";
      status.textContent = "This project could not be loaded. Please try again later.";
    }
  }

  window.pageContentReady = loadProject();
})();
