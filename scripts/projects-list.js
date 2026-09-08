(function () {
  const grid = document.getElementById("projects-grid");
  const status = document.getElementById("projects-status");

  function createTechnologyTag(technology) {
    const tag = document.createElement("span");
    tag.className = "tech-tag";
    tag.textContent = technology;
    return tag;
  }

  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "portfolio-card";

    const header = document.createElement("div");
    header.className = "portfolio-card-header";

    const icon = document.createElement("i");
    icon.className = "fas fa-diagram-project portfolio-icon";
    icon.setAttribute("aria-hidden", "true");

    const title = document.createElement("h2");
    title.className = "portfolio-card-title text-white fs-4 lh-sm mb-0";
    title.textContent = project.title;

    header.append(icon, title);

    const body = document.createElement("div");
    body.className = "portfolio-card-body";

    const summary = document.createElement("p");
    summary.textContent = project.summary;
    body.append(summary);

    if (Array.isArray(project.technologies) && project.technologies.length > 0) {
      const technologies = document.createElement("div");
      technologies.className = "tech-tags";
      technologies.setAttribute("aria-label", "Technologies");
      project.technologies
        .slice(0, 6)
        .forEach((technology) => technologies.append(createTechnologyTag(technology)));
      body.append(technologies);
    }

    const footer = document.createElement("div");
    footer.className = "portfolio-card-footer";

    const detailLink = document.createElement("a");
    detailLink.className = "btn-primary-custom btn-sm";
    detailLink.href = `project.html?id=${encodeURIComponent(project.id)}`;
    detailLink.textContent = "View project details";
    footer.append(detailLink);

    card.append(header, body, footer);
    return card;
  }

  async function renderProjects() {
    try {
      const projects = await window.ProjectData.loadProjects();

      if (projects.length === 0) {
        status.className = "content-status content-status-empty";
        status.textContent = "No projects are available yet.";
        return;
      }

      projects.forEach((project) => grid.append(createProjectCard(project)));
      status.hidden = true;
      grid.hidden = false;
    } catch (error) {
      console.error(error);
      status.className = "content-status content-status-error";
      status.textContent = "Projects could not be loaded. Please try again later.";
    }
  }

  window.pageContentReady = renderProjects();
})();
