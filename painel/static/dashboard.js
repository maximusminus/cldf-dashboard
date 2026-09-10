/*
 * OS-099 — o painel que é um painel: uma fatia move todos os quadros ao mesmo tempo.
 *
 * Hand-written, dependency-free JavaScript: no library, no CDN, no external host, no
 * framework. It reads ONE file — `../cubos/<slug>.json`, the canvas's own pre-computed
 * cube — and never issues another request for as long as the page is open. Every slicer
 * click, every bar click, every reset re-filters and re-sums IN MEMORY and repaints every
 * tile at once. That is the whole difference between this page and the explorer, which
 * re-reads a table and re-renders one result.
 *
 * Signal 35d, JS side: a cube carries exactly one table (`cubo.tabela`), so this file
 * cannot join two even in principle — there is no second dataset in scope. The only link
 * out is the declared drill-through target, which is this canvas's own question page.
 *
 * Signal 35c, JS side: this file contains NO percent sign at all, and that is a
 * mechanical property a test asserts over its bytes rather than a habit. A quotient is
 * never rendered: every figure appears as its own numerator beside its own denominator,
 * in one element, exactly as `render_rate_html` does at build time.
 *
 * Signal 35f, JS side: the one request is a relative path under this project's own tree.
 * The only absolute address anywhere below is the SVG namespace, which no browser fetches.
 */

(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";
  var CORES = ["#1a3a52", "#3d7ea6", "#a3612f", "#5b7f4e", "#7a4e7f", "#a33a3a"];
  var SLUG_VALIDO = /^[a-z0-9][a-z0-9-]*$/;

  var raiz = document.getElementById("canvas-raiz");
  if (!raiz) {
    return;
  }

  var cubo = null;
  // One Set per dimension. An empty Set means "no filter on this dimension" — never
  // "nothing selected", which is the ambiguity that makes a slicer lie.
  var selecao = [];

  // ----------------------------------------------------------------------------------
  // Small DOM helpers. Nothing here writes markup: every node is created and every piece
  // of text goes in through textContent, so a value spelled by the source can never
  // become an element (CODING 1, the same posture reportar.js holds).
  // ----------------------------------------------------------------------------------

  function el(tag, classe, texto) {
    var node = document.createElement(tag);
    if (classe) {
      node.className = classe;
    }
    if (texto !== undefined && texto !== null) {
      node.textContent = texto;
    }
    return node;
  }

  function svgEl(tag, attrs) {
    var node = document.createElementNS(SVGNS, tag);
    for (var chave in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, chave)) {
        node.setAttribute(chave, String(attrs[chave]));
      }
    }
    return node;
  }

  function limpar(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function fmtNumero(valor) {
    return Number(valor).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  }

  function fmtDinheiro(valor) {
    return (
      "R$ " +
      Number(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  function encurtar(texto, limite) {
    var t = String(texto === "" ? "(vazio)" : texto);
    if (t.length <= limite) {
      return t;
    }
    return t.slice(0, limite - 1) + "…";
  }

  // ----------------------------------------------------------------------------------
  // The cube, read. `linhas` is [[indices], contagem, [somas]] and nothing else, so every
  // function below is arithmetic over integers and sums the compiler already computed.
  // ----------------------------------------------------------------------------------

  function indiceDaMedida(coluna) {
    for (var i = 0; i < cubo.medidas.length; i += 1) {
      if (cubo.medidas[i].coluna === coluna) {
        return i;
      }
    }
    return -1;
  }

  function medidaPorColuna(coluna) {
    var i = indiceDaMedida(coluna);
    return i < 0 ? null : cubo.medidas[i];
  }

  function linhaPassa(linha, exceto) {
    for (var i = 0; i < selecao.length; i += 1) {
      if (i === exceto) {
        continue;
      }
      if (selecao[i].size > 0 && !selecao[i].has(linha[0][i])) {
        return false;
      }
    }
    return true;
  }

  function linhasFiltradas(exceto) {
    var saida = [];
    for (var i = 0; i < cubo.linhas.length; i += 1) {
      if (linhaPassa(cubo.linhas[i], exceto)) {
        saida.push(cubo.linhas[i]);
      }
    }
    return saida;
  }

  /* The value of one tile's measure over a set of cube rows: the row count when the tile
     declares no measure, and that measure's own sum when it does. Nothing else is
     computable here, which is the point — a cube carries counts and sums, never a
     quotient (35j). */
  function valorDe(linhas, coluna) {
    var total = 0;
    var j = coluna === null || coluna === undefined ? -1 : indiceDaMedida(coluna);
    for (var i = 0; i < linhas.length; i += 1) {
      total += j < 0 ? linhas[i][1] : linhas[i][2][j];
    }
    return total;
  }

  function agruparPor(linhas, dim, coluna) {
    var mapa = new Map();
    var j = coluna === null || coluna === undefined ? -1 : indiceDaMedida(coluna);
    for (var i = 0; i < linhas.length; i += 1) {
      var chave = linhas[i][0][dim];
      var atual = mapa.get(chave);
      if (atual === undefined) {
        atual = { valor: 0, n: 0 };
        mapa.set(chave, atual);
      }
      atual.valor += j < 0 ? linhas[i][1] : linhas[i][2][j];
      atual.n += linhas[i][1];
    }
    return mapa;
  }

  function indiceDaDimensao(coluna) {
    for (var i = 0; i < cubo.dimensoes.length; i += 1) {
      if (cubo.dimensoes[i].coluna === coluna) {
        return i;
      }
    }
    return -1;
  }

  function formatarValor(coluna, valor) {
    var m = coluna ? medidaPorColuna(coluna) : null;
    if (m && m.tipo === "dinheiro") {
      return fmtDinheiro(valor);
    }
    return fmtNumero(valor);
  }

  // ----------------------------------------------------------------------------------
  // The one interaction: a value of a dimension is toggled, and everything repaints.
  // ----------------------------------------------------------------------------------

  function alternar(dim, indice) {
    if (selecao[dim].has(indice)) {
      selecao[dim]["delete"](indice);
    } else {
      selecao[dim].add(indice);
    }
    pintar();
  }

  function limparTudo() {
    for (var i = 0; i < selecao.length; i += 1) {
      selecao[i] = new Set();
    }
    pintar();
  }

  // ----------------------------------------------------------------------------------
  // Painting. Every repaint rebuilds every tile from the filtered rows, so no tile can
  // ever show a state a sibling does not — which is the defect the operator reported.
  // ----------------------------------------------------------------------------------

  var caixaFatias = null;
  var caixaQuadros = null;
  var caixaContagem = null;

  function pintarContagem(linhas) {
    limpar(caixaContagem);
    var n = 0;
    for (var i = 0; i < linhas.length; i += 1) {
      n += linhas[i][1];
    }
    var d = cubo.linhas_na_janela;
    var span = el("span", "taxa", fmtNumero(n) + " de " + fmtNumero(d) + " linhas da tabela");
    span.setAttribute("data-n", String(n));
    span.setAttribute("data-d", String(d));
    caixaContagem.appendChild(span);

    var ativos = 0;
    for (var k = 0; k < selecao.length; k += 1) {
      ativos += selecao[k].size;
    }
    var botao = el("button", "limpar", "limpar a seleção");
    botao.type = "button";
    botao.disabled = ativos === 0;
    botao.addEventListener("click", limparTudo);
    caixaContagem.appendChild(botao);
  }

  function pintarFatias() {
    limpar(caixaFatias);
    for (var i = 0; i < cubo.dimensoes.length; i += 1) {
      var dim = cubo.dimensoes[i];
      if (!dim.fatia) {
        continue;
      }
      caixaFatias.appendChild(pintarUmaFatia(i, dim));
    }
  }

  function pintarUmaFatia(idx, dim) {
    var cartao = el("div", "fatia");
    var cabeca = el("div", "fatia-cabeca");
    cabeca.appendChild(el("span", "fatia-rotulo", dim.rotulo));
    var escolhidos = selecao[idx].size;
    cabeca.appendChild(
      el(
        "span",
        "fatia-conta",
        escolhidos === 0
          ? "todos os " + fmtNumero(dim.valores.length)
          : fmtNumero(escolhidos) + " de " + fmtNumero(dim.valores.length)
      )
    );
    cartao.appendChild(cabeca);

    // Counts shown beside each value are computed with THIS dimension's own filter lifted
    // — the standard slicer semantics: a value you have not chosen still tells you how
    // many rows it would bring, given everything else you have chosen.
    var contagens = agruparPor(linhasFiltradas(idx), idx, null);
    var lista = el("ul", "fatia-valores");
    for (var v = 0; v < dim.valores.length; v += 1) {
      lista.appendChild(pintarUmValor(idx, v, dim.valores[v], contagens.get(v)));
    }
    cartao.appendChild(lista);
    return cartao;
  }

  function pintarUmValor(idx, v, rotulo, agregado) {
    var item = el("li");
    var botao = el("button", "valor");
    botao.type = "button";
    var ligado = selecao[idx].has(v);
    botao.setAttribute("aria-pressed", ligado ? "true" : "false");
    if (ligado) {
      botao.className = "valor ligado";
    }
    botao.appendChild(el("span", "valor-nome", rotulo === "" ? "(vazio)" : rotulo));
    botao.appendChild(
      el("span", "valor-n", agregado === undefined ? "0" : fmtNumero(agregado.n))
    );
    botao.addEventListener("click", function () {
      alternar(idx, v);
    });
    item.appendChild(botao);
    return item;
  }

  /* The tile palette, cycled without a remainder operator. This file carries no percent
     sign at all — a test asserts it over these bytes — because that is what makes "this
     panel never renders a bare rate" a mechanical property of the source rather than a
     promise about behaviour nobody can re-run. */
  function corDoQuadro(i) {
    return CORES[i - Math.floor(i / CORES.length) * CORES.length];
  }

  function pintarQuadros(linhas) {
    limpar(caixaQuadros);
    for (var i = 0; i < cubo.quadros.length; i += 1) {
      var q = cubo.quadros[i];
      var cartao = el("div", "quadro quadro-" + q.tipo);
      cartao.appendChild(el("div", "quadro-titulo", q.titulo));
      var corpo = null;
      if (q.tipo === "kpi") {
        corpo = pintarKpi(linhas, q);
      } else if (q.tipo === "barra") {
        corpo = pintarBarra(linhas, q, corDoQuadro(i));
      } else if (q.tipo === "linha") {
        corpo = pintarLinha(linhas, q, corDoQuadro(i));
      } else {
        corpo = pintarGrade(linhas, q);
      }
      cartao.appendChild(corpo);
      caixaQuadros.appendChild(cartao);
    }
  }

  function pintarKpi(linhas, q) {
    var caixa = el("div", "kpi-corpo");
    var n = valorDe(linhas, q.medida);
    var d = valorDe(cubo.linhas, q.medida);
    var span = el(
      "span",
      "taxa",
      formatarValor(q.medida, n) + " de " + formatarValor(q.medida, d) + " na janela"
    );
    span.setAttribute("data-n", String(n));
    span.setAttribute("data-d", String(d));
    caixa.appendChild(span);
    return caixa;
  }

  function ordenadoPorValor(mapa) {
    var pares = [];
    mapa.forEach(function (agregado, chave) {
      pares.push({ chave: chave, valor: agregado.valor, n: agregado.n });
    });
    pares.sort(function (a, b) {
      if (b.valor !== a.valor) {
        return b.valor - a.valor;
      }
      return a.chave - b.chave;
    });
    return pares;
  }

  function pintarBarra(linhas, q, cor) {
    var dim = indiceDaDimensao(q.eixo);
    var valores = cubo.dimensoes[dim].valores;
    var pares = ordenadoPorValor(agruparPor(linhas, dim, q.medida));
    var limite = q.limite || 15;
    if (pares.length > limite) {
      pares = pares.slice(0, limite);
    }
    if (pares.length === 0) {
      return el("p", "vazio", "nada nesta seleção");
    }
    var maximo = 0;
    for (var i = 0; i < pares.length; i += 1) {
      if (pares[i].valor > maximo) {
        maximo = pares[i].valor;
      }
    }
    if (maximo <= 0) {
      maximo = 1;
    }

    var alturaLinha = 22;
    var largura = 620;
    var rotuloLargura = 200;
    var barraLargura = largura - rotuloLargura - 130;
    var altura = pares.length * alturaLinha + 8;
    var svg = svgEl("svg", {
      viewBox: "0 0 " + largura + " " + altura,
      role: "img",
      "aria-label": q.titulo,
      class: "grafico"
    });
    for (var k = 0; k < pares.length; k += 1) {
      svg.appendChild(
        umaBarra(pares[k], k, dim, valores, cor, alturaLinha, rotuloLargura, barraLargura, maximo, q)
      );
    }
    return svg;
  }

  function umaBarra(par, k, dim, valores, cor, alturaLinha, rotuloLargura, barraLargura, maximo, q) {
    var y = k * alturaLinha + 4;
    var g = svgEl("g", { class: "barra-grupo", tabindex: "0", role: "button" });
    var ligado = selecao[dim].has(par.chave);
    var rotulo = svgEl("text", {
      x: rotuloLargura - 8,
      y: y + 13,
      "text-anchor": "end",
      class: ligado ? "barra-rotulo ligado" : "barra-rotulo"
    });
    rotulo.textContent = encurtar(valores[par.chave], 30);
    g.appendChild(rotulo);
    var comprimento = Math.max(1, Math.round((par.valor / maximo) * barraLargura));
    g.appendChild(
      svgEl("rect", {
        x: rotuloLargura,
        y: y + 2,
        width: comprimento,
        height: alturaLinha - 8,
        fill: cor,
        "fill-opacity": ligado || selecao[dim].size === 0 ? "1" : "0.35",
        rx: 2
      })
    );
    var texto = svgEl("text", {
      x: rotuloLargura + comprimento + 6,
      y: y + 13,
      class: "barra-valor"
    });
    texto.textContent = formatarValor(q.medida, par.valor);
    g.appendChild(texto);
    g.addEventListener("click", function () {
      alternar(dim, par.chave);
    });
    g.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        alternar(dim, par.chave);
      }
    });
    return g;
  }

  function pintarLinha(linhas, q, cor) {
    var dim = indiceDaDimensao(q.eixo);
    var valores = cubo.dimensoes[dim].valores;
    var mapa = agruparPor(linhas, dim, q.medida);
    var pontos = [];
    for (var i = 0; i < valores.length; i += 1) {
      var agregado = mapa.get(i);
      pontos.push({ chave: i, valor: agregado === undefined ? 0 : agregado.valor });
    }
    if (pontos.length === 0) {
      return el("p", "vazio", "nada nesta seleção");
    }
    var largura = 620;
    var altura = 190;
    var margemE = 70;
    var margemB = 28;
    var maximo = 0;
    for (var k = 0; k < pontos.length; k += 1) {
      if (pontos[k].valor > maximo) {
        maximo = pontos[k].valor;
      }
    }
    if (maximo <= 0) {
      maximo = 1;
    }
    var passo =
      pontos.length === 1 ? 0 : (largura - margemE - 20) / (pontos.length - 1);
    var svg = svgEl("svg", {
      viewBox: "0 0 " + largura + " " + altura,
      role: "img",
      "aria-label": q.titulo,
      class: "grafico"
    });
    svg.appendChild(
      svgEl("line", {
        x1: margemE - 8, y1: altura - margemB, x2: largura - 10, y2: altura - margemB,
        stroke: "#ccc4b4"
      })
    );
    var coords = [];
    for (var p = 0; p < pontos.length; p += 1) {
      var x = margemE + (pontos.length === 1 ? 0 : p * passo);
      var y =
        altura - margemB - (pontos[p].valor / maximo) * (altura - margemB - 16);
      coords.push(x + "," + y);
      svg.appendChild(pontoDaLinha(pontos[p], x, y, dim, valores, cor, altura, margemB, q));
    }
    var poly = svgEl("polyline", {
      points: coords.join(" "),
      fill: "none",
      stroke: cor,
      "stroke-width": "2"
    });
    svg.insertBefore(poly, svg.firstChild.nextSibling);
    var topo = svgEl("text", { x: 4, y: 16, class: "eixo-rotulo" });
    topo.textContent = formatarValor(q.medida, maximo);
    svg.appendChild(topo);
    return svg;
  }

  function pontoDaLinha(ponto, x, y, dim, valores, cor, altura, margemB, q) {
    var g = svgEl("g", { class: "ponto-grupo", tabindex: "0", role: "button" });
    var ligado = selecao[dim].has(ponto.chave);
    g.appendChild(
      svgEl("circle", {
        cx: x, cy: y, r: ligado ? 6 : 4, fill: cor,
        "fill-opacity": ligado || selecao[dim].size === 0 ? "1" : "0.35"
      })
    );
    var rotulo = svgEl("text", {
      x: x, y: altura - margemB + 14, "text-anchor": "middle", class: "eixo-rotulo"
    });
    rotulo.textContent = encurtar(valores[ponto.chave], 10);
    g.appendChild(rotulo);
    var valorTexto = svgEl("text", {
      x: x, y: y - 9, "text-anchor": "middle", class: "ponto-valor"
    });
    valorTexto.textContent = formatarValor(q.medida, ponto.valor);
    g.appendChild(valorTexto);
    g.addEventListener("click", function () {
      alternar(dim, ponto.chave);
    });
    g.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        alternar(dim, ponto.chave);
      }
    });
    return g;
  }

  function pintarGrade(linhas, q) {
    var dim = indiceDaDimensao(q.eixo);
    var valores = cubo.dimensoes[dim].valores;
    var caixa = el("div", "grade-scroll");
    var tabela = el("table", "grade");
    var thead = el("thead");
    var tr = el("tr");
    tr.appendChild(el("th", null, cubo.dimensoes[dim].rotulo));
    tr.appendChild(el("th", "num", "linhas"));
    for (var m = 0; m < cubo.medidas.length; m += 1) {
      tr.appendChild(el("th", "num", cubo.medidas[m].rotulo));
    }
    thead.appendChild(tr);
    tabela.appendChild(thead);

    var porChave = new Map();
    for (var i = 0; i < linhas.length; i += 1) {
      var chave = linhas[i][0][dim];
      var atual = porChave.get(chave);
      if (atual === undefined) {
        atual = { n: 0, somas: new Array(cubo.medidas.length).fill(0) };
        porChave.set(chave, atual);
      }
      atual.n += linhas[i][1];
      for (var j = 0; j < cubo.medidas.length; j += 1) {
        atual.somas[j] += linhas[i][2][j];
      }
    }
    var chaves = Array.from(porChave.keys()).sort(function (a, b) {
      return a - b;
    });
    var tbody = el("tbody");
    for (var c = 0; c < chaves.length; c += 1) {
      tbody.appendChild(umaLinhaDaGrade(chaves[c], porChave.get(chaves[c]), valores, dim));
    }
    tabela.appendChild(tbody);
    caixa.appendChild(tabela);
    if (chaves.length === 0) {
      caixa.appendChild(el("p", "vazio", "nada nesta seleção"));
    }
    return caixa;
  }

  function umaLinhaDaGrade(chave, agregado, valores, dim) {
    var tr = el("tr");
    if (selecao[dim].has(chave)) {
      tr.className = "ligado";
    }
    var celula = el("td");
    var botao = el("button", "celula-fatia", valores[chave] === "" ? "(vazio)" : valores[chave]);
    botao.type = "button";
    botao.addEventListener("click", function () {
      alternar(dim, chave);
    });
    celula.appendChild(botao);
    tr.appendChild(celula);
    tr.appendChild(el("td", "num", fmtNumero(agregado.n)));
    for (var j = 0; j < cubo.medidas.length; j += 1) {
      tr.appendChild(
        el("td", "num", formatarValor(cubo.medidas[j].coluna, agregado.somas[j]))
      );
    }
    return tr;
  }

  function pintar() {
    var linhas = linhasFiltradas(-1);
    pintarContagem(linhas);
    pintarFatias();
    pintarQuadros(linhas);
  }

  // ----------------------------------------------------------------------------------
  // Boot.
  // ----------------------------------------------------------------------------------

  function erro(mensagem) {
    limpar(raiz);
    raiz.appendChild(el("div", "aviso erro", mensagem));
  }

  function montarEsqueleto() {
    limpar(raiz);
    caixaContagem = el("div", "painel-contagem");
    raiz.appendChild(caixaContagem);
    var corpo = el("div", "painel-corpo");
    caixaFatias = el("div", "painel-fatias");
    caixaQuadros = el("div", "painel-quadros");
    corpo.appendChild(caixaFatias);
    corpo.appendChild(caixaQuadros);
    raiz.appendChild(corpo);
  }

  function montar(dados) {
    cubo = dados;
    selecao = [];
    for (var i = 0; i < cubo.dimensoes.length; i += 1) {
      selecao.push(new Set());
    }
    montarEsqueleto();
    pintar();
  }

  var slug = raiz.getAttribute("data-cubo") || "";
  if (!SLUG_VALIDO.test(slug)) {
    erro("Este painel não declara qual cubo carregar.");
    return;
  }
  fetch("../cubos/" + slug + ".json")
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error("HTTP " + resposta.status);
      }
      return resposta.json();
    })
    .then(montar)
    .catch(function (e) {
      erro(
        "Não foi possível carregar os números deste painel (" +
          e.message +
          "). Esta página precisa estar publicada num site: ela não abre corretamente " +
          "se você apenas clicar duas vezes no arquivo no seu computador."
      );
    });
})();
