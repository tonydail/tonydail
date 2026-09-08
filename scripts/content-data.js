(function () {
  async function loadCollection(relativePath, scriptUrl, collectionName) {
    const dataUrl = new URL(relativePath, scriptUrl);
    const response = await fetch(dataUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load ${collectionName} (${response.status})`);
    }

    const items = await response.json();

    if (!Array.isArray(items)) {
      throw new Error(`${collectionName} data must be an array`);
    }

    return items;
  }

  function findById(items, id) {
    return items.find((item) => item.id === id);
  }

  window.ContentData = {
    findById,
    loadCollection,
  };
})();
