
import { renderStats, updateStats } from '.js/modules/stats.js';

document.addEventListener("DOMContentLoaded", () => {
  // 1. Elementos do DOM
  const tabList = document.getElementById("tab-list");
  const sessionList = document.getElementById("session-list");
  const sessionNameInput = document.getElementById("session-name");
  const fileImportInput = document.getElementById("file-import");

  // 2. Navegação entre as abas da extensão (Menu Superior)
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Remove a classe ativa de todas as abas
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      
      // Adiciona a classe ativa na aba clicada
      const target = e.target;
      target.classList.add("active");
      
      const targetId = target.dataset.target;
      document.getElementById(targetId).classList.add("active");

      // Atualiza as estatísticas QUANDO a aba for clicada
      if (targetId === "tab-stats") {
        updateStats();
      }
    });
  });

  // 3. Funções Principais de Renderização

  // --- RENDERIZAÇÃO DAS ABAS ATIVAS ---
  async function renderTabs() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    tabList.innerHTML = "";

    tabs.forEach((tab) => {
      const li = document.createElement("li");
      li.className = "list-item tab-item";

      const favicon = document.createElement("img");
      favicon.src = tab.favIconUrl || "https://www.google.com/s2/favicons?domain=example.com";
      favicon.className = "tab-icon";

      const title = document.createElement("span");
      title.textContent = tab.title || "Nova Aba";
      title.className = "tab-title";
      if (tab.discarded) title.style.opacity = "0.5"; // Destaca abas suspensas

      // Alterna para a aba ao clicar no título
      li.addEventListener("click", () => chrome.tabs.update(tab.id, { active: true }));

      // Botão de fechar a aba individualmente
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "✕";
      closeBtn.className = "btn btn-danger";
      closeBtn.style.padding = "2px 6px";
      closeBtn.title = "Fechar aba";
      
      closeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await chrome.tabs.remove(tab.id);
        renderTabs();
        
        // Atualiza estatísticas apenas se a aba de stats estiver visível
        if (document.getElementById("tab-stats").classList.contains("active")) {
          updateStats();
        }
      });

      li.appendChild(favicon);
      li.appendChild(title);
      li.appendChild(closeBtn);
      tabList.appendChild(li);
    });
  }

  // --- RENDERIZAÇÃO DE SESSÕES (SALVAR / ABRIR / DELETAR) ---
  async function renderSessions() {
    const data = await chrome.storage.local.get("savedSessions");
    const sessions = data.savedSessions || {};
    sessionList.innerHTML = "";

    Object.keys(sessions).forEach((name) => {
      const li = document.createElement("li");
      li.className = "list-item";
      li.style.justifyContent = "space-between";

      const title = document.createElement("span");
      title.textContent = `${name} (${sessions[name].length} abas)`;
      title.className = "tab-title";

      const btnGroup = document.createElement("div");
      btnGroup.style.display = "flex";
      btnGroup.style.gap = "4px";

      // Botão de Abrir Sessão
      const openBtn = document.createElement("button");
      openBtn.textContent = "Abrir";
      openBtn.className = "btn btn-primary";
      openBtn.addEventListener("click", () => {
        sessions[name].forEach((url) => chrome.tabs.create({ url }));
      });

      // Botão de Deletar Sessão
      const delBtn = document.createElement("button");
      delBtn.textContent = "✕";
      delBtn.className = "btn btn-danger";
      delBtn.title = "Excluir sessão";
      delBtn.addEventListener("click", async () => {
        if (confirm(`Tem certeza que deseja excluir a sessão "${name}"?`)) {
          delete sessions[name];
          await chrome.storage.local.set({ savedSessions: sessions });
          renderSessions();
        }
      });

      btnGroup.appendChild(openBtn);
      btnGroup.appendChild(delBtn);
      li.appendChild(title);
      li.appendChild(btnGroup);
      sessionList.appendChild(li);
    });
  }

  // 4. Listeners de Ações (Botões Globais)

  // --- LIMPAR DUPLICADAS ---
  document.getElementById("btn-duplicates")?.addEventListener("click", async () => {
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
    } else {
      alert("Nenhuma aba duplicada foi encontrada.");
    }
  });

  // --- AUTO-DISCARD / SUSPENDER INATIVAS ---
  document.getElementById("btn-discard")?.addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true, active: false });
    for (const tab of tabs) {
      if (!tab.discarded) {
        await chrome.tabs.discard(tab.id);
      }
    }
    renderTabs();
  });

  // --- FECHAR TODAS AS ABAS ---
  document.getElementById("btn-close-all")?.addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const tabIds = tabs.map((t) => t.id);
    
    if (tabIds.length === 0) return;

    const confirmado = confirm(`Tem certeza que deseja fechar ${tabIds.length} aba(s)? Essa ação não pode ser desfeita.`);
    if (!confirmado) return;

    await chrome.tabs.remove(tabIds);
  });

  // --- SALVAR NOVA SESSÃO --- (CORRIGIDO PARA "btn-salvar")
  document.getElementById("btn-salvar")?.addEventListener("click", async () => {
    const name = sessionNameInput.value.trim();
    if (!name) {
      alert("Por favor, digite um nome para salvar a sessão.");
      return;
    }

    const tabs = await chrome.tabs.query({ currentWindow: true });
    const urls = tabs.map((t) => t.url);

    const data = await chrome.storage.local.get("savedSessions");
    const sessions = data.savedSessions || {};
    sessions[name] = urls;

    await chrome.storage.local.set({ savedSessions: sessions });
    sessionNameInput.value = ""; // Limpa o input
    renderSessions();
  });

  // --- EXPORTAR SESSÕES (JSON) ---
  document.getElementById("btn-export-sessions")?.addEventListener("click", async () => {
    const data = await chrome.storage.local.get("savedSessions");
    const jsonStr = JSON.stringify(data.savedSessions || {}, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sessoes-abas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // --- IMPORTAR SESSÕES (JSON) ---
  document.getElementById("btn-import-trigger")?.addEventListener("click", () => {
    fileImportInput?.click();
  });

  fileImportInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedSessions = JSON.parse(event.target.result);
        const data = await chrome.storage.local.get("savedSessions");
        const currentSessions = data.savedSessions || {};

        const merged = { ...currentSessions, ...importedSessions };
        await chrome.storage.local.set({ savedSessions: merged });
        renderSessions();
        alert("Sessões importadas com sucesso!");
      } catch (err) {
        alert("Erro ao importar. Verifique se o arquivo JSON é válido.");
      }
    };
    reader.readAsText(file);
  });

  // 5. Inicialização (Ao abrir o popup)
  renderTabs();
  renderSessions();
});