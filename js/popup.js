document.addEventListener("DOMContentLoaded", () => {
  const tabList = document.getElementById("tab-list");
  const removeDuplicatesBtn = document.getElementById("remove-duplicates");
  const closeAllBtn = document.getElementById("close-all");

  // Carrega e renderiza a lista de abas
  async function renderTabs() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    tabList.innerHTML = "";

    tabs.forEach((tab) => {
      const li = document.createElement("li");
      li.className = "tab-item";

      // Ícone (Favicon) — usa o domínio real da aba como fallback
      const favicon = document.createElement("img");
      let fallbackDomain = "";
      try {
        fallbackDomain = tab.url ? new URL(tab.url).hostname : "";
      } catch {
        fallbackDomain = "";
      }
      favicon.src =
        tab.favIconUrl || `https://www.google.com/s2/favicons?domain=${fallbackDomain}`;
      favicon.className = "tab-icon";

      // Título / Ação de Alternar para a Aba
      const title = document.createElement("span");
      title.textContent = tab.title || "Nova Aba";
      title.className = "tab-title";

      li.addEventListener("click", () => {
        chrome.tabs.update(tab.id, { active: true });
      });

      // Botão Individual para Fechar Aba
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "✕";
      closeBtn.className = "close-btn";
      closeBtn.title = "Fechar aba";

      closeBtn.addEventListener("click", async (e) => {
        e.stopPropagation(); // Impede que o clique alterne para a aba
        await chrome.tabs.remove(tab.id);
        renderTabs(); // Atualiza a lista
      });

      li.appendChild(favicon);
      li.appendChild(title);
      li.appendChild(closeBtn);
      tabList.appendChild(li);
    });
  }

  // Ação: Fechar abas duplicadas
  removeDuplicatesBtn.addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const seenUrls = new Set();
    const duplicateIds = [];

    tabs.forEach((tab) => {
      if (seenUrls.has(tab.url)) {
        duplicateIds.push(tab.id);
      } else {
        seenUrls.add(tab.url);
      }
    });

    if (duplicateIds.length > 0) {
      await chrome.tabs.remove(duplicateIds);
      renderTabs();
    }
  });

  // Ação: Fechar todas as abas da janela atual
  closeAllBtn.addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const tabIds = tabs.map((tab) => tab.id);
    if (tabIds.length === 0) return;

    const confirmado = confirm(
      `Fechar ${tabIds.length} aba(s)? Essa ação não pode ser desfeita.`
    );
    if (!confirmado) return;

    await chrome.tabs.remove(tabIds);
  });

  // Inicializa a renderização
  renderTabs();
});