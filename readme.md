# 🚀 Gerenciador de Abas (Chrome Extension)

Uma extensão moderna e leve para o Google Chrome desenvolvida em **Manifest V3**. O objetivo principal é otimizar a navegação, economizar memória RAM e organizar abas abertas em sessões de trabalho.

---

## 📌 Funcionalidades Principais

* **📂 Gerenciamento de Sessões:**
  * Salve o conjunto atual de abas abertas em uma sessão nomeada.
  * Reabra todas as abas de uma sessão salva com apenas um clique.
  * **Exportação e Importação:** Exporte suas sessões salvas em arquivo `.json` para backup ou transfira para outro navegador.

* **🧹 Limpeza de Duplicadas:**
  * Botão de 1 clique que identifica e fecha automaticamente abas repetidas apontando para a mesma URL.

* **⚡ Auto-Discard / Suspensão de Abas:**
  * Utiliza a API `chrome.tabs.discard` para suspender abas inativas no plano de fundo, reduzindo drasticamente o consumo de memória RAM e CPU sem fechar as abas.

* **📊 Painel de Estatísticas com Gráfico Interativo:**
  * Exibe o total geral de abas abertas no navegador.
  * Gráfico de barras responsivo com o **Top 5 domínios mais acessados** em tempo real.

---

## 📁 Estrutura do Projeto

```text
Gerenciadores-de-Abas-Ex/
├── css/
│   └── style.css            # Estilos do popup e gráfico
├── icons/
│   ├── icon16.png           # Ícone do sistema (16x16)
│   ├── icon48.png           # Ícone do menu de extensões (48x48)
│   └── icon128.png          # Ícone da loja/gerenciador (128x128)
├── js/
│   ├── modules/
│   │   └── stats.js         # Módulo de cálculo e renderização das estatísticas
│   ├── background.js        # Service Worker em segundo plano
│   └── popup.js             # Lógica principal da interface
├── manifest.json            # Arquivo de configuração da extensão (Manifest V3)
├── popup.html               # Interface gráfica principal do popup
└── README.md                # Documentação do projeto

```

---

## ⚙️ Como Instalar e Testar Localmente

1. **Clone ou baixe este repositório:**
```bash
git clone [https://github.com/seu-usuario/Gerenciadores-de-Abas-Ex.git](https://github.com/seu-usuario/Gerenciadores-de-Abas-Ex.git)

```


2. **Abra a página de extensões no navegador:**
* Acesse `chrome://extensions/` no Chrome, Edge ou Brave.


3. **Ative o Modo do Desenvolvedor:**
* Alterne a chave **"Modo do desenvolvedor"** no canto superior direito.


4. **Carregue a Extensão:**
* Clique em **"Carregar sem compactação"** (Load unpacked).
* Selecione a pasta raiz do projeto (`Gerenciadores-de-Abas-Ex`).


5. **Pronto!** Fixe o ícone na barra de ferramentas do seu navegador e clique para usar.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3** (Flexbox, Grid e animações para o gráfico)
* **JavaScript ES6+** (Modules, Async/Await)
* **Chrome Extension API - Manifest V3** (`chrome.tabs`, `chrome.storage.local`)



---

## 👨‍💻 Autor

Desenvolvido por **[joao vitor]**.

* **GitHub:** [@jovigod888](https://github.com/jovigod888/Gerenciadores-de-Abas-Ex)
* **LinkedIn:** [joao vitor](https://www.linkedin.com/in/jo%C3%A3o-vitor-rodrigues-silva-moreira-40a677309/)

---

## 📝 Licença

Este projeto é de código aberto e está sob a licença **MIT**. Fique à vontade para usar, estudar e modificar!