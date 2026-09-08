(function () {
  const scriptUrl = document.currentScript.src;

  function loadPosts() {
    return window.ContentData.loadCollection(
      "../data/blog-posts.json",
      scriptUrl,
      "Blog post",
    );
  }

  function findPost(posts, id) {
    return window.ContentData.findById(posts, id);
  }

  window.BlogData = {
    findPost,
    loadPosts,
  };
})();
