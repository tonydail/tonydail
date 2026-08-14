// Add cache buster to CSS files
function bustCssCache() {
  const cacheBuster = Date.now().toString();
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href*="style.css"]');
  
  cssLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.includes('?')) {
      link.setAttribute('href', `${href}?v=${cacheBuster}`);
    }
  });
}

async function loadIncludes() {
  const targets = document.querySelectorAll("[data-include]");
  const cacheBuster = Date.now().toString();

  await Promise.all(
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

  setActiveNavLink();
}

function setActiveNavLink() {
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll("[data-nav]");

  navLinks.forEach((link) => {
    const linkPath = normalizePath(new URL(link.getAttribute("href"), window.location.href).pathname);
    const isActive = linkPath === currentPath;

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

// Bust CSS cache first
bustCssCache();

// Then load includes
loadIncludes().catch((error) => {
  console.error(error);
});
