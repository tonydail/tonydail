(function () {
  const resumeUrl = "assets/charles-dail-resume.pdf";
  const status = document.getElementById("resume-status");
  const viewer = document.getElementById("resume-viewer");
  const pages = document.getElementById("resume-pages");

  async function renderPage(pdf, pageNumber) {
    const page = await pdf.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.min(
      document.documentElement.clientWidth - 64,
      1000,
    );
    const scale = Math.max(availableWidth, 320) / baseViewport.width;
    const viewport = page.getViewport({ scale });
    const outputScale = window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.className = "resume-page";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `Resume page ${pageNumber}`);
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    pages.append(canvas);

    await page.render({
      canvasContext: context,
      viewport,
      transform:
        outputScale === 1
          ? null
          : [outputScale, 0, 0, outputScale, 0, 0],
    }).promise;
  }

  async function loadResume() {
    try {
      if (!window.pdfjsLib) {
        throw new Error("PDF.js failed to load");
      }

      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const pdf = await window.pdfjsLib.getDocument({
        url: resumeUrl,
        disableAutoFetch: false,
      }).promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        await renderPage(pdf, pageNumber);
      }

      status.hidden = true;
      viewer.hidden = false;
    } catch (error) {
      console.error(error);
      status.className = "content-status content-status-error";
      status.textContent =
        "The embedded resume could not be displayed. Use Open PDF or Download PDF instead.";
      viewer.hidden = false;
      pages.hidden = true;
    }
  }

  window.pageContentReady = loadResume();
})();
