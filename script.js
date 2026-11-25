const CACHE_NAME = "fealsi-central-resumos-v2";

const form = document.getElementById("formLink");
const lista = document.getElementById("listaLinks");
const campoPesquisa = document.getElementById("pesquisa");
const filtroCategoria = document.getElementById("filtroCategoria");
const mensagem = document.getElementById("mensagem");

let links = carregarLinks();
let temporizadorMensagem;

// CARREGAR DADOS

function carregarLinks() {

  try {

    const dados = JSON.parse(
      localStorage.getItem(CHAVE) || "[]"
    );

    return Array.isArray(dados) ? dados : [];

  } catch (erro) {

    console.error("Erro ao carregar dados:", erro);

    return [];

  }

}

// SALVAR DADOS

function salvarLinks() {

  try {

    localStorage.setItem(
      CHAVE,
      JSON.stringify(links)
    );

    return true;

  } catch (erro) {

    mostrarMensagem(
      "Não foi possível salvar. O armazenamento pode estar cheio.",
      true
    );

    return false;

  }

}

// MENSAGENS

function mostrarMensagem(texto, erro = false) {

  mensagem.textContent = texto;

  mensagem.style.background = erro
    ? "#b4233c"
    : "#078b55";

  mensagem.classList.add("visivel");

  clearTimeout(temporizadorMensagem);

  temporizadorMensagem = setTimeout(() => {

    mensagem.classList.remove("visivel");

  }, 2800);

}

// PROTEÇÃO DE TEXTO

function escapar(texto) {

  return String(texto).replace(/[&<>"']/g, caractere => ({

    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"

  })[caractere]);

}

// VALIDAR LINK

function urlSegura(valor) {

  try {

    const url = new URL(valor);

    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : "";

  } catch {

    return "";

  }

}

// FORMATAR DATA

function dataFormatada(data) {

  return new Date(data).toLocaleDateString("pt-BR");

}

// MOSTRAR CONTEÚDOS

function renderizar() {

  const termo = campoPesquisa.value
    .trim()
    .toLocaleLowerCase("pt-BR");

  const categoria = filtroCategoria.value;

  const filtrados = links.filter(item => {

    const correspondeTexto = [

      item.titulo,
      item.categoria,
      item.resumo,
      item.url

    ].join(" ").toLocaleLowerCase("pt-BR").includes(termo);

    return correspondeTexto &&
      (!categoria || item.categoria === categoria);

  });

  document.getElementById("totalLinks").textContent =
    links.length;

  document.getElementById("totalVisivel").textContent =
    `Exibindo ${filtrados.length}`;

  if (!filtrados.length) {

    lista.innerHTML = `
      <div class="vazio">

        <strong>
          ${links.length
            ? "Nenhum resultado encontrado"
            : "Sua biblioteca está vazia"}
        </strong>

        ${links.length
          ? "Tente mudar a pesquisa ou o filtro."
          : "Adicione seu primeiro conteúdo usando o formulário acima."}

      </div>
    `;

    return;

  }

  lista.innerHTML = filtrados.map(item => {

    const href = urlSegura(item.url);

    return `

      <article class="cartao-link">

        <div class="cartao-topo">

          <div>

            <h3>${escapar(item.titulo)}</h3>

            <span class="categoria-tag">
              ${escapar(item.categoria)}
            </span>

          </div>

          <span class="data">
            ${dataFormatada(item.criadoEm)}
          </span>

        </div>

        <p class="resumo-texto">
          ${escapar(item.resumo)}
        </p>

        ${href ? `

          <a
            class="link-original"
            href="${escapar(href)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ↗ Abrir conteúdo original
          </a>

        ` : ""}

        <div class="acoes-cartao">

          <button
            type="button"
            data-acao="editar"
            data-id="${escapar(item.id)}"
          >
            ✎ Editar
          </button>

          <button
            type="button"
            data-acao="copiar"
            data-id="${escapar(item.id)}"
          >
            Copiar resumo
          </button>

          <button
            type="button"
            class="excluir"
            data-acao="excluir"
            data-id="${escapar(item.id)}"
          >
            Excluir
          </button>

        </div>

      </article>

    `;

  }).join("");

}

// ADICIONAR CONTEÚDO

form.addEventListener("submit", evento => {

  evento.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();

  const urlDigitada = document.getElementById("url").value.trim();

  const categoria = document.getElementById("categoria").value;

  const resumo = document.getElementById("resumo").value.trim();

  const url = urlSegura(urlDigitada);

  if (!titulo || !url || !categoria || !resumo) {

    mostrarMensagem(
      "Preencha todos os campos com um link válido.",
      true
    );

    return;

  }

  links.unshift({

    id: (
      crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random())
    ),

    titulo,
    url,
    categoria,
    resumo,

    criadoEm: new Date().toISOString()

  });

  if (salvarLinks()) {

    form.reset();

    campoPesquisa.value = "";

    filtroCategoria.value = "";

    renderizar();

    mostrarMensagem(
      "Conteúdo adicionado e salvo com sucesso!"
    );

  }

});

// EDITAR, EXCLUIR E COPIAR

lista.addEventListener("click", async evento => {

  const botao = evento.target.closest("button[data-acao]");

  if (!botao) return;

  const item = links.find(
    link => link.id === botao.dataset.id
  );

  if (!item) return;

  // EXCLUIR

  if (botao.dataset.acao === "excluir") {

    if (!confirm(`Deseja excluir "${item.titulo}"?`)) {
      return;
    }

    links = links.filter(
      link => link.id !== item.id
    );

    salvarLinks();

    renderizar();

    mostrarMensagem("Conteúdo excluído.");

  }

  // EDITAR

  else if (botao.dataset.acao === "editar") {

    document.getElementById("titulo").value =
      item.titulo;

    document.getElementById("url").value =
      item.url;

    document.getElementById("categoria").value =
      item.categoria;

    document.getElementById("resumo").value =
      item.resumo;

    links = links.filter(
      link => link.id !== item.id
    );

    salvarLinks();

    renderizar();

    document.getElementById("tituloFormulario")
      .scrollIntoView({ behavior: "smooth" });

    document.getElementById("titulo").focus();

    mostrarMensagem(
      "Conteúdo carregado no formulário. Faça as alterações e adicione novamente."
    );

  }

  // COPIAR RESUMO

  else if (botao.dataset.acao === "copiar") {

    try {

      await navigator.clipboard.writeText(

        `${item.titulo}
${item.categoria}
${item.url}

${item.resumo}`

      );

      mostrarMensagem(
        "Título, link e resumo copiados!"
      );

    } catch {

      mostrarMensagem(
        "Não foi possível copiar neste navegador.",
        true
      );

    }

  }

});

// PESQUISA E FILTRO

campoPesquisa.addEventListener("input", renderizar);

filtroCategoria.addEventListener("change", renderizar);

// ALTERNAR TEMA

document.getElementById("alternarTema")
  .addEventListener("click", () => {

    document.body.classList.toggle("claro");

    const claro = document.body.classList.contains("claro");

    document.getElementById("alternarTema").textContent =
      claro ? "🌙 Tema escuro" : "☀️ Tema claro";

    try {

      localStorage.setItem(
        "fealsi_tema",
        claro ? "claro" : "escuro"
      );

    } catch {}

  });

// RECUPERAR TEMA SALVO

try {

  if (localStorage.getItem("fealsi_tema") === "claro") {

    document.body.classList.add("claro");

    document.getElementById("alternarTema").textContent =
      "🌙 Tema escuro";

  }

} catch {}

// LIMPAR TUDO

document.getElementById("limparTudo")
  .addEventListener("click", () => {

    if (!links.length) {

      mostrarMensagem("Não há conteúdos para limpar.");

      return;

    }

    if (!confirm(
      "ATENÇÃO: deseja apagar TODOS os links e resumos salvos neste navegador? Esta ação não pode ser desfeita."
    )) {

      return;

    }

    links = [];

    salvarLinks();

    renderizar();

    mostrarMensagem("Todos os registros foram apagados.");

  });

// IMPRIMIR

document.getElementById("imprimir")
  .addEventListener("click", () => {

    if (!links.length) {

      mostrarMensagem(
        "Adicione conteúdos antes de imprimir.",
        true
      );

      return;

    }

    window.print();

  });

// EXPORTAR EXCEL

document.getElementById("exportarExcel")
  .addEventListener("click", () => {

    if (!links.length) {

      mostrarMensagem(
        "Não há conteúdos para exportar.",
        true
      );

      return;

    }

    if (typeof XLSX === "undefined") {

      mostrarMensagem(
        "Biblioteca Excel indisponível. Verifique sua conexão.",
        true
      );

      return;

    }

    const dados = links.map(item => ({

      "Título": item.titulo,

      "URL / Link": item.url,

      "Categoria": item.categoria,

      "Resumo": item.resumo,

      "Data de cadastro": dataFormatada(item.criadoEm)

    }));

    const planilha = XLSX.utils.json_to_sheet(dados);

    planilha["!cols"] = [

      { wch: 35 },
      { wch: 48 },
      { wch: 24 },
      { wch: 80 },
      { wch: 18 }

    ];

    const livro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      livro,
      planilha,
      "Meus resumos"
    );

    XLSX.writeFile(
      livro,
      "Fealsi_Programacao_Resumos.xlsx"
    );

    mostrarMensagem("Planilha Excel exportada!");

  });

// EXPORTAR PDF

document.getElementById("exportarPdf")
  .addEventListener("click", () => {

    if (!links.length) {

      mostrarMensagem(
        "Não há conteúdos para exportar.",
        true
      );

      return;

    }

    if (!window.jspdf || !window.jspdf.jsPDF) {

      mostrarMensagem(
        "Biblioteca PDF indisponível. Verifique sua conexão.",
        true
      );

      return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
      unit: "mm",
      format: "a4"
    });

    const margem = 15;
    const largura = 180;

    let y = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 105, 190);

    doc.text("Fealsi Programação", margem, y);

    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(60, 70, 85);

    doc.text(
      "Aprenda hoje. Programe amanhã. | Minha biblioteca de resumos",
      margem,
      y
    );

    y += 10;

    links.forEach((item, indice) => {

      const tituloLinhas = doc.splitTextToSize(
        `${indice + 1}. ${item.titulo}`,
        largura
      );

      const resumoLinhas = doc.splitTextToSize(
        `Resumo: ${item.resumo}`,
        largura
      );

      const linkLinhas = doc.splitTextToSize(
        `Link: ${item.url}`,
        largura
      );

      const altura =
        8 +
        tituloLinhas.length * 6 +
        resumoLinhas.length * 5 +
        linkLinhas.length * 4 +
        8;

      if (y + altura > 280) {

        doc.addPage();

        y = 18;

      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 105, 190);

      doc.text(tituloLinhas, margem, y);

      y += tituloLinhas.length * 6 + 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(65, 75, 90);

      doc.text(
        `Categoria: ${item.categoria} | Data: ${dataFormatada(item.criadoEm)}`,
        margem,
        y
      );

      y += 6;

      doc.text(resumoLinhas, margem, y);

      y += resumoLinhas.length * 5 + 2;

      doc.setTextColor(0, 110, 160);

      doc.text(linkLinhas, margem, y);

      y += linkLinhas.length * 4 + 7;

      doc.setDrawColor(210, 220, 230);

      doc.line(
        margem,
        y - 3,
        margem + largura,
        y - 3
      );

    });

    doc.save("Fealsi_Programacao_Resumos.pdf");

    mostrarMensagem("Arquivo PDF exportado!");

  });

// INICIAR SITE

renderizar();
