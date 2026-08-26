


export async function updateStats() {
  // Pega TODAS as abas abertas em TODAS as janelas
  const tabs = await chrome.tabs.query({});
  
  // Atualiza o contador total de abas
  document.getElementById("stat-total-tabs").textContent = tabs.length;

  const domainCounts = {};

  // Conta quantas vezes cada domínio aparece
  tabs.forEach((tab) => {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      
      // Ignora páginas internas do navegador (ex: chrome://extensions)
      if (domain) {
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      }
    } catch (e) {
      // Ignora URLs inválidas
    }
  });

  // Ordena os domínios do maior para o menor e pega os 5 primeiros
  const sortedDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); 

  // Renderiza a lista no HTML
  const domainsList = document.getElementById("stat-domains-list");
  domainsList.innerHTML = "";
  
  sortedDomains.forEach(([domain, count]) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.padding = "4px 0";
    li.style.borderBottom = "1px solid #eee";
    li.innerHTML = `<span>${domain}</span> <strong>${count} aba(s)</strong>`;
    domainsList.appendChild(li);
  });
}