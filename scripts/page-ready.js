(function () {
  function waitForPaint() {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
      });
    });
  }

  function waitForImages() {
    const images = Array.from(document.images).filter(
      (image) => image.loading !== "lazy",
    );

    return Promise.allSettled(
      images.map((image) => {
        if (image.complete) {
          return image.decode ? image.decode() : Promise.resolve();
        }

        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }),
    );
  }

  async function revealPage() {
    const contentTasks = [
      window.includesReady,
      window.pageContentReady,
    ].filter(Boolean);

    await Promise.allSettled(contentTasks);
    await waitForImages();

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
