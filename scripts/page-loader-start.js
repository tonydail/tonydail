document.documentElement.classList.add("page-loading");

const loaderStyles = document.createElement("style");
loaderStyles.id = "page-loader-critical-styles";
loaderStyles.textContent = `
  html.page-loading body {
    overflow: hidden !important;
  }

  html.page-loading body > :not(#page-loader) {
    visibility: hidden !important;
  }

  #page-loader {
    display: none;
  }

  html.page-loading #page-loader {
    align-items: center;
    background: rgba(15, 23, 42, 0.55);
    box-sizing: border-box;
    display: flex !important;
    inset: 0;
    justify-content: center;
    padding: 1.5rem;
    position: fixed;
    visibility: visible !important;
    z-index: 2147483647;
  }

  #page-loader .page-loader-dialog {
    align-items: center;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
    color: #1e293b;
    display: flex;
    flex-direction: column;
    font: 600 1rem/1.5 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    gap: 1rem;
    max-width: 22rem;
    padding: 2rem;
    text-align: center;
    width: 100%;
  }

  #page-loader .page-loader-spinner {
    animation: page-loader-spin 0.8s linear infinite;
    border: 4px solid #cbd5e1;
    border-radius: 50%;
    border-top-color: #1e3a8a;
    box-sizing: border-box;
    height: 3rem;
    width: 3rem;
  }

  @keyframes page-loader-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #page-loader .page-loader-spinner {
      animation: none;
    }
  }
`;
document.head.append(loaderStyles);

window.pageLoaderTimeout = window.setTimeout(() => {
  document.documentElement.classList.remove("page-loading");
  document.getElementById("page-loader")?.remove();
  loaderStyles.remove();
}, 10000);
