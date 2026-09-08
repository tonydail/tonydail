// Add cache buster to CSS files
function bustCssCache() {
  const cacheBuster = Date.now().toString();
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href*="style.css"]');

  const stylesheetLoads = Array.from(cssLinks).map((link) => {
    const href = link.getAttribute('href');
    if (!href) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const stylesheetUrl = new URL(href, window.location.href);
      stylesheetUrl.searchParams.set("v", cacheBuster);
      link.addEventListener("load", resolve, { once: true });
      link.addEventListener("error", resolve, { once: true });
      link.setAttribute("href", stylesheetUrl.toString());
    });
  });

  return Promise.all(stylesheetLoads);
}

async function loadIncludes() {
  const targets = document.querySelectorAll("[data-include]");
  const cacheBuster = Date.now().toString();

  const includeResults = await Promise.allSettled(
    Array.from(targets).map(async (target) => {
      const url = target.getAttribute("data-include");
      if (!url) return;

      const includeUrl = new URL(url, window.location.href);
      includeUrl.searchParams.set("_", cacheBuster);

      const response = await fetch(includeUrl.toString(), {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Failed to load include: ${url}`);
      }

      target.outerHTML = await response.text();
    }),
  );

  includeResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error(result.reason);
    }
  });

  setActiveNavLink();
}

function setActiveNavLink() {
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll("[data-nav]");

  navLinks.forEach((link) => {
    const linkPath = normalizePath(new URL(link.getAttribute("href"), window.location.href).pathname);
    const isProjectDetail =
      link.dataset.nav === "portfolio" && currentPath.endsWith("/project.html");
    const isBlogDetail =
      link.dataset.nav === "blog" && currentPath.endsWith("/blog-post.html");
    const isActive = linkPath === currentPath || isProjectDetail || isBlogDetail;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function normalizePath(pathname) {
  if (pathname === "/" || pathname === "") {
    return "/index.html";
  }

  return pathname.endsWith("/") ? `${pathname}index.html` : pathname;
}

// Expose shared layout readiness so the page loader avoids partial rendering.
window.includesReady = Promise.allSettled([bustCssCache(), loadIncludes()]);
