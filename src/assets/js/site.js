(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const updateThemeButton = () => {
    if (!themeToggle) return;
    const isDark = root.dataset.theme === "dark";
    themeToggle.setAttribute("aria-label", isDark ? "切换浅色模式" : "切换深色模式");
    themeToggle.dataset.activeTheme = isDark ? "dark" : "light";
  };

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    updateThemeButton();
  });
  media.addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
      root.dataset.theme = event.matches ? "dark" : "light";
      updateThemeButton();
    }
  });
  updateThemeButton();

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    nav?.classList.toggle("is-open", !open);
    document.body.classList.toggle("nav-open", !open);
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    });
  });

  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".reading-progress span");
  const backToTop = document.querySelector("[data-back-to-top]");
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 16);
    backToTop?.classList.toggle("is-visible", y > 560);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  document.querySelectorAll("pre[class*='language-']").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code || pre.classList.contains("language-mermaid")) return;
    const button = document.createElement("button");
    button.className = "copy-code";
    button.type = "button";
    button.textContent = "复制";
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(code.textContent || "");
      button.textContent = "已复制";
      window.setTimeout(() => {
        button.textContent = "复制";
      }, 1600);
    });
    pre.append(button);
  });

  const dialog = document.querySelector("[data-search-dialog]");
  const input = document.querySelector("[data-search-input]");
  const status = document.querySelector("[data-search-status]");
  const results = document.querySelector("[data-search-results]");
  let indexPromise;

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return entities[character];
    });

  const loadIndex = () => {
    if (!indexPromise) {
      const url = document.body.dataset.searchIndex || "/search.json";
      indexPromise = fetch(url).then((response) => {
        if (!response.ok) throw new Error("搜索索引加载失败");
        return response.json();
      });
    }
    return indexPromise;
  };

  const openSearch = async () => {
    if (!dialog) return;
    dialog.showModal();
    document.body.classList.add("dialog-open");
    window.setTimeout(() => input?.focus(), 30);
    try {
      await loadIndex();
    } catch {
      if (status) status.textContent = "搜索索引暂时无法加载，请稍后重试。";
    }
  };

  const closeSearch = () => {
    dialog?.close();
    document.body.classList.remove("dialog-open");
  };

  document.querySelectorAll("[data-search-open]").forEach((button) =>
    button.addEventListener("click", openSearch)
  );
  document.querySelector("[data-search-close]")?.addEventListener("click", closeSearch);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeSearch();
  });
  dialog?.addEventListener("close", () => document.body.classList.remove("dialog-open"));

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const editing =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;
    if (event.key === "/" && !editing && !dialog?.open) {
      event.preventDefault();
      openSearch();
    }
  });

  input?.addEventListener("input", async () => {
    const query = input.value.trim().toLocaleLowerCase("zh-CN");
    if (!query) {
      if (status) status.textContent = "输入关键词开始搜索";
      if (results) results.innerHTML = "";
      return;
    }
    const items = await loadIndex();
    const tokens = query.split(/\s+/).filter(Boolean);
    const matched = items
      .map((item) => {
        const title = item.title.toLocaleLowerCase("zh-CN");
        const tags = item.tags.join(" ").toLocaleLowerCase("zh-CN");
        const haystack = (item.description + " " + item.text).toLocaleLowerCase("zh-CN");
        const allMatch = tokens.every(
          (token) => title.includes(token) || tags.includes(token) || haystack.includes(token)
        );
        if (!allMatch) return null;
        const score =
          tokens.reduce((sum, token) => sum + (title.includes(token) ? 6 : 0), 0) +
          tokens.reduce((sum, token) => sum + (tags.includes(token) ? 3 : 0), 0);
        return { ...item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (status) {
      status.textContent = matched.length
        ? "找到 " + matched.length + " 篇相关文章"
        : "没有找到匹配的文章";
    }
    if (results) {
      results.innerHTML = matched
        .map(
          (item) =>
            '<a class="search-result" href="' +
            item.url +
            '"><span><strong>' +
            escapeHtml(item.title) +
            "</strong><small>" +
            escapeHtml(item.date) +
            " · " +
            item.readingTime +
            " 分钟阅读</small></span><i aria-hidden=\"true\">→</i></a>"
        )
        .join("");
    }
  });
})();
