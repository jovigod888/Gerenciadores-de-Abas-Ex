readme_content = """# Gerenciador de Abas Simples

Uma extensão leve e eficiente para navegadores baseados em Chromium (Google Chrome, Microsoft Edge, Brave, etc.) que permite salvar todas as suas abas abertas em uma única lista. Inspirada no OneTab, esta ferramenta ajuda a organizar sua área de trabalho e economizar memória RAM do seu computador.

## 🚀 Funcionalidades

- **Salvar Abas em um Clique:** Clicou no ícone da extensão, todas as abas da janela atual são fechadas e salvas instantaneamente.
- **Economia de Memória:** Fecha abas ociosas ou em excesso, liberando processamento e RAM.
- **Restauração Fácil:** Restaure um grupo inteiro de abas com apenas um clique no botão "Restaurar Tudo".
- **Gerenciamento de Histórico:** Visualize a data e a hora exatas em que cada grupo de abas foi salvo. Opção para apagar todo o histórico.
- **Privacidade Local:** Todas as abas são salvas apenas no armazenamento local (`chrome.storage.local`) do próprio navegador. Nenhum dado é enviado para a nuvem.

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Para estruturação e estilização da interface da lista de abas.
- **JavaScript (Vanilla):** Lógica da aplicação sem frameworks externos.
- **Chrome Extension API (Manifest V3):** Padrão moderno, seguro e performático para desenvolvimento de extensões.

## ⚙️ Como Instalar e Testar

Como esta extensão está em formato de código-fonte, você precisa instalá-la ativando o "Modo do Desenvolvedor" do navegador.

1. Faça o download ou clone a pasta contendo estes arquivos em seu computador (ex: no Pop!_OS, coloque na pasta `Documentos`).
2. Abra o seu navegador e acesse a página de extensões:
   - No Chrome ou Brave: digite `chrome://extensions/` na barra de endereços.
   - No Edge: digite `edge://extensions/`.
3. No canto superior direito da tela, ative a chave **"Modo do desenvolvedor"** (Developer mode).
4. Clique no botão **"Carregar sem compactação"** (Load unpacked) que aparecerá no canto superior esquerdo.
5. Selecione a pasta raiz da extensão (a pasta que contém o arquivo `manifest.json`).
6. Pronto! O ícone da extensão vai aparecer na sua barra de ferramentas (se estiver oculto, clique no ícone de "peça de quebra-cabeça" das extensões e fixe-a).

## 💡 Como Usar

1. Acumule algumas abas abertas que você deseja guardar para depois.
2. Clique no ícone da extensão.
3. A mágica acontece: suas abas serão fechadas e uma nova página "Minhas Abas Salvas" se abrirá com todos os links agrupados com a data atual.
4. Quando quiser voltar a trabalhar nelas, clique no botão **Restaurar Tudo** ao lado da data correspondente.

## 📝 Arquivos do Projeto

- `manifest.json`: "Documento de identidade" da extensão. Define versão, nome e permissões.
- `background.js`: Service Worker que roda em segundo plano. Intercepta o clique no ícone, lê as abas abertas e salva no `storage`.
- `list.html`: A estrutura visual da página onde o usuário visualiza e gerencia os links salvos.
- `list.js`: Script que interage com a página `list.html`, buscando os dados guardados e criando os elementos na tela.

---

