/*
 * OS-103 — o construtor de relatórios: o explorador da geração `b2` reescrito como um
 * "report builder" no feitio de um painel de BI, sobre QUALQUER uma das tabelas publicadas.
 *
 * O que ele é, em uma frase: uma tabela publicada é lida do próprio `../data/derived/`,
 * tipada em dimensões e medidas a partir do `manifest.json` mais os seus valores reais, e
 * virada num cubo dentro do navegador; o leitor escolhe um Eixo, uma Série, uma Medida e
 * um Visual, fatia por qualquer dimensão, e UMA agregação alimenta os KPIs, o gráfico e a
 * grade ao mesmo tempo — sem botão "aplicar", sem recarregar página, sem requisição além
 * do `manifest.json` e do `.csv` da tabela escolhida.
 *
 * Escrito DOM-first, como `dashboard.js`: este arquivo nunca escreve marcação (nenhum
 * marcação por atribuição de texto bruto), nunca renderiza uma taxa (o caractere de porcentagem não existe nele —
 * sinal 35o relê os bytes e confere), e a única forma de ir de uma tabela a outra continua
 * sendo o link "ver perfil", que segue o nome do parlamentar até `perfil/<slug>.html`
 * (sinal 35d). O que sai daqui em `.pdf`/`.docx` é escrito por `exportar.js`, um arquivo
 * irmão que não conhece o DOM nem faz requisição alguma.
 *
 * As regras de tipagem, ditas uma vez (BRIEF OS-103, ASSUMPTIONS):
 *   dimensão — `chave`, `texto`, `data` (grão de mês, AAAA-MM), qualquer coluna em forma
 *              de ano (todo valor não vazio um inteiro de 4 dígitos entre 1900 e 2100), e
 *              uma `contagem` com até 60 valores distintos (oferecida como AMBAS);
 *   medida   — `dinheiro`, `contagem` que não seja ano, e a contagem de linhas, sempre;
 *   agregações — `contagem` e `soma`, e mais nenhuma. Dinheiro é mostrado em reais inteiros.
 */

(function () {
  "use strict";

  // Espelhos literais de `painel_estatico/build.py` — um teste relê os dois lados.
  var ROW_CAP = 200000;
  var TABELA_PESADA_LIMITE = 5 * 1024 * 1024;

  // Os tetos que aparecem na tela como "N de M" — nunca um corte silencioso.
  var EIXO_TOPO = 60;
  var SERIE_TOPO = 6;
  var FATIA_LISTA = 500;
  var FATIA_BUSCA = 30;
  var CONTAGEM_DIMENSAO_MAX = 60;
  var GRADE_TOPO = 500;

  var ANO_MIN = 1900;
  var ANO_MAX = 2100;
  var ANO_4 = /^\d{4}$/;
  var DATA_ISO = /^\d{4}-\d{2}/;

  // As colunas de nome que dão direito ao link "ver perfil" — as mesmas do explorador.
  var COLUNAS_NOME_DEPUTADO = ["deputado", "parlamentar", "nome_na_fonte"];
  var COLUNAS_CHAVE_NOMES = [
    "nome_na_api", "nome_no_painel_de_votacao", "nome_no_painel_de_emendas",
    "nome_nas_diarias", "unidade_no_documento",
  ];
  var LINHAS = "__linhas";
  var LICENCA_DADOS = "CC BY-SA 4.0";

  var temDocumento = typeof document !== "undefined";
  var raiz = temDocumento ? document.getElementById("construtor-raiz") : null;
  var manifest = null;
  var TABELA = null;      // { nome, header, rows, truncada, campos, cubo }
  var fatiaBusca = semPrototipo();   // coluna -> termo digitado na busca da fatia
  var fatiaAberta = semPrototipo();  // coluna -> a fatia está aberta
  var fatiaFoco = null;              // a coluna cuja busca tinha o foco no último repinte
  var mapaPerfil = null;  // nome em qualquer grafia -> nome_na_api (carregado uma vez)
  var nos = {};           // os nós fixos do esqueleto

  var estado = {
    tabela: null,
    sel: {},              // dimensão -> [valores selecionados]
    eixo: null,
    serie: null,
    medida: LINHAS,
    agregacao: "contagem",
    visual: "barra",      // barra | linha
    ordem: "valor",       // valor (maior primeiro) | alfabetica
  };
  var CHAVES_ESTADO = ["tabela", "sel", "eixo", "serie", "medida", "agregacao", "visual", "ordem"];

  // ------------------------------------------------------------------------------------
  // Utilidades puras
  // ------------------------------------------------------------------------------------
  function slugify(texto) {
    return String(texto)
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "sem-nome";
  }

  function parseNumero(v) {
    if (v === null || v === undefined || v === "") return null;
    var s = String(v).trim();
    if (/^-?\d{1,3}(\.\d{3})*,\d+$/.test(s)) {
      return parseFloat(s.replace(/\./g, "").replace(",", "."));
    }
    if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
    return null;
  }

  function milhar(inteiro) {
    var s = String(Math.abs(inteiro));
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return inteiro < 0 ? "-" + s : s;
  }

  // Dinheiro em reais inteiros (cldf-painel#9), contagens com separador de milhar.
  function formatarValor(valor, tipo) {
    if (valor === null || valor === undefined || isNaN(valor)) return "n/d";
    if (tipo === "dinheiro") return "R$ " + milhar(Math.trunc(valor));
    return milhar(Math.trunc(valor));
  }

  function el(tag, classe, texto) {
    var no = document.createElement(tag);
    if (classe) no.className = classe;
    if (texto !== undefined && texto !== null) no.textContent = String(texto);
    return no;
  }

  function svgEl(tag, atributos) {
    var no = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(atributos || {}).forEach(function (k) { no.setAttribute(k, String(atributos[k])); });
    return no;
  }

  function limpar(no) {
    while (no && no.firstChild) no.removeChild(no.firstChild);
  }

  // ------------------------------------------------------------------------------------
  // CSV — o mesmo parser em fluxo do explorador (OS-082), com o mesmo teto de linhas.
  // ------------------------------------------------------------------------------------
  function criarParserCSV(rowCap) {
    var header = null;
    var rows = [];
    var truncada = false;
    var linha = [];
    var campo = "";
    var dentroAspas = false;
    var pendente = "";

    function fecharCampo() { linha.push(campo); campo = ""; }
    function fecharLinha() {
      fecharCampo();
      var atual = linha;
      linha = [];
      if (header === null) {
        if (atual.length && atual[0]) atual[0] = atual[0].replace(/^﻿/, "");
        header = atual;
        return;
      }
      if (atual.length === 1 && atual[0] === "") return;
      if (rows.length >= rowCap) { truncada = true; return; }
      var obj = {};
      for (var c = 0; c < header.length; c++) obj[header[c]] = atual[c] !== undefined ? atual[c] : "";
      rows.push(obj);
    }

    return {
      consumir: function (texto) {
        if (pendente) { texto = pendente + texto; pendente = ""; }
        var i = 0;
        var n = texto.length;
        while (i < n) {
          var c = texto[i];
          if (dentroAspas) {
            if (c === '"') {
              if (i + 1 === n) { pendente = '"'; i++; break; }
              if (texto[i + 1] === '"') { campo += '"'; i += 2; continue; }
              dentroAspas = false; i++; continue;
            }
            campo += c; i++; continue;
          }
          if (c === '"') { dentroAspas = true; i++; continue; }
          if (c === ",") { fecharCampo(); i++; continue; }
          if (c === "\r") { i++; continue; }
          if (c === "\n") { fecharLinha(); i++; continue; }
          campo += c; i++;
        }
      },
      cheio: function () { return truncada; },
      finalizar: function () {
        if (pendente) { pendente = ""; dentroAspas = false; }
        if (campo.length > 0 || linha.length > 0) fecharLinha();
        return { header: header || [], rows: rows, truncada: truncada };
      },
    };
  }

  // ------------------------------------------------------------------------------------
  // Tipagem dos campos — o manifesto diz a espécie, os valores reais decidem o resto.
  // ------------------------------------------------------------------------------------
  function emFormaDeAno(valores) {
    var algum = false;
    for (var i = 0; i < valores.length; i++) {
      var v = valores[i];
      if (v === "" || v === null || v === undefined) continue;
      var s = String(v).trim();
      if (!ANO_4.test(s)) return false;
      var n = parseInt(s, 10);
      if (n < ANO_MIN || n > ANO_MAX) return false;
      algum = true;
    }
    return algum;
  }

  // Toda tabela indexada por um VALOR que vem da fonte ou do fragmento da URL nasce sem
  // protótipo: "constructor", "toString" ou "__proto__" numa célula ou num link colado são
  // valores como quaisquer outros, e não propriedades herdadas (revisão da OS-103).
  function semPrototipo() { return Object.create(null); }

  function distintos(valores, teto) {
    var vistos = semPrototipo();
    var n = 0;
    for (var i = 0; i < valores.length; i++) {
      var v = valores[i];
      if (vistos[v] !== true) {
        vistos[v] = true;
        n++;
        if (n > teto) return n;
      }
    }
    return n;
  }

  function grao(tipo, valor) {
    if (tipo === "data") {
      var s = String(valor === null || valor === undefined ? "" : valor);
      return DATA_ISO.test(s) ? s.slice(0, 7) : s;
    }
    return String(valor === null || valor === undefined ? "" : valor);
  }

  // `colunas` é o `manifest.tabelas[nome].colunas` (coluna -> espécie); `rows` são as linhas
  // carregadas. Devolve { dimensoes: [...], medidas: [...] } — a contagem de linhas é
  // sempre a primeira medida.
  function tiparCampos(header, colunas, rows) {
    var dimensoes = [];
    var medidas = [{ coluna: LINHAS, rotulo: "linhas", tipo: "contagem" }];
    colunas = colunas || {};
    for (var i = 0; i < header.length; i++) {
      var c = header[i];
      var especie = colunas[c] || "texto";
      var valores = rows.map(function (r) { return r[c]; });
      if (especie === "data") {
        dimensoes.push({ coluna: c, tipo: "data", temporal: true });
      } else if (especie === "chave" || especie === "texto") {
        dimensoes.push({ coluna: c, tipo: especie, temporal: false });
      } else if (especie === "contagem") {
        if (emFormaDeAno(valores)) {
          dimensoes.push({ coluna: c, tipo: "ano", temporal: true });
        } else {
          medidas.push({ coluna: c, rotulo: c, tipo: "contagem" });
          if (distintos(valores, CONTAGEM_DIMENSAO_MAX) <= CONTAGEM_DIMENSAO_MAX) {
            dimensoes.push({ coluna: c, tipo: "contagem", temporal: false });
          }
        }
      } else if (especie === "dinheiro") {
        medidas.push({ coluna: c, rotulo: c, tipo: "dinheiro" });
      } else {
        dimensoes.push({ coluna: c, tipo: "texto", temporal: false });
      }
    }
    return { dimensoes: dimensoes, medidas: medidas };
  }

  // ------------------------------------------------------------------------------------
  // O cubo — uma tabela de índices por dimensão, um vetor de números por medida.
  // ------------------------------------------------------------------------------------
  function construirCubo(rows, campos) {
    var n = rows.length;
    var dims = semPrototipo();
    campos.dimensoes.forEach(function (d) {
      var valores = [];
      var indice = semPrototipo();
      var codigos = new Int32Array(n);
      for (var r = 0; r < n; r++) {
        var v = grao(d.tipo, rows[r][d.coluna]);
        var k = indice[v];
        if (k === undefined) { k = valores.length; indice[v] = k; valores.push(v); }
        codigos[r] = k;
      }
      dims[d.coluna] = { tipo: d.tipo, temporal: d.temporal, valores: valores, indice: indice, codigos: codigos };
    });
    var meds = semPrototipo();
    campos.medidas.forEach(function (m) {
      if (m.coluna === LINHAS) return;
      var v = new Float64Array(n);
      for (var r = 0; r < n; r++) {
        var x = parseNumero(rows[r][m.coluna]);
        v[r] = x === null ? 0 : x;
      }
      meds[m.coluna] = { tipo: m.tipo, valores: v };
    });
    return { n: n, dims: dims, meds: meds, campos: campos };
  }

  function conjuntoDeCodigos(dim, selecionados) {
    var s = semPrototipo();
    var algum = false;
    (selecionados || []).forEach(function (v) {
      var k = dim.indice[v];
      if (k !== undefined) { s[k] = true; algum = true; }
    });
    return algum ? s : null;
  }

  // A máscara das linhas que passam por TODAS as fatias, exceto a de `exceto` (que fica
  // levantada — a regra do dashboard.js: a contagem ao lado de um valor diz quantas linhas
  // ele traria, e não quantas já trouxe).
  function mascara(cubo, sel, exceto) {
    var m = new Uint8Array(cubo.n);
    for (var r = 0; r < cubo.n; r++) m[r] = 1;
    Object.keys(sel || {}).forEach(function (coluna) {
      if (coluna === exceto) return;
      var dim = cubo.dims[coluna];
      if (!dim) return;
      var cods = conjuntoDeCodigos(dim, sel[coluna]);
      if (!cods) return;
      for (var r = 0; r < cubo.n; r++) {
        if (m[r] && !cods[dim.codigos[r]]) m[r] = 0;
      }
    });
    return m;
  }

  function contagensPorFatia(cubo, sel, coluna) {
    var dim = cubo.dims[coluna];
    var m = mascara(cubo, sel, coluna);
    var contagens = new Int32Array(dim.valores.length);
    for (var r = 0; r < cubo.n; r++) if (m[r]) contagens[dim.codigos[r]]++;
    return contagens;
  }

  function filtrosAtivos(sel) {
    return Object.keys(sel || {}).filter(function (c) { return sel[c] && sel[c].length > 0; }).length;
  }

  // ------------------------------------------------------------------------------------
  // A agregação — UMA, e é dela que saem os KPIs, o gráfico e a grade.
  // ------------------------------------------------------------------------------------
  function agregar(cubo, estadoAtual) {
    var sel = estadoAtual.sel || {};
    var m = mascara(cubo, sel, null);
    var eixo = estadoAtual.eixo && cubo.dims[estadoAtual.eixo] ? cubo.dims[estadoAtual.eixo] : null;
    var serie = estadoAtual.serie && estadoAtual.serie !== estadoAtual.eixo && cubo.dims[estadoAtual.serie]
      ? cubo.dims[estadoAtual.serie] : null;
    var medida = estadoAtual.medida && cubo.meds[estadoAtual.medida] ? cubo.meds[estadoAtual.medida] : null;
    var agregacao = medida && estadoAtual.agregacao === "soma" ? "soma" : "contagem";
    var tipoValor = agregacao === "soma" ? medida.tipo : "contagem";

    var linhas = 0;
    var somaTotal = 0;
    var grupos = eixo ? new Array(eixo.valores.length) : null;
    var totaisSerie = serie ? new Float64Array(serie.valores.length) : null;
    var linhasSerie = serie ? new Int32Array(serie.valores.length) : null;
    var r;
    for (r = 0; r < cubo.n; r++) {
      if (!m[r]) continue;
      linhas++;
      var x = medida ? medida.valores[r] : 1;
      somaTotal += medida ? x : 0;
      var peso = agregacao === "soma" ? x : 1;
      if (grupos) {
        var k = eixo.codigos[r];
        var g = grupos[k];
        if (!g) { g = { valor: eixo.valores[k], n: 0, soma: 0, series: semPrototipo() }; grupos[k] = g; }
        g.n++;
        g.soma += medida ? x : 0;
        if (serie) {
          var sk = serie.codigos[r];
          var sv = serie.valores[sk];
          var gs = g.series[sv];
          if (!gs) { gs = { n: 0, soma: 0 }; g.series[sv] = gs; }
          gs.n++;
          gs.soma += medida ? x : 0;
          totaisSerie[sk] += peso;
          linhasSerie[sk]++;
        }
      }
    }
    var lista = grupos ? grupos.filter(function (g) { return g; }) : [];
    lista.forEach(function (g) { g.medido = agregacao === "soma" ? g.soma : g.n; });

    var seriesTopo = [];
    var seriesTotal = 0;
    if (serie) {
      var idx = [];
      // Um valor da série que tem LINHAS na vista existe, mesmo que a sua soma seja zero —
      // numa tabela de transparência a linha com R$ 0 é muitas vezes a interessante. O que
      // ordena é a magnitude; o que inclui é a presença (revisão da OS-103).
      for (var i = 0; i < serie.valores.length; i++) if (linhasSerie[i] > 0) idx.push(i);
      seriesTotal = idx.length;
      idx.sort(function (a, b) {
        return Math.abs(totaisSerie[b]) - Math.abs(totaisSerie[a]) || (serie.valores[a] < serie.valores[b] ? -1 : 1);
      });
      seriesTopo = idx.slice(0, SERIE_TOPO).map(function (i) { return serie.valores[i]; });
    }

    var temporal = !!(eixo && eixo.temporal);
    var ordem = estadoAtual.ordem === "alfabetica" || (temporal && estadoAtual.visual === "linha") ? "chave" : "valor";
    ordenar(lista, ordem);
    var eixoTotal = lista.length;
    var recortada = lista.slice(0, EIXO_TOPO);

    return {
      linhas: linhas,
      linhasTotal: cubo.n,
      filtros: filtrosAtivos(sel),
      eixo: estadoAtual.eixo && eixo ? estadoAtual.eixo : null,
      serie: serie ? estadoAtual.serie : null,
      medida: medida ? estadoAtual.medida : LINHAS,
      agregacao: agregacao,
      tipoValor: tipoValor,
      temporal: temporal,
      ordem: ordem,
      total: agregacao === "soma" ? somaTotal : linhas,
      somaMedida: medida ? somaTotal : null,
      grupos: recortada,
      eixoTotal: eixoTotal,
      series: seriesTopo,
      seriesTotal: seriesTotal,
    };
  }

  function ordenar(lista, ordem) {
    if (ordem === "chave") {
      lista.sort(function (a, b) {
        var na = parseNumero(a.valor), nb = parseNumero(b.valor);
        if (na !== null && nb !== null && na !== nb) return na - nb;
        return a.valor < b.valor ? -1 : (a.valor > b.valor ? 1 : 0);
      });
    } else {
      lista.sort(function (a, b) {
        return b.medido - a.medido || (a.valor < b.valor ? -1 : (a.valor > b.valor ? 1 : 0));
      });
    }
    return lista;
  }

  // ------------------------------------------------------------------------------------
  // O link de perfil — `perfil/<slug>.html`, relativo a `painel/explorador.html`.
  // ------------------------------------------------------------------------------------
  function colunaDeNome(header) {
    return COLUNAS_NOME_DEPUTADO.filter(function (c) { return header.indexOf(c) !== -1; })[0] || null;
  }

  function montarMapaPerfil(linhasChave) {
    var mapa = {};
    linhasChave.forEach(function (d) {
      var chave = d.nome_na_api;
      if (!chave) return;
      COLUNAS_CHAVE_NOMES.forEach(function (c) {
        if (d[c]) mapa[d[c]] = chave;
      });
    });
    return mapa;
  }

  function caminhoPerfil(nome, mapa) {
    mapa = mapa || mapaPerfil;
    if (!mapa || !nome) return "";
    var chave = mapa[nome];
    if (!chave) return "";
    return "perfil/" + slugify(chave) + ".html";
  }

  // ------------------------------------------------------------------------------------
  // Estado — no fragmento da URL, para que uma vista seja um link.
  // ------------------------------------------------------------------------------------
  function serializarEstado(e) {
    var limpo = {};
    CHAVES_ESTADO.forEach(function (k) {
      if (k === "sel") {
        var s = {};
        Object.keys(e.sel || {}).forEach(function (c) { if (e.sel[c] && e.sel[c].length) s[c] = e.sel[c].slice(); });
        if (Object.keys(s).length) limpo.sel = s;
      } else if (e[k] !== null && e[k] !== undefined) {
        limpo[k] = e[k];
      }
    });
    return encodeURIComponent(JSON.stringify(limpo));
  }

  function lerEstado(fragmento) {
    var texto = String(fragmento || "").replace(/^#/, "");
    if (!texto) return null;
    var obj;
    try { obj = JSON.parse(decodeURIComponent(texto)); } catch (e) { return null; }
    if (!obj || typeof obj !== "object") return null;
    var e = {};
    CHAVES_ESTADO.forEach(function (k) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) return;
      var v = obj[k];
      if (k === "sel") {
        if (v && typeof v === "object" && !Array.isArray(v)) {
          e.sel = {};
          Object.keys(v).forEach(function (c) {
            if (Array.isArray(v[c])) e.sel[c] = v[c].map(String);
          });
        }
      } else if (typeof v === "string") {
        e[k] = v;
      }
    });
    return e;
  }

  // ------------------------------------------------------------------------------------
  // Carga — sempre relativa, sempre a árvore deste projeto; o nome tem de estar no manifesto.
  // ------------------------------------------------------------------------------------
  function carregarManifest() {
    return fetch("manifest.json").then(function (resp) {
      if (!resp.ok) throw new Error("não foi possível carregar manifest.json");
      return resp.json();
    });
  }

  function nomeValido(nome) {
    return typeof nome === "string" && /^[a-z0-9-]+$/.test(nome) &&
      !!(manifest && manifest.tabelas && Object.prototype.hasOwnProperty.call(manifest.tabelas, nome));
  }

  function carregarCSV(nome, rowCap) {
    if (!nomeValido(nome)) {
      return Promise.reject(new Error("tabela desconhecida: " + String(nome)));
    }
    return fetch("../data/derived/" + nome + ".csv").then(function (resp) {
      if (!resp.ok) throw new Error("não foi possível carregar " + nome + ".csv");
      var parser = criarParserCSV(rowCap);
      if (resp.body && resp.body.getReader) {
        var leitor = resp.body.getReader();
        var decodificador = new TextDecoder("utf-8");
        function passo() {
          return leitor.read().then(function (pedaco) {
            if (pedaco.done || parser.cheio()) {
              parser.consumir(decodificador.decode());
              if (!pedaco.done) leitor.cancel();
              return parser.finalizar();
            }
            parser.consumir(decodificador.decode(pedaco.value, { stream: true }));
            return passo();
          });
        }
        return passo();
      }
      return resp.text().then(function (texto) { parser.consumir(texto); return parser.finalizar(); });
    });
  }

  function carregarTabela(nome) {
    return carregarCSV(nome, ROW_CAP).then(function (lida) {
      var campos = tiparCampos(lida.header, manifest.tabelas[nome].colunas, lida.rows);
      var cubo = construirCubo(lida.rows, campos);
      TABELA = { nome: nome, header: lida.header, truncada: lida.truncada, campos: campos, cubo: cubo, linhas: lida.rows.length };
      var nomeCol = colunaDeNome(lida.header);
      if (nomeCol && !mapaPerfil && nomeValido("deputados-chave")) {
        return carregarCSV("deputados-chave", ROW_CAP).then(function (chave) {
          mapaPerfil = montarMapaPerfil(chave.rows);
          return TABELA;
        }, function () { return TABELA; });
      }
      return TABELA;
    });
  }

  // ------------------------------------------------------------------------------------
  // A vista — o que o exportador recebe. Puro: nenhum DOM, nenhuma data lida aqui.
  // ------------------------------------------------------------------------------------
  function montarVisao(tabela, estadoAtual, agregado, data, url) {
    var meta = manifest && manifest.tabelas[tabela.nome] ? manifest.tabelas[tabela.nome] : {};
    var filtros = Object.keys(estadoAtual.sel || {}).filter(function (c) {
      return estadoAtual.sel[c] && estadoAtual.sel[c].length;
    }).map(function (c) { return { coluna: c, valores: estadoAtual.sel[c].slice() }; });
    var rotuloMedida = agregado.medida === LINHAS ? "linhas" : agregado.medida;
    var rotuloValor = agregado.agregacao === "soma" ? "soma de " + rotuloMedida : "contagem de linhas";
    var kpis = [
      { rotulo: "linhas na vista", valor: formatarValor(agregado.linhas, "contagem"), n: agregado.linhas, d: agregado.linhasTotal },
      { rotulo: rotuloValor, valor: formatarValor(agregado.total, agregado.tipoValor), n: agregado.total },
    ];
    if (agregado.eixo) {
      kpis.push({ rotulo: "valores de " + agregado.eixo, valor: formatarValor(agregado.eixoTotal, "contagem"), n: agregado.eixoTotal });
    }
    var cabecalho = [agregado.eixo || "(sem eixo)"];
    if (agregado.series.length) cabecalho = cabecalho.concat(agregado.series);
    cabecalho.push(rotuloValor);
    var linhas = agregado.grupos.map(function (g) {
      var linha = [g.valor];
      agregado.series.forEach(function (s) {
        var gs = g.series[s];
        linha.push(formatarValor(gs ? (agregado.agregacao === "soma" ? gs.soma : gs.n) : 0, agregado.tipoValor));
      });
      linha.push(formatarValor(g.medido, agregado.tipoValor));
      return linha;
    });
    return {
      titulo: "Relatório — " + tabela.nome,
      tabela: tabela.nome,
      descricao: meta.descricao || "",
      filtros: filtros,
      kpis: kpis,
      grafico: {
        visual: estadoAtual.visual === "linha" ? "linha" : "barra",
        eixo: agregado.eixo,
        rotulos: agregado.grupos.map(function (g) { return g.valor; }),
        valores: agregado.grupos.map(function (g) { return Math.trunc(g.medido); }),
        series: agregado.series.map(function (s) {
          return { nome: s, valores: agregado.grupos.map(function (g) {
            var gs = g.series[s];
            return gs ? Math.trunc(agregado.agregacao === "soma" ? gs.soma : gs.n) : 0;
          }) };
        }),
        tipoValor: agregado.tipoValor,
        rotuloValor: rotuloValor,
      },
      grade: { cabecalho: cabecalho, linhas: linhas, total: agregado.eixoTotal, mostradas: linhas.length },
      proveniencia: {
        tabela: tabela.nome + ".csv",
        sha256: meta.sha256 && meta.sha256.csv ? meta.sha256.csv : "",
        linhas: tabela.linhas,
        truncada: !!tabela.truncada,
        licenca: LICENCA_DADOS,
        url: url || "",
        data: data || "",
      },
    };
  }

  // ------------------------------------------------------------------------------------
  // UI — o esqueleto é montado uma vez; cada mudança de estado repinta os quadros.
  // ------------------------------------------------------------------------------------
  function montarEsqueleto() {
    limpar(raiz);
    nos.aviso = el("div", "construtor-avisos");
    raiz.appendChild(nos.aviso);

    var topo = el("div", "cartao construtor-topo");
    var linhaTabela = el("div", "linha-filtro");
    linhaTabela.appendChild(el("span", "rotulo", "tabela"));
    nos.selTabela = el("select");
    nos.selTabela.id = "sel-tabela";
    var vazio = el("option", null, "— escolha uma tabela —");
    vazio.value = "";
    nos.selTabela.appendChild(vazio);
    Object.keys(manifest.tabelas).sort().forEach(function (n) {
      var o = el("option", null, n + " (" + formatarValor(manifest.tabelas[n].linhas, "contagem") + " linhas)");
      o.value = n;
      nos.selTabela.appendChild(o);
    });
    nos.selTabela.addEventListener("change", function () { escolherTabela(nos.selTabela.value); });
    linhaTabela.appendChild(nos.selTabela);
    topo.appendChild(linhaTabela);
    nos.descricao = el("p", "construtor-descricao");
    topo.appendChild(nos.descricao);
    raiz.appendChild(topo);

    var corpo = el("div", "construtor-corpo");
    nos.campos = el("aside", "cartao construtor-campos");
    nos.centro = el("section", "construtor-centro");
    nos.pocos = el("aside", "cartao construtor-pocos");
    corpo.appendChild(nos.campos);
    corpo.appendChild(nos.centro);
    corpo.appendChild(nos.pocos);
    raiz.appendChild(corpo);

    nos.fatias = el("div", "construtor-fatias");
    nos.resumo = el("div", "construtor-resumo");
    nos.kpis = el("div", "construtor-kpis");
    nos.grafico = el("div", "cartao construtor-grafico");
    nos.grade = el("div", "cartao construtor-grade");
    [nos.fatias, nos.resumo, nos.kpis, nos.grafico, nos.grade].forEach(function (n) { nos.centro.appendChild(n); });
  }

  function mostrarAviso(msg, erro) {
    var no = el("div", "aviso" + (erro ? " erro" : ""), msg);
    nos.aviso.appendChild(no);
    return no;
  }

  function escolherTabela(nome) {
    limpar(nos.aviso);
    if (!nome) { TABELA = null; estado.tabela = null; estado.sel = {}; estado.eixo = null; estado.serie = null; estado.medida = LINHAS; gravarHash(); pintar(); return; }
    if (!nomeValido(nome)) { mostrarAviso("tabela desconhecida: " + nome, true); return; }
    var meta = manifest.tabelas[nome];
    if (nome !== estado.tabela) {
      estado.sel = {}; estado.eixo = null; estado.serie = null; estado.medida = LINHAS; estado.agregacao = "contagem";
      fatiaBusca = semPrototipo(); fatiaAberta = semPrototipo(); fatiaFoco = null;
    }
    estado.tabela = nome;
    if (meta.bytes > TABELA_PESADA_LIMITE) {
      mostrarAviso("tabela pesada: o navegador baixa o arquivo inteiro, " +
        formatarValor(meta.bytes, "contagem") + " bytes — " +
        (meta.linhas > ROW_CAP
          ? "e só as primeiras " + formatarValor(ROW_CAP, "contagem") + " das " +
            formatarValor(meta.linhas, "contagem") + " linhas entram no cubo."
          : "e todas as " + formatarValor(meta.linhas, "contagem") + " linhas entram no cubo."));
    }
    var carregando = mostrarAviso("carregando " + nome + ".csv…");
    carregarTabela(nome).then(function () {
      if (carregando.parentNode) carregando.parentNode.removeChild(carregando);
      if (TABELA.truncada) {
        mostrarAviso("tabela cortada em " + formatarValor(ROW_CAP, "contagem") + " linhas de " +
          formatarValor(meta.linhas, "contagem") + " — o arquivo completo está em ../data/derived/" + nome + ".csv");
      }
      if (!estado.eixo || !TABELA.cubo.dims[estado.eixo]) {
        var primeira = TABELA.campos.dimensoes[0];
        estado.eixo = primeira ? primeira.coluna : null;
      }
      if (!TABELA.cubo.meds[estado.medida]) { estado.medida = LINHAS; estado.agregacao = "contagem"; }
      gravarHash();
      pintar();
    }, function (e) {
      if (carregando.parentNode) carregando.parentNode.removeChild(carregando);
      mostrarAviso(String(e && e.message ? e.message : e), true);
    });
  }

  function gravarHash() {
    if (typeof window === "undefined" || !window.history || !window.history.replaceState) return;
    window.history.replaceState(null, "", "#" + serializarEstado(estado));
  }

  function mudar(campo, valor) {
    estado[campo] = valor;
    if (campo === "medida" && valor === LINHAS) estado.agregacao = "contagem";
    if (campo === "medida" && valor !== LINHAS && estado.agregacao === "contagem") estado.agregacao = "soma";
    gravarHash();
    pintar();
  }

  function alternarValor(coluna, valor) {
    var atual = (estado.sel[coluna] || []).slice();
    var i = atual.indexOf(valor);
    if (i === -1) atual.push(valor); else atual.splice(i, 1);
    if (atual.length) estado.sel[coluna] = atual; else delete estado.sel[coluna];
    gravarHash();
    pintar();
  }

  function pintar() {
    nos.selTabela.value = estado.tabela || "";
    nos.descricao.textContent = TABELA && manifest.tabelas[TABELA.nome].descricao
      ? manifest.tabelas[TABELA.nome].descricao : "";
    limpar(nos.campos); limpar(nos.pocos); limpar(nos.fatias); limpar(nos.resumo);
    limpar(nos.kpis); limpar(nos.grafico); limpar(nos.grade);
    if (!TABELA) {
      nos.centro.appendChild(el("p", "construtor-vazio", "Escolha uma tabela acima para montar um relatório."));
      return;
    }
    var vazioAntigo = nos.centro.querySelector(".construtor-vazio");
    if (vazioAntigo) nos.centro.removeChild(vazioAntigo);
    var agregado = agregar(TABELA.cubo, estado);
    pintarCampos();
    pintarPocos(agregado);
    pintarFatias();
    pintarResumo(agregado);
    pintarKpis(agregado);
    pintarGrafico(agregado);
    pintarGrade(agregado);
  }

  function botaoPequeno(texto, ativo, aoClicar) {
    var b = el("button", "secundario mini" + (ativo ? " ativo" : ""), texto);
    b.type = "button";
    b.addEventListener("click", aoClicar);
    return b;
  }

  function pintarCampos() {
    nos.campos.appendChild(el("h2", null, "Campos"));
    nos.campos.appendChild(el("h3", null, "Dimensões"));
    var ul = el("ul", "campos-lista");
    TABELA.campos.dimensoes.forEach(function (d) {
      var li = el("li", "campo campo-dimensao");
      li.appendChild(el("span", "campo-nome", d.coluna));
      li.appendChild(el("span", "campo-tipo", d.tipo));
      li.appendChild(botaoPequeno("eixo", estado.eixo === d.coluna, function () { mudar("eixo", d.coluna); }));
      li.appendChild(botaoPequeno("série", estado.serie === d.coluna, function () { mudar("serie", estado.serie === d.coluna ? null : d.coluna); }));
      ul.appendChild(li);
    });
    nos.campos.appendChild(ul);
    nos.campos.appendChild(el("h3", null, "Medidas"));
    var um = el("ul", "campos-lista");
    TABELA.campos.medidas.forEach(function (m) {
      var li = el("li", "campo campo-medida");
      li.appendChild(el("span", "campo-nome", m.rotulo));
      li.appendChild(el("span", "campo-tipo", m.tipo));
      li.appendChild(botaoPequeno("medida", estado.medida === m.coluna, function () { mudar("medida", m.coluna); }));
      um.appendChild(li);
    });
    nos.campos.appendChild(um);
  }

  function seletor(rotulo, opcoes, atual, aoMudar) {
    var grupo = el("div", "grupo-campo");
    grupo.appendChild(el("span", "rotulo", rotulo));
    var s = el("select");
    opcoes.forEach(function (o) {
      var op = el("option", null, o.rotulo);
      op.value = o.valor;
      if (o.valor === atual) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener("change", function () { aoMudar(s.value); });
    grupo.appendChild(s);
    return grupo;
  }

  function pintarPocos(agregado) {
    nos.pocos.appendChild(el("h2", null, "Relatório"));
    var dims = TABELA.campos.dimensoes.map(function (d) { return { valor: d.coluna, rotulo: d.coluna }; });
    nos.pocos.appendChild(seletor("eixo", dims, estado.eixo || "", function (v) { mudar("eixo", v); }));
    nos.pocos.appendChild(seletor("série", [{ valor: "", rotulo: "— nenhuma —" }].concat(dims), estado.serie || "", function (v) { mudar("serie", v || null); }));
    var meds = TABELA.campos.medidas.map(function (m) { return { valor: m.coluna, rotulo: m.rotulo }; });
    nos.pocos.appendChild(seletor("medida", meds, estado.medida, function (v) { mudar("medida", v); }));
    var ags = [{ valor: "contagem", rotulo: "contagem de linhas" }];
    if (estado.medida !== LINHAS) ags.push({ valor: "soma", rotulo: "soma" });
    nos.pocos.appendChild(seletor("agregação", ags, agregado.agregacao, function (v) { mudar("agregacao", v); }));
    nos.pocos.appendChild(seletor("visual", [{ valor: "barra", rotulo: "barras" }, { valor: "linha", rotulo: "linha" }], estado.visual, function (v) { mudar("visual", v); }));
    nos.pocos.appendChild(seletor("ordem", [{ valor: "valor", rotulo: "maior valor primeiro" }, { valor: "alfabetica", rotulo: "alfabética / cronológica" }], estado.ordem, function (v) { mudar("ordem", v); }));

    var acoes = el("div", "construtor-acoes");
    var bPdf = el("button", null, "baixar .pdf");
    bPdf.type = "button";
    bPdf.addEventListener("click", function () { exportar("pdf"); });
    var bDocx = el("button", null, "baixar .docx");
    bDocx.type = "button";
    bDocx.addEventListener("click", function () { exportar("docx"); });
    acoes.appendChild(bPdf);
    acoes.appendChild(bDocx);
    var link = el("a", "construtor-link", "link desta vista");
    link.href = "#" + serializarEstado(estado);
    acoes.appendChild(link);
    nos.pocos.appendChild(acoes);
  }

  function pintarFatias() {
    TABELA.campos.dimensoes.forEach(function (d) {
      var dim = TABELA.cubo.dims[d.coluna];
      var contagens = contagensPorFatia(TABELA.cubo, estado.sel, d.coluna);
      var selecionados = estado.sel[d.coluna] || [];
      var det = el("details", "fatia");
      if (selecionados.length || fatiaAberta[d.coluna] === true) det.open = true;
      det.addEventListener("toggle", function () { fatiaAberta[d.coluna] = det.open; });
      var sum = el("summary");
      sum.appendChild(el("span", "fatia-nome", d.coluna));
      sum.appendChild(el("span", "fatia-estado", selecionados.length ? selecionados.length + " selecionados" : "todos"));
      det.appendChild(sum);
      var corpo = el("div", "fatia-corpo");
      var idx = [];
      for (var i = 0; i < dim.valores.length; i++) idx.push(i);
      idx.sort(function (a, b) { return contagens[b] - contagens[a] || (dim.valores[a] < dim.valores[b] ? -1 : 1); });
      var lista = el("div", "fatia-lista");
      var busca = null;
      if (dim.valores.length > FATIA_BUSCA) {
        busca = el("input");
        busca.type = "search";
        busca.placeholder = "buscar entre " + formatarValor(dim.valores.length, "contagem") + " valores";
        busca.value = typeof fatiaBusca[d.coluna] === "string" ? fatiaBusca[d.coluna] : "";
        busca.addEventListener("focus", function () { fatiaFoco = d.coluna; });
        corpo.appendChild(busca);
      }
      var aviso = el("div", "fatia-aviso");
      corpo.appendChild(aviso);
      corpo.appendChild(lista);
      function preencher(termo) {
        limpar(lista);
        var t = String(termo || "").toLowerCase();
        var mostrados = 0;
        var casados = 0;
        idx.forEach(function (k) {
          var v = dim.valores[k];
          if (t && v.toLowerCase().indexOf(t) === -1) return;
          casados++;
          if (mostrados >= FATIA_LISTA) return;
          mostrados++;
          var rotulo = el("label", "fatia-valor" + (contagens[k] === 0 ? " zero" : ""));
          var cb = el("input");
          cb.type = "checkbox";
          cb.checked = selecionados.indexOf(v) !== -1;
          cb.addEventListener("change", function () { alternarValor(d.coluna, v); });
          rotulo.appendChild(cb);
          rotulo.appendChild(el("span", "fatia-texto", v === "" ? "(vazio)" : v));
          var n = el("span", "fatia-n", formatarValor(contagens[k], "contagem"));
          n.setAttribute("data-n", String(contagens[k]));
          rotulo.appendChild(n);
          lista.appendChild(rotulo);
        });
        aviso.textContent = mostrados < casados
          ? formatarValor(mostrados, "contagem") + " de " + formatarValor(casados, "contagem") + " valores"
          : formatarValor(casados, "contagem") + " valores";
      }
      if (busca) busca.addEventListener("input", function () { fatiaBusca[d.coluna] = busca.value; preencher(busca.value); });
      preencher(busca ? busca.value : "");
      det.appendChild(corpo);
      nos.fatias.appendChild(det);
      if (busca && fatiaFoco === d.coluna && det.open) busca.focus();
    });
  }

  function pintarResumo(agregado) {
    var n = el("span", "numero", formatarValor(agregado.linhas, "contagem") + " de " + formatarValor(agregado.linhasTotal, "contagem") + " linhas");
    n.setAttribute("data-n", String(agregado.linhas));
    n.setAttribute("data-d", String(agregado.linhasTotal));
    nos.resumo.appendChild(n);
    nos.resumo.appendChild(el("span", null, " · "));
    var f = el("span", "numero", formatarValor(agregado.filtros, "contagem") + " filtros ativos");
    f.setAttribute("data-n", String(agregado.filtros));
    nos.resumo.appendChild(f);
    nos.resumo.appendChild(el("span", null, " · "));
    var limparB = el("button", "secundario mini", "limpar");
    limparB.type = "button";
    limparB.addEventListener("click", function () { estado.sel = {}; gravarHash(); pintar(); });
    nos.resumo.appendChild(limparB);
  }

  function pintarKpis(agregado) {
    var visao = montarVisao(TABELA, estado, agregado, "", "");
    visao.kpis.forEach(function (k) {
      var c = el("div", "cartao kpi");
      c.appendChild(el("div", "kpi-rotulo", k.rotulo));
      var v = el("div", "numero kpi-valor", k.valor);
      v.setAttribute("data-n", String(Math.trunc(k.n)));
      if (k.d !== undefined) v.setAttribute("data-d", String(k.d));
      c.appendChild(v);
      nos.kpis.appendChild(c);
    });
  }

  var PALETA = ["#1a3a52", "#c1121f", "#2a9d8f", "#e9c46a", "#8d5a97", "#f4a261"];

  function pintarGrafico(agregado) {
    var titulo = (agregado.agregacao === "soma" ? "soma de " + agregado.medida : "linhas") +
      (agregado.eixo ? " por " + agregado.eixo : "") + (agregado.serie ? ", série " + agregado.serie : "");
    nos.grafico.appendChild(el("h2", null, titulo));
    if (!agregado.eixo || !agregado.grupos.length) {
      nos.grafico.appendChild(el("p", "construtor-vazio", "sem eixo ou sem linhas na vista"));
      return;
    }
    if (agregado.eixoTotal > agregado.grupos.length) {
      nos.grafico.appendChild(el("p", "construtor-nota", formatarValor(agregado.grupos.length, "contagem") + " de " +
        formatarValor(agregado.eixoTotal, "contagem") + " valores de " + agregado.eixo + " (os maiores)"));
    }
    if (agregado.seriesTotal > agregado.series.length) {
      nos.grafico.appendChild(el("p", "construtor-nota", formatarValor(agregado.series.length, "contagem") + " de " +
        formatarValor(agregado.seriesTotal, "contagem") + " valores de " + agregado.serie + " como série"));
    }
    var largura = 900, altura = 320, mx = 60, my = 20, mb = 90;
    var svg = svgEl("svg", { viewBox: "0 0 " + largura + " " + altura, class: "grafico", role: "img" });
    var series = agregado.series.length ? agregado.series : [null];
    var maximo = 0;
    agregado.grupos.forEach(function (g) {
      var empilhado = 0;
      series.forEach(function (s) {
        var v = s === null ? g.medido : (g.series[s] ? (agregado.agregacao === "soma" ? g.series[s].soma : g.series[s].n) : 0);
        if (estado.visual === "linha") { if (v > maximo) maximo = v; } else empilhado += v;
      });
      if (estado.visual !== "linha" && empilhado > maximo) maximo = empilhado;
    });
    if (maximo <= 0) maximo = 1;
    var areaL = largura - mx - 10, areaA = altura - my - mb;
    var passo = areaL / agregado.grupos.length;
    function y(v) { return my + areaA - (v / maximo) * areaA; }
    svg.appendChild(svgEl("line", { x1: mx, y1: my + areaA, x2: mx + areaL, y2: my + areaA, stroke: "#999" }));
    [0, 0.5, 1].forEach(function (f) {
      var t = svgEl("text", { x: mx - 6, y: y(maximo * f) + 4, "text-anchor": "end", "font-size": 11, fill: "#555" });
      t.textContent = formatarValor(maximo * f, agregado.tipoValor);
      svg.appendChild(t);
    });
    if (estado.visual === "linha") {
      series.forEach(function (s, si) {
        var pontos = agregado.grupos.map(function (g, i) {
          var v = s === null ? g.medido : (g.series[s] ? (agregado.agregacao === "soma" ? g.series[s].soma : g.series[s].n) : 0);
          return (mx + passo * (i + 0.5)).toFixed(1) + "," + y(v).toFixed(1);
        });
        svg.appendChild(svgEl("polyline", { points: pontos.join(" "), fill: "none", stroke: PALETA[si], "stroke-width": 2 }));
      });
    } else {
      agregado.grupos.forEach(function (g, i) {
        var base = my + areaA;
        series.forEach(function (s, si) {
          var v = s === null ? g.medido : (g.series[s] ? (agregado.agregacao === "soma" ? g.series[s].soma : g.series[s].n) : 0);
          var h = v > 0 ? (v / maximo) * areaA : 0;
          var r = svgEl("rect", { x: (mx + passo * i + passo * 0.15).toFixed(1), y: (base - h).toFixed(1), width: (passo * 0.7).toFixed(1), height: h.toFixed(1), fill: PALETA[si] });
          var titulo2 = svgEl("title");
          titulo2.textContent = g.valor + (s === null ? "" : " · " + s) + ": " + formatarValor(v, agregado.tipoValor);
          r.appendChild(titulo2);
          svg.appendChild(r);
          base -= h;
        });
      });
    }
    agregado.grupos.forEach(function (g, i) {
      var t = svgEl("text", { x: (mx + passo * (i + 0.5)).toFixed(1), y: my + areaA + 12, "font-size": 10, fill: "#333",
        transform: "rotate(45 " + (mx + passo * (i + 0.5)).toFixed(1) + " " + (my + areaA + 12) + ")" });
      t.textContent = g.valor.length > 18 ? g.valor.slice(0, 17) + "…" : g.valor;
      svg.appendChild(t);
    });
    nos.grafico.appendChild(svg);
    if (agregado.series.length) {
      var legenda = el("div", "legenda");
      agregado.series.forEach(function (s, si) {
        var item = el("span", "legenda-item");
        var cor = el("span", "legenda-cor");
        cor.style.background = PALETA[si];
        item.appendChild(cor);
        item.appendChild(el("span", null, s === "" ? "(vazio)" : s));
        legenda.appendChild(item);
      });
      nos.grafico.appendChild(legenda);
    }
  }

  // O número que a coluna `j` da grade imprime para o grupo `g`: uma série, ou o total.
  function valorDaCelula(agregado, g, j) {
    if (j > agregado.series.length) return g.medido;
    var gs = g.series[agregado.series[j - 1]];
    return gs ? (agregado.agregacao === "soma" ? gs.soma : gs.n) : 0;
  }

  function pintarGrade(agregado) {
    var visao = montarVisao(TABELA, estado, agregado, "", "");
    nos.grade.appendChild(el("h2", null, "Grade"));
    if (!agregado.eixo) {
      nos.grade.appendChild(el("p", "construtor-vazio", "escolha um eixo"));
      return;
    }
    var nomeCol = colunaDeNome(TABELA.header);
    var comLink = nomeCol === agregado.eixo && mapaPerfil;
    var rolagem = el("div", "tabela-scroll");
    var tabela = el("table", "explorador");
    var thead = el("thead");
    var trh = el("tr");
    visao.grade.cabecalho.forEach(function (c) { trh.appendChild(el("th", null, c)); });
    if (comLink) trh.appendChild(el("th", null, "perfil"));
    thead.appendChild(trh);
    tabela.appendChild(thead);
    var tbody = el("tbody");
    visao.grade.linhas.slice(0, GRADE_TOPO).forEach(function (linha, i) {
      var tr = el("tr");
      linha.forEach(function (c, j) {
        var td = el("td", j === 0 ? null : "num", c === "" && j === 0 ? "(vazio)" : c);
        if (j > 0) td.setAttribute("data-n", String(Math.trunc(valorDaCelula(agregado, agregado.grupos[i], j))));
        tr.appendChild(td);
      });
      if (comLink) {
        var td2 = el("td");
        var caminho = caminhoPerfil(linha[0]);
        if (caminho) {
          var a = el("a", "ver-perfil", "ver perfil");
          a.href = caminho;
          td2.appendChild(a);
        }
        tr.appendChild(td2);
      }
      tbody.appendChild(tr);
    });
    tabela.appendChild(tbody);
    rolagem.appendChild(tabela);
    nos.grade.appendChild(rolagem);
    nos.grade.appendChild(el("p", "construtor-nota", formatarValor(visao.grade.mostradas, "contagem") + " de " +
      formatarValor(visao.grade.total, "contagem") + " valores de " + agregado.eixo));
  }

  // ------------------------------------------------------------------------------------
  // Exportar — a vista atual, com a data do LEITOR e a URL desta vista; nunca uma requisição.
  // ------------------------------------------------------------------------------------
  function exportar(formato) {
    var escritor = typeof window !== "undefined" ? window.PainelExportar : null;
    if (!escritor || !TABELA) { mostrarAviso("exportador indisponível", true); return; }
    var agregado = agregar(TABELA.cubo, estado);
    var hoje = new Date().toISOString().slice(0, 10);
    var url = window.location.href.split("#")[0] + "#" + serializarEstado(estado);
    var visao = montarVisao(TABELA, estado, agregado, hoje, url);
    var bytes = formato === "pdf" ? escritor.pdf(visao) : escritor.docx(visao);
    var tipo = formato === "pdf" ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    var blob = new Blob([bytes], { type: tipo });
    var href = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = href;
    a.download = TABELA.nome + "-relatorio." + formato;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(href); }, 1000);
  }

  // ------------------------------------------------------------------------------------
  function iniciar() {
    if (!raiz) return;
    carregarManifest().then(function (m) {
      manifest = m;
      if (typeof window !== "undefined" && window.PainelFiltros &&
          typeof window.PainelFiltros.montar === "function") {
        var catorze = document.getElementById("catorze-raiz");
        if (catorze) window.PainelFiltros.montar(catorze, m.catorze);
      }
      montarEsqueleto();
      var lido = lerEstado(window.location.hash);
      if (lido) {
        CHAVES_ESTADO.forEach(function (k) { if (lido[k] !== undefined) estado[k] = lido[k]; });
        if (!estado.sel) estado.sel = {};
      }
      if (estado.tabela && nomeValido(estado.tabela)) escolherTabela(estado.tabela);
      else { estado.tabela = null; pintar(); }
    }, function (e) {
      var no = el("div", "aviso erro", "não foi possível carregar o manifesto: " + String(e && e.message ? e.message : e));
      raiz.appendChild(no);
    });
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      ROW_CAP: ROW_CAP,
      TABELA_PESADA_LIMITE: TABELA_PESADA_LIMITE,
      EIXO_TOPO: EIXO_TOPO,
      SERIE_TOPO: SERIE_TOPO,
      FATIA_LISTA: FATIA_LISTA,
      FATIA_BUSCA: FATIA_BUSCA,
      CONTAGEM_DIMENSAO_MAX: CONTAGEM_DIMENSAO_MAX,
      LINHAS: LINHAS,
      COLUNAS_NOME_DEPUTADO: COLUNAS_NOME_DEPUTADO,
      slugify: slugify,
      parseNumero: parseNumero,
      formatarValor: formatarValor,
      criarParserCSV: criarParserCSV,
      emFormaDeAno: emFormaDeAno,
      tiparCampos: tiparCampos,
      construirCubo: construirCubo,
      mascara: mascara,
      contagensPorFatia: contagensPorFatia,
      agregar: agregar,
      ordenar: ordenar,
      montarMapaPerfil: montarMapaPerfil,
      caminhoPerfil: caminhoPerfil,
      serializarEstado: serializarEstado,
      lerEstado: lerEstado,
      montarVisao: montarVisao,
      carregarTabela: carregarTabela,
      __definirManifest: function (m) { manifest = m; },
      __definirMapaPerfil: function (m) { mapaPerfil = m; },
      __obterTabela: function () { return TABELA; },
    };
  } else {
    iniciar();
  }
})();
