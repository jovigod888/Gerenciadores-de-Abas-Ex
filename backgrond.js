chrome.action.onClicked.addListener(async () => {
  // Pega todas as abas da janela atual
  let tabs = await chrome.tabs.query({ currentWindow: true });
  
  // Ignora a própria página da extensão se já estiver aberta e abas internas do Chrome
  let extensionUrl = chrome.runtime.getURL("list.html");
  let tabsToSave = tabs.filter(t => t.url !== extensionUrl && !t.url.startsWith("chrome://"));
  
  if (tabsToSave.length === 0) return;

  // Extrai apenas o título e a URL de cada aba
  let tabsData = tabsToSave.map(t => ({ title: t.title, url: t.url }));
  
  // Salva no armazenamento local do navegador
  chrome.storage.local.get(["savedTabGroups"], (result) => {
    let groups = result.savedTabGroups || [];
    
    // Adiciona o novo grupo de abas no topo da lista
    groups.unshift({
      date: new Date().toLocaleString('pt-BR'),
      tabs: tabsData
    });
    
    chrome.storage.local.set({ savedTabGroups: groups }, async () => {
      // Fecha as abas que foram salvas
      let tabIdsToClose = tabsToSave.map(t => t.id);
      await chrome.tabs.remove(tabIdsToClose);
      
      // Abre a página com a lista de abas (ou recarrega se já estiver aberta)
      let listTabs = await chrome.tabs.query({ url: extensionUrl });
      if (listTabs.length > 0) {
        chrome.tabs.update(listTabs[0].id, { active: true });
        chrome.tabs.reload(listTabs[0].id);
      } else {
        chrome.tabs.create({ url: "list.html" });
      }
    });
  });

  // Exemplo de ouvinte de instalação/atualização
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Gerenciador de Abas instalado com sucesso.");
  });

  // Exemplo de listener de eventos das abas
  chrome.tabs.onCreated.addListener((tab) => {
    // Processamento quando uma nova aba é criada
  });
  
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    console.log(tabs);
  });
  async function getTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  console.log(tabs);

  chrome.tabs.executeScript(tabId, { file: 'content.js' });
  await chrome.scripting.executeScript({
  target: { tabId: tabId },
  files: ['content.js']
});

}

});

