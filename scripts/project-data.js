(function () {
  const scriptUrl = document.currentScript.src;

  function loadProjects() {
    return window.ContentData.loadCollection(
      "../data/projects.json",
      scriptUrl,
      "Project",
    );
  }

  function findProject(projects, id) {
    return window.ContentData.findById(projects, id);
  }

  window.ProjectData = {
    findProject,
    loadProjects,
  };
})();
