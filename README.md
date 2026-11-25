# Fealsi Programação --- Central de Resumos

**Aprenda hoje. Programe amanhã.**

Uma biblioteca digital responsiva para organizar links e resumos de
conteúdos sobre programação. Registre materiais encontrados em
plataformas como YouTube, TikTok, Facebook, Instagram e sites, mantendo
seus principais aprendizados reunidos em um só lugar.

## ✨ Funcionalidades

-   Cadastro de conteúdos com título, URL, categoria e resumo.
-   Organização por categorias: HTML, CSS, JavaScript, Inteligência
    Artificial, Programação, Projetos e Jogos, Ferramentas, Tutoriais e
    Dicas e Outros.
-   Pesquisa por título, link, categoria ou texto do resumo.
-   Filtro por categoria.
-   Edição, exclusão e cópia de resumos.
-   Exportação dos registros para PDF e Excel.
-   Impressão da biblioteca.
-   Alternância entre tema claro e escuro.
-   Armazenamento local dos registros no navegador com `localStorage`.
-   Layout responsivo para computadores, tablets e celulares.

## 🛠️ Tecnologias utilizadas

-   HTML5
-   CSS3
-   JavaScript
-   LocalStorage
-   [jsPDF](https://github.com/parallax/jsPDF) --- geração de arquivos
    PDF.
-   [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) --- exportação
    para Excel.

## 📁 Estrutura do projeto

``` text
Fealsi-Programacao/
├── index.html
├── style.css
├── script.js
└── assets/
    └── icone-fealsi.png
```

## 🚀 Como executar

1.  Baixe ou clone este repositório.
2.  Mantenha `index.html`, `style.css`, `script.js` e a pasta `assets`
    na estrutura indicada.
3.  Abra o arquivo `index.html` em um navegador atualizado.
4.  Preencha o formulário com o título, link, categoria e resumo do
    conteúdo.
5.  Clique em **Adicionar link** para guardar o registro.

Não é necessário instalar dependências para utilizar as funções básicas
do site.

## 📤 Exportação e impressão

Os botões de PDF e Excel utilizam bibliotecas carregadas por CDN. Para
essas exportações, é necessário estar conectado à internet e permitir o
carregamento dos scripts externos.

O botão **Imprimir** utiliza a função de impressão do navegador. É
possível escolher uma impressora ou salvar a página como PDF pela janela
de impressão.

## 💾 Armazenamento dos dados

Os conteúdos são guardados no `localStorage` do navegador utilizado.

**Importante:** - Os registros ficam no navegador e dispositivo em que
foram cadastrados. - Os dados não são sincronizados automaticamente
entre celular e computador. - Limpar os dados do navegador pode apagar
os registros. - Faça exportações periódicas em PDF ou Excel para manter
uma cópia de segurança.

## 🎨 Identidade visual

O projeto utiliza como referência a identidade visual da **Fealsi
Programação**, com tons de azul, ciano e verde, além de opção de tema
claro e escuro.

**Slogan:** Aprenda hoje. Programe amanhã.

## 📌 Melhorias futuras

-   Backup e restauração dos registros.
-   Sincronização entre dispositivos.
-   Instalação como aplicativo PWA.
-   Miniaturas e imagens dos conteúdos salvos.
-   Mais opções de organização e filtros.

## 👨‍💻 Autor

**Fealsi Programação**

Projeto desenvolvido para facilitar a organização de estudos,
referências e aprendizados na área de programação.
