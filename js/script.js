document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  /**
   * Ativa a aba fornecida e atualiza ARIA, Hash da URL e localStorage
   * @param {HTMLElement} targetTab - O botão da aba a ser ativado
   * @param {boolean} updateHash - Define se atualiza a URL (#)
   */
  function activateTab(targetTab, updateHash = true) {
    if (!targetTab) return;

    const targetPanelId = targetTab.getAttribute('aria-controls');

    // 1. Atualiza os estados das Abas (ARIA e tabindex)
    tabs.forEach(tab => {
      const isSelected = tab === targetTab;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      tab.classList.toggle('active', isSelected);
    });

    // 2. Atualiza a exibição dos Painéis de Conteúdo
    panels.forEach(panel => {
      const isTarget = panel.id === targetPanelId;
      panel.hidden = !isTarget;
      panel.classList.toggle('active', isTarget);
    });

    // 3. Persistência no localStorage
    localStorage.setItem('activeTabId', targetTab.id);

    // 4. Suporte a URL / Hash (#)
    if (updateHash) {
      history.replaceState(null, '', `#${targetPanelId}`);
    }
  }

  /**
   * Gerencia navegação via teclado (setas, Home e End)
   */
  function handleKeyDown(event) {
    const currentTab = event.currentTarget;
    const currentIndex = tabs.indexOf(currentTab);
    let newIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        // Volta para a aba anterior ou vai para a última se estiver no começo
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        // Avança para a próxima aba ou volta para a primeira se estiver no fim
        newIndex = (currentIndex + 1) % tabs.length;
        break;

      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;

      default:
        return;
    }

    tabs[newIndex].focus();
    activateTab(tabs[newIndex]);
  }

  /**
   * Determina qual aba deve abrir inicialmente baseando-se em:
   * 1º: Hash da URL (#panel-2)
   * 2º: localStorage (aba salva anteriormente)
   * 3º: Primeira aba padrão
   */
  function getInitialTab() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const tabFromHash = tabs.find(tab => tab.getAttribute('aria-controls') === hash);
      if (tabFromHash) return tabFromHash;
    }

    const savedTabId = localStorage.getItem('activeTabId');
    if (savedTabId) {
      const tabFromStorage = document.getElementById(savedTabId);
      if (tabFromStorage) return tabFromStorage;
    }

    return tabs[0];
  }

  // --- Event Listeners ---

  tabs.forEach(tab => {
    // Clique do mouse
    tab.addEventListener('click', () => activateTab(tab));

    // Navegação via Teclado
    tab.addEventListener('keydown', handleKeyDown);
  });

  // Atualiza a aba se o usuário mudar o Hash na URL manualmente / navegação do browser
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    const tabFromHash = tabs.find(tab => tab.getAttribute('aria-controls') === hash);
    if (tabFromHash) {
      activateTab(tabFromHash, false);
    }
  });

  // --- Inicialização ---
  const initialTab = getInitialTab();
  activateTab(initialTab, false);
});