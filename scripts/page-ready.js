(function () {
  function waitForPaint() {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
      });
    });
  }

  async function revealPage() {
    const contentTasks = [
      window.includesReady,
      window.pageContentReady,
    ].filter(Boolean);

    await Promise.allSettled(contentTasks);

    if (document.fonts?.ready) {
      await Promise.allSettled([document.fonts.ready]);
    }

    await waitForPaint();

    window.clearTimeout(window.pageLoaderTimeout);
    document.documentElement.classList.remove("page-loading");
    document.getElementById("page-loader")?.remove();
    document.getElementById("page-loader-critical-styles")?.remove();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealPage, { once: true });
  } else {
    revealPage();
  }
})();
