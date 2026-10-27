document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  // 導覽連結平滑捲動，並在目標區塊存在時更新網址錨點。
  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: scrollBehavior });
      window.history.pushState(null, "", link.hash);
    });
  });

  // 依分類顯示作品，並同步更新篩選按鈕狀態。
  const portfolio = document.querySelector("#portfolio");
  if (portfolio) {
    const filterButtons = portfolio.querySelectorAll(".filter-button");
    const cards = portfolio.querySelectorAll(".card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        cards.forEach((card) => {
          card.hidden =
            selectedFilter !== "all" &&
            card.dataset.category !== selectedFilter;
        });
      });
    });

    // 使用原生對話框顯示作品大圖、名稱與簡介。
    const previewButtons = portfolio.querySelectorAll(".card__preview");
    if (previewButtons.length > 0) {
      const dialog = document.createElement("dialog");
      dialog.className = "portfolio-dialog";
      dialog.setAttribute("aria-label", "作品預覽");

      const closeButton = document.createElement("button");
      closeButton.className = "portfolio-dialog__close";
      closeButton.type = "button";
      closeButton.textContent = "關閉預覽";
      closeButton.addEventListener("click", () => dialog.close());
      dialog.append(closeButton);

      const previewImage = document.createElement("img");
      const previewTitle = document.createElement("h2");
      const previewDescription = document.createElement("p");
      const previewCategory = document.createElement("p");
      dialog.append(
        previewImage,
        previewTitle,
        previewDescription,
        previewCategory
      );
      body.append(dialog);

      previewButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const card = button.closest(".card");
          if (!card || typeof dialog.showModal !== "function") return;

          const image = card.querySelector("img");
          const title = card.querySelector("h3");
          const description = card.querySelector("p");
          const category = card.querySelector("p:last-of-type");
          if (!image || !title || !description || !category) return;

          previewImage.src = image.currentSrc || image.src;
          previewImage.alt = image.alt;
          previewTitle.textContent = title.textContent;
          previewDescription.textContent = description.textContent;
          previewCategory.textContent = category.textContent;
          dialog.showModal();
        });
      });

      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    }
  }

  // 捲動一定距離後顯示回到頂部按鈕。
  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.type = "button";
  backToTop.textContent = "↑";
  backToTop.setAttribute("aria-label", "回到頁面頂部");
  backToTop.hidden = true;
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  });
  body.append(backToTop);

  const updateBackToTopVisibility = () => {
    backToTop.hidden = window.scrollY < 480;
  };
  window.addEventListener("scroll", updateBackToTopVisibility, {
    passive: true,
  });
  updateBackToTopVisibility();

  // 主視覺動畫只在 JavaScript 初始化成功後啟用。
  body.classList.add("js-ready");
});