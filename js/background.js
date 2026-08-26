// Roda uma vez quando a extensão é instalada/atualizada.
// Precisa ficar no nível principal do arquivo (não dentro de outro
// listener), senão o Chrome pode não capturar o evento corretamente
// e o listener acaba sendo re-registrado a cada clique.
chrome.runtime.onInstalled.addListener(() => {
  console.log("Gerenciador de Abas instalado com sucesso.");
});

chrome.action.onClicked.addListener(async () => {
  try {
    // Pega todas as abas da janela atual
    const tabs = await chrome.tabs.query({ currentWindow: true });

    // Ignora a própria página da extensão (se já estiver aberta) e abas internas do Chrome
    const extensionUrl = chrome.runtime.getURL("list.html");
    const tabsToSave = tabs.filter(
      (t) => t.url !== extensionUrl && !t.url.startsWith("chrome://")
    );

    if (tabsToSave.length === 0) return;

    // Extrai apenas o título e a URL de cada aba
    const tabsData = tabsToSave.map((t) => ({ title: t.title, url: t.url }));

    // Salva no armazenamento local do navegador
    const { savedTabGroups = [] } = await chrome.storage.local.get("savedTabGroups");
    savedTabGroups.unshift({
      // Formato universal (ISO). Formate para pt-BR na hora de exibir em list.js,
      // ex: new Date(group.date).toLocaleString('pt-BR')
      date: new Date().toISOString(),
      tabs: tabsData,
    });
    await chrome.storage.local.set({ savedTabGroups });

    // Fecha as abas que foram salvas
    const tabIdsToClose = tabsToSave.map((t) => t.id);
    await chrome.tabs.remove(tabIdsToClose);

    // Abre a página com a lista de abas, ou foca/recarrega se já estiver aberta
    const [listTab] = await chrome.tabs.query({ url: extensionUrl });
    if (listTab) {
      await chrome.tabs.update(listTab.id, { active: true });
      await chrome.tabs.reload(listTab.id);
    } else {
      await chrome.tabs.create({ url: "list.html" });
    }
  } catch (err) {
    console.error("Gerenciador de Abas: falha ao salvar/fechar abas.", err);
  }
});