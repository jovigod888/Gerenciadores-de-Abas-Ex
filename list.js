document.addEventListener('DOMContentLoaded', loadTabs);

// Funcionalidade do botão para apagar tudo
document.getElementById('clearAll').addEventListener('click', () => {
    if(confirm("Tem certeza que deseja apagar todas as abas salvas?")) {
        chrome.storage.local.set({ savedTabGroups: [] }, loadTabs);
    }
});


// Função que carrega as abas do storage e exibe na tela
function loadTabs() {
    chrome.storage.local.get(["savedTabGroups"], (result) => {
        const container = document.getElementById('container');
        container.innerHTML = ''; // Limpa a tela antes de desenhar
        const groups = result.savedTabGroups || [];

        if (groups.length === 0) {
            container.innerHTML = '<p>Nenhuma aba salva no momento.</p>';
            return;
        }

        groups.forEach((group, groupIndex) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group';

            const header = document.createElement('div');
            header.className = 'group-header';
            header.innerHTML = `<h2>Salvo em: ${group.date} (${group.tabs.length} abas)</h2>`;
            
            const restoreBtn = document.createElement('button');
            restoreBtn.textContent = 'Restaurar Tudo';
            restoreBtn.onclick = () => restoreGroup(group.tabs, groupIndex);
            
            header.appendChild(restoreBtn);
            groupDiv.appendChild(header);

            group.tabs.forEach(tab => {
                const a = document.createElement('a');
                a.href = tab.url;
                a.textContent = tab.title || tab.url;
                a.className = 'tab-link';
                a.target = '_blank';
                groupDiv.appendChild(a);
            });

            container.appendChild(groupDiv);
        });
    });
}



// Função para abrir as abas novamente e remover o grupo da lista
function restoreGroup(tabs, index) {
    tabs.forEach(tab => chrome.tabs.create({ url: tab.url, active: false }));
    

    // Remove o grupo da lista após restaurar
    chrome.storage.local.get(["savedTabGroups"], (result) => {
        let groups = result.savedTabGroups || [];
        groups.splice(index, 1);
        chrome.storage.local.set({ savedTabGroups: groups }, loadTabs);
    });


}