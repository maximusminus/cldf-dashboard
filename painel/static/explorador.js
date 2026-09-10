/*
 * OS-079 — o explorador de tabelas.
 *
 * Hand-written, stdlib-adjacent JavaScript: no library, no CDN, no external host. Works on
 * ONE table at a time (`TABELA_ATUAL`), fetched lazily from `../data/derived/<tabela>.csv` —
 * which is exactly why this page must be served over HTTP and cannot open as a bare file://.
 *
 * Signal 35d, JS side: the explorer performs NO join except the one sanctioned crossing —
 * "ver perfil", a name match against `deputados-chave.csv` that leads to a profile page. A
 * URL fragment (share link) that names a second table stops the load, with the reason printed
 * on screen, before any data request is made for it. See `pararSeNomeiaDuasTabelas` below.
 *
 * Signal 35f: every request this file ever issues is a relative path under this project's own
 * tree (`manifest.json`, `../data/derived/*.csv`) — never an absolute URL, never a host.
 */

(function () {
  "use strict";

  var ROW_CAP = 200000; // signal 35c/BRIEF: declared cap, shown on screen when hit — never a
                         // silent truncation.

  // OS-082 — sinal 35m: o invariante de renderização de taxa vive em `render.js`, carregado
  // antes deste arquivo na página (browser) ou por `require` relativo (node, S2's mesmo
  // padrão). Puro: nenhum estado, nenhuma leitura de DOM.
  var PainelRender = (typeof module !== "undefined" && module.exports)
    ? require("./render.js")
    : (typeof window !== "undefined" ? window.PainelRender : null);

  // OS-082 — RISCO 1 do BRIEF: o limite acima do qual o explorador anuncia o tamanho de uma
  // tabela ANTES de buscá-la, em vez de simplesmente baixá-la. Nenhuma é recusada — só
  // anunciada. Espelha `build.py`'s `TABELA_PESADA_BYTES`; um teste relê os dois literais e
  // confere que nunca divergem.
  var TABELA_PESADA_LIMITE = 5 * 1024 * 1024;

  // OS-082 — as mesmas quatro grafias de coluna de ano que `build.py`'s
  // `_COLUNAS_DE_ANO_CONHECIDAS` já usa para as 23 receitas; um teste confere que as duas
  // listas concordam. Usado só para IMPRIMIR a janela das linhas filtradas (RISCO 3) —
  // nunca para cortar nada: o explorador continua abrindo a tabela publicada inteira.
  var COLUNAS_DE_ANO_CONHECIDAS = ["ano", "exercicio", "ano_exercicio", "ano_do_pagamento"];
  var ANO_4 = /^\d{4}$/;

  var raiz = document.getElementById("explorador-raiz");
  var manifest = null;
  var deputadosChave = null; // loaded lazily, once, ONLY for the "ver perfil" name match
  var TABELA_ATUAL = null;   // { nome, header, rows, truncada, linhasCruas, headerCru }

  var estado = {
    tabela: null,
    filtros: [],       // [{coluna, operador, valor}]
    groupBy: [],        // até 3 colunas
    agregacao: "contagem", // contagem|soma|minimo|maximo|distintos|mediana
    agregarColuna: null,
    pivotColuna: null,
    ordenarPor: null,
    ordemDesc: false,
    grafico: "bar",     // bar|stacked_bar|line|dot
  };

  var CHAVES_ESTADO_PERMITIDAS = [
    "tabela", "filtros", "groupBy", "agregacao", "agregarColuna", "pivotColuna",
    "ordenarPor", "ordemDesc", "grafico",
  ];

  // S5 — the earlier `textContent` -> `innerHTML` round-trip escapes `& < >` and NOT
  // quotes, and this file writes CSV header cells and manifest table names into ATTRIBUTE
  // contexts (`<option value="…">`). CSV content is untrusted upstream content (CODING §1),
  // so the escape closes the quotes too.
  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ------------------------------------------------------------------------------------
  // Signal 35d — the guard. A fragment is refused if it names anything shaped like a SECOND
  // table: any key matching /tabela/i whose value differs from the primary `tabela`, or any
  // array under such a key with more than one element. This is checked BEFORE a single fetch
  // happens for the decoded state.
  // ------------------------------------------------------------------------------------
  function pararSeNomeiaDuasTabelas(candidato) {
    var nomes = {};
    Object.keys(candidato).forEach(function (chave) {
      if (!/tabela/i.test(chave)) return;
      var v = candidato[chave];
      if (typeof v === "string" && v) nomes[v] = true;
      if (Array.isArray(v)) {
        v.forEach(function (x) {
          if (typeof x === "string" && x) nomes[x] = true;
        });
      }
    });
    var distintos = Object.keys(nomes);
    if (distintos.length > 1) {
      throw new Error(
        "35d: este link nomeia mais de uma tabela (" + distintos.join(", ") + "). " +
        "O explorador nunca combina duas tabelas — a única navegação entre tabelas é " +
        "'ver perfil', que segue o nome do deputado até deputados-chave.csv."
      );
    }
    // B4 fix: a fragment naming a table absent from the manifest — including one built to
    // escape data/derived/ (e.g. "../../.ssh/id_ed25519") — is refused HERE, before any
    // fetch is issued for it. `manifest` is always loaded before this function runs
    // (iniciar() awaits carregarManifest() first); if it is somehow unset, fail closed
    // rather than let an unchecked name reach carregarTabela().
    if (distintos.length === 1) {
      var unico = distintos[0];
      if (!manifest || !manifest.tabelas || Object.prototype.hasOwnProperty.call(manifest.tabelas, unico) === false) {
        throw new Error(
          "35d/B4: este link nomeia uma tabela que não está no manifesto (" + unico + ")."
        );
      }
    }
    Object.keys(candidato).forEach(function (chave) {
      if (CHAVES_ESTADO_PERMITIDAS.indexOf(chave) === -1) {
        throw new Error("35d: o link contém um campo que este explorador não reconhece: " + chave);
      }
    });
  }

  function decodificarFragmento() {
    var hash = window.location.hash.replace(/^#/, "");
    if (!hash) return null;
    var obj;
    try {
      obj = JSON.parse(decodeURIComponent(hash));
    } catch (e) {
      mostrarAviso("O link compartilhado não pôde ser lido — formato inválido.", true);
      return null;
    }
    try {
      pararSeNomeiaDuasTabelas(obj);
    } catch (e) {
      mostrarAviso(e.message, true);
      return null;
    }
    return obj;
  }

  function codificarFragmento() {
    var minimo = {};
    CHAVES_ESTADO_PERMITIDAS.forEach(function (k) {
      minimo[k] = estado[k];
    });
    return encodeURIComponent(JSON.stringify(minimo));
  }

  // ------------------------------------------------------------------------------------
  // CSV parsing — small, dependency-free, handles quoted fields and embedded commas/quotes.
  // ------------------------------------------------------------------------------------
  // S6 — the parser is incremental: `consumir` takes any slice of the body, `finalizar`
  // closes the last row. `carregarTabela` feeds it the fetch stream chunk by chunk and
  // CANCELS the response as soon as ROW_CAP rows are in hand, so the one table that trips
  // the cap (folha 2023-2026, 232.197 rows / 72,7 MB) is never fully downloaded, never
  // fully parsed, and never materialised as 232.197 row objects to throw 32.197 away.
  function criarParserCSV(rowCap) {
    var linha = [];
    var campo = "";
    var dentroAspas = false;
    var header = null;
    var rows = [];
    var truncada = false;
    var primeiroCampo = true;
    var pendente = ""; // a `"` that ended a chunk while inside quotes: only the NEXT chunk
                       // says whether it closed the field or was the first half of a `""`.

    // OS-082 \u2014 acceptance (e): the RAW text of the current row, byte for byte as the
    // source wrote it (commas, quotes and escapes included), accumulated in parallel to
    // the per-field parsing above. `linhasCruas[i]` is the exact line that produced
    // `rows[i]` \u2014 what `montarCsvSelecao` writes back, never a `join(",")`
    // reconstruction, which could pick a different quoting style than the source did.
    var linhaCrua = "";
    var linhasCruas = [];
    var headerCru = null;

    function fecharCampo() {
      if (primeiroCampo && header === null && linha.length === 0) {
        campo = campo.replace(/^\uFEFF/, "");
      }
      primeiroCampo = false;
      linha.push(campo);
      campo = "";
    }

    function fecharLinha() {
      fecharCampo();
      var atual = linha;
      linha = [];
      // a `\r` is only part of the line TERMINATOR when it is the last character before
      // the `\n` that closed this line \u2014 never a `\r` in the middle of a field, which
      // stays in the middle of the string.
      var crua = linhaCrua.charAt(linhaCrua.length - 1) === "\r"
        ? linhaCrua.slice(0, -1)
        : linhaCrua;
      linhaCrua = "";
      if (header === null) {
        header = atual;
        headerCru = crua.replace(/^\uFEFF/, "");
        return;
      }
      if (atual.length === 1 && atual[0] === "") return;
      if (rows.length >= rowCap) {
        truncada = true;
        return;
      }
      var obj = {};
      for (var c = 0; c < header.length; c++) {
        obj[header[c]] = atual[c] !== undefined ? atual[c] : "";
      }
      rows.push(obj);
      linhasCruas.push(crua);
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
              if (texto[i + 1] === '"') { campo += '"'; linhaCrua += '""'; i += 2; continue; }
              dentroAspas = false; linhaCrua += '"'; i++; continue;
            }
            campo += c; linhaCrua += c; i++; continue;
          }
          if (c === '"') { dentroAspas = true; linhaCrua += c; i++; continue; }
          if (c === ",") { fecharCampo(); linhaCrua += c; i++; continue; }
          if (c === "\r") { linhaCrua += c; i++; continue; }
          if (c === "\n") { fecharLinha(); i++; continue; }
          campo += c; linhaCrua += c; i++;
        }
      },
      cheio: function () { return truncada; },
      finalizar: function () {
        if (pendente) { pendente = ""; dentroAspas = false; } // um `"` final fecha o campo
        if (campo.length > 0 || linha.length > 0) fecharLinha();
        return {
          header: header || [], rows: rows, truncada: truncada,
          linhasCruas: linhasCruas, headerCru: headerCru || "",
        };
      },
    };
  }

  function parseCSV(texto) {
    var linhas = [];
    var linha = [];
    var campo = "";
    var dentroAspas = false;
    var i = 0;
    var n = texto.length;
    while (i < n) {
      var c = texto[i];
      if (dentroAspas) {
        if (c === '"') {
          if (texto[i + 1] === '"') {
            campo += '"';
            i += 2;
            continue;
          }
          dentroAspas = false;
          i++;
          continue;
        }
        campo += c;
        i++;
        continue;
      }
      if (c === '"') {
        dentroAspas = true;
        i++;
        continue;
      }
      if (c === ",") {
        linha.push(campo);
        campo = "";
        i++;
        continue;
      }
      if (c === "\r") {
        i++;
        continue;
      }
      if (c === "\n") {
        linha.push(campo);
        linhas.push(linha);
        linha = [];
        campo = "";
        i++;
        continue;
      }
      campo += c;
      i++;
    }
    if (campo.length > 0 || linha.length > 0) {
      linha.push(campo);
      linhas.push(linha);
    }
    if (linhas.length && linhas[0][0]) {
      linhas[0][0] = linhas[0][0].replace(/^﻿/, "");
    }
    var header = linhas.length ? linhas[0] : [];
    var rows = [];
    for (var r = 1; r < linhas.length; r++) {
      if (linhas[r].length === 1 && linhas[r][0] === "") continue;
      var obj = {};
      for (var c2 = 0; c2 < header.length; c2++) {
        obj[header[c2]] = linhas[r][c2] !== undefined ? linhas[r][c2] : "";
      }
      rows.push(obj);
    }
    return { header: header, rows: rows };
  }

  function parseNumero(v) {
    if (v === null || v === undefined || v === "") return null;
    var s = String(v).trim();
    if (/^-?\d{1,3}(\.\d{3})*,\d+$/.test(s)) {
      return parseFloat(s.replace(/\./g, "").replace(",", "."));
    }
    if (/^-?\d+(\.\d+)?$/.test(s)) {
      return parseFloat(s);
    }
    return null;
  }

  // ------------------------------------------------------------------------------------
  // Data loading — always relative, always this project's own tree.
  // ------------------------------------------------------------------------------------
  function carregarManifest() {
    return fetch("manifest.json").then(function (resp) {
      if (!resp.ok) throw new Error("não foi possível carregar manifest.json");
      return resp.json();
    });
  }

  function carregarTabela(nome) {
    // B4 defense in depth: never issue a fetch for a name containing a path separator or
    // ".." (a share-link fragment could carry either), and never for a name absent from
    // the manifest this build itself wrote — the ONLY names this explorer is allowed to
    // ask for. A name failing either check never reaches fetch() at all.
    if (typeof nome !== "string" || /[\/\\]|\.\./.test(nome)) {
      return Promise.reject(new Error("35d/B4: nome de tabela inválido: " + nome));
    }
    if (!manifest || !manifest.tabelas || Object.prototype.hasOwnProperty.call(manifest.tabelas, nome) === false) {
      return Promise.reject(new Error("35d/B4: tabela não está no manifesto: " + nome));
    }
    return fetch("../data/derived/" + encodeURIComponent(nome) + ".csv").then(function (resp) {
      if (!resp.ok) throw new Error("não foi possível carregar a tabela " + nome);
      var parser = criarParserCSV(ROW_CAP);
      // S6: stream when the runtime offers a body reader; fall back to the whole text
      // where it does not (an older browser, or a test harness stubbing fetch).
      if (!resp.body || typeof resp.body.getReader !== "function" ||
          typeof TextDecoder === "undefined") {
        return resp.text().then(function (texto) {
          parser.consumir(texto);
          return parser.finalizar();
        });
      }
      var reader = resp.body.getReader();
      var decoder = new TextDecoder("utf-8");
      function passo() {
        return reader.read().then(function (r) {
          if (r.done) {
            parser.consumir(decoder.decode());
            return parser.finalizar();
          }
          parser.consumir(decoder.decode(r.value, { stream: true }));
          if (parser.cheio()) {
            try { reader.cancel(); } catch (e) { /* já encerrado */ }
            return parser.finalizar();
          }
          return passo();
        });
      }
      return passo();
    }).then(function (parsed) {
      return {
        nome: nome, header: parsed.header, rows: parsed.rows, truncada: parsed.truncada,
        linhasCruas: parsed.linhasCruas, headerCru: parsed.headerCru,
      };
    });
  }

  function carregarDeputadosChaveSeNecessario() {
    if (deputadosChave) return Promise.resolve(deputadosChave);
    return carregarTabela("deputados-chave").then(function (t) {
      deputadosChave = t.rows;
      return deputadosChave;
    });
  }

  function slugify(texto) {
    return String(texto)
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "sem-nome";
  }

  // ------------------------------------------------------------------------------------
  // Filter / group / aggregate / pivot / sort — all over ONE table's already-loaded rows.
  // ------------------------------------------------------------------------------------

  // OS-082 — the one predicate both `aplicarFiltros` (used by the group/aggregate
  // pipeline, unchanged) and `filtrarComIndices` (new: acceptance (b)/(e), row-level
  // filtering that must also track each surviving row's ORIGINAL index, to pair it back
  // to its exact raw CSV line for the export) test a row against — written once so the
  // two never drift into testing a row two different ways.
  function linhaPassaFiltro(v, f) {
    if (f.operador === "contem") {
      return String(v || "").toLowerCase().indexOf(String(f.valor || "").toLowerCase()) !== -1;
    }
    if (f.operador === "igual") {
      return String(v || "") === String(f.valor || "");
    }
    if (f.operador === "maior_que") {
      var n1 = parseNumero(v);
      return n1 !== null && n1 > parseFloat(f.valor);
    }
    if (f.operador === "menor_que") {
      var n2 = parseNumero(v);
      return n2 !== null && n2 < parseFloat(f.valor);
    }
    return true;
  }

  function linhaPassaFiltros(row) {
    return estado.filtros.every(function (f) {
      if (!f.coluna) return true;
      return linhaPassaFiltro(row[f.coluna], f);
    });
  }

  function aplicarFiltros(rows) {
    return rows.filter(linhaPassaFiltros);
  }

  // OS-082 — acceptance (b)/(e): the SAME filtering as `aplicarFiltros`, but also
  // returning each surviving row's index in the ORIGINAL, unfiltered array — the index
  // that lines up with `TABELA_ATUAL.linhasCruas`, so the export can hand back the exact
  // source bytes of exactly the rows kept, never a re-serialization.
  function filtrarComIndices(rows) {
    var linhas = [];
    var indices = [];
    rows.forEach(function (r, i) {
      if (linhaPassaFiltros(r)) {
        linhas.push(r);
        indices.push(i);
      }
    });
    return { linhas: linhas, indices: indices };
  }

  function agregar(valores, tipo) {
    if (tipo === "contagem") return valores.length;
    var nums = valores.map(parseNumero).filter(function (v) { return v !== null; });
    if (tipo === "distintos") return new Set(valores).size;
    if (nums.length === 0) return null;
    if (tipo === "soma") return nums.reduce(function (a, b) { return a + b; }, 0);
    if (tipo === "minimo") return Math.min.apply(null, nums);
    if (tipo === "maximo") return Math.max.apply(null, nums);
    if (tipo === "mediana") {
      var s = nums.slice().sort(function (a, b) { return a - b; });
      var mid = Math.floor(s.length / 2);
      return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
    }
    return null;
  }

  function agruparEAgregar(rows) {
    var cols = estado.groupBy.slice(0, 3).filter(Boolean);
    if (cols.length === 0) {
      return { colunas: ["valor"], linhas: [[agregar(rows.map(function (r) { return r[estado.agregarColuna]; }), estado.agregacao)]] };
    }
    var grupos = {};
    var ordem = [];
    rows.forEach(function (r) {
      var chave = cols.map(function (c) { return r[c] || ""; }).join("");
      if (!grupos[chave]) {
        grupos[chave] = [];
        ordem.push(chave);
      }
      grupos[chave].push(r);
    });
    var linhas = ordem.map(function (chave) {
      var partes = chave.split("");
      var subset = grupos[chave];
      var valor = agregar(subset.map(function (r) { return r[estado.agregarColuna]; }), estado.agregacao);
      return partes.concat([valor]);
    });
    return { colunas: cols.concat(["valor"]), linhas: linhas };
  }

  function ordenarLinhas(tabela) {
    if (!estado.ordenarPor) return tabela;
    var idx = tabela.colunas.indexOf(estado.ordenarPor);
    if (idx === -1) return tabela;
    var linhas = tabela.linhas.slice().sort(function (a, b) {
      var va = a[idx], vb = b[idx];
      var na = parseNumero(va), nb = parseNumero(vb);
      var cmp;
      if (na !== null && nb !== null) cmp = na - nb;
      else cmp = String(va).localeCompare(String(vb));
      return estado.ordemDesc ? -cmp : cmp;
    });
    return { colunas: tabela.colunas, linhas: linhas };
  }

  function pivotar(tabela) {
    if (!estado.pivotColuna || tabela.colunas.length < 3) return tabela;
    var idxPivot = tabela.colunas.indexOf(estado.pivotColuna);
    if (idxPivot === -1 || idxPivot >= tabela.colunas.length - 1) return tabela;
    var idxValor = tabela.colunas.length - 1;
    var outrasIdx = tabela.colunas.map(function (_, i) { return i; })
      .filter(function (i) { return i !== idxPivot && i !== idxValor; });
    var chavesPivot = [];
    var linhasPorChave = {};
    var ordemLinhas = [];
    tabela.linhas.forEach(function (linha) {
      var chaveLinha = outrasIdx.map(function (i) { return linha[i]; }).join("");
      var chavePivot = String(linha[idxPivot]);
      if (chavesPivot.indexOf(chavePivot) === -1) chavesPivot.push(chavePivot);
      if (!linhasPorChave[chaveLinha]) {
        linhasPorChave[chaveLinha] = {};
        ordemLinhas.push(chaveLinha);
      }
      linhasPorChave[chaveLinha][chavePivot] = linha[idxValor];
    });
    var colunas = outrasIdx.map(function (i) { return tabela.colunas[i]; }).concat(chavesPivot);
    var linhas = ordemLinhas.map(function (chaveLinha) {
      var base = chaveLinha.split("");
      return base.concat(chavesPivot.map(function (p) { return linhasPorChave[chaveLinha][p] !== undefined ? linhasPorChave[chaveLinha][p] : ""; }));
    });
    return { colunas: colunas, linhas: linhas };
  }

  // ------------------------------------------------------------------------------------
  // Chart rendering — the same four shapes svg.py draws at build time, hand-written here in JS.
  // ------------------------------------------------------------------------------------
  function svgAbertura(w, h) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
      '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="#ffffff" />';
  }

  function desenharGrafico(tabela) {
    var idxValor = tabela.colunas.length - 1;
    var pares = tabela.linhas.map(function (l) {
      return [String(l[0]), parseFloat(l[idxValor]) || 0];
    });
    var w = 640, rotuloW = 200, linhaH = 22;
    var max = Math.max.apply(null, pares.map(function (p) { return p[1]; }).concat([0])) || 1;
    var h = 20 + pares.length * linhaH + 12;
    var svg = svgAbertura(w, h);
    if (estado.grafico === "line") {
      var margemE = 56, margemB = 26, plotW = w - margemE - 16, plotH = h - margemB - 10;
      var n = Math.max(pares.length - 1, 1);
      var pontos = pares.map(function (p, i) {
        var x = margemE + (i / n) * plotW;
        var y = h - margemB - (p[1] / max) * plotH;
        return [x, y];
      });
      svg += '<polyline points="' + pontos.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") +
        '" fill="none" stroke="#2b5f8a" stroke-width="2" />';
      pontos.forEach(function (p) { svg += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.5" fill="#2b5f8a" />'; });
    } else {
      pares.forEach(function (p, i) {
        var y = 8 + i * linhaH;
        var largura = (p[1] / max) * (w - rotuloW - 70);
        svg += '<text x="' + (rotuloW - 8) + '" y="' + (y + 15) + '" font-size="12" text-anchor="end">' + esc(p[0]) + '</text>';
        if (estado.grafico === "dot") {
          var cx = rotuloW + largura;
          svg += '<line x1="' + rotuloW + '" y1="' + (y + 8) + '" x2="' + cx.toFixed(1) + '" y2="' + (y + 8) + '" stroke="#ccc" />';
          svg += '<circle cx="' + cx.toFixed(1) + '" cy="' + (y + 8) + '" r="4" fill="#2b5f8a" />';
        } else {
          svg += '<rect x="' + rotuloW + '" y="' + (y + 3) + '" width="' + largura.toFixed(1) + '" height="14" fill="#2b5f8a" />';
        }
        svg += '<text x="' + (rotuloW + largura + 6).toFixed(1) + '" y="' + (y + 15) + '" font-size="12">' + esc(p[1].toLocaleString("pt-BR")) + '</text>';
      });
    }
    svg += "</svg>";
    return svg;
  }

  // ------------------------------------------------------------------------------------
  // CSV export — Blob, never a fetch/upload anywhere.
  // ------------------------------------------------------------------------------------
  function baixarCSV(tabela) {
    var linhas = [tabela.colunas.join(",")].concat(
      tabela.linhas.map(function (l) {
        return l.map(function (v) {
          var s = v === null || v === undefined ? "" : String(v);
          if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
          return s;
        }).join(",");
      })
    );
    var blob = new Blob([linhas.join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (TABELA_ATUAL ? TABELA_ATUAL.nome : "analise") + "-explorador.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ------------------------------------------------------------------------------------
  // OS-082 — RISCO 3 do BRIEF / acceptance (d): a janela das linhas que produziram um
  // resultado, impressa toda vez — nunca cortada, só relatada. Lê o mesmo conjunto de
  // colunas de ano que as 23 receitas já declaram (`COLUNAS_DE_ANO_CONHECIDAS`, espelhando
  // `build.py`), sobre as linhas JÁ FILTRADAS — nunca sobre a tabela inteira.
  // ------------------------------------------------------------------------------------
  function calcularJanela(linhas) {
    var header = TABELA_ATUAL ? TABELA_ATUAL.header : [];
    var colunaAno = COLUNAS_DE_ANO_CONHECIDAS.filter(function (c) {
      return header.indexOf(c) !== -1;
    })[0];
    if (!colunaAno) {
      return "esta tabela não tem coluna de ano reconhecida (" +
        COLUNAS_DE_ANO_CONHECIDAS.join(", ") + ") — nenhum corte de janela se aplica.";
    }
    var anos = linhas
      .map(function (r) { return String(r[colunaAno] || "").trim(); })
      .filter(function (v) { return ANO_4.test(v); })
      .map(function (v) { return parseInt(v, 10); });
    if (!anos.length) {
      return "coluna de ano " + colunaAno + ": nenhuma linha selecionada tem um ano de " +
        "quatro dígitos legível.";
    }
    var min = Math.min.apply(null, anos);
    var max = Math.max.apply(null, anos);
    return min === max
      ? ("janela dos resultados (" + colunaAno + "): ano " + min + ".")
      : ("janela dos resultados (" + colunaAno + "): entre " + min + " e " + max + ".");
  }

  // ------------------------------------------------------------------------------------
  // OS-082 — entrega (3): a extração. Acceptance (e): o texto retorna com um cabeçalho
  // comentado (tabela de origem, janela, filtros aplicados, data) seguido de linhas que
  // são um SUBCONJUNTO EXATO, byte a byte, das linhas da tabela publicada — nunca uma
  // reconstrução via `join(",")`, que poderia escolher uma grafia de aspas diferente da
  // fonte. `montarCsvSelecao` é puro (só monta a string); `baixarSelecaoCSV` é quem cria
  // o Blob e dispara o download.
  // ------------------------------------------------------------------------------------
  function montarCsvSelecao(info) {
    var linhasCruas = info.indices.map(function (i) { return TABELA_ATUAL.linhasCruas[i]; });
    var cabecalho = TABELA_ATUAL.headerCru || TABELA_ATUAL.header.join(",");
    var filtrosAtivos = estado.filtros.filter(function (f) { return f.coluna; });
    var filtrosTexto = filtrosAtivos.length
      ? filtrosAtivos.map(function (f) {
          return f.coluna + " " + f.operador + " " + JSON.stringify(f.valor || "");
        }).join("; ")
      : "nenhum";
    var comentario = [
      "# tabela de origem: " + TABELA_ATUAL.nome + ".csv",
      "# " + calcularJanela(info.linhas),
      "# filtros aplicados: " + filtrosTexto,
      "# extraído em: " + new Date().toISOString(),
      "# " + info.linhas.length + " de " + TABELA_ATUAL.rows.length + " linhas — " +
        "subconjunto exato da tabela publicada, sem recálculo",
    ].join("\n");
    return comentario + "\n" + [cabecalho].concat(linhasCruas).join("\n") + "\n";
  }

  function baixarSelecaoCSV(info) {
    var blob = new Blob([montarCsvSelecao(info)], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (TABELA_ATUAL ? TABELA_ATUAL.nome : "analise") + "-selecao.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ------------------------------------------------------------------------------------
  // "ver perfil" — the ONE sanctioned cross-table operation: a name match against
  // deputados-chave.csv, never a merge of two arbitrary tables.
  // ------------------------------------------------------------------------------------
  var COLUNAS_NOME_DEPUTADO = ["deputado", "parlamentar", "nome_na_fonte"];

  function linkPerfilSeAplica(row) {
    if (!deputadosChave) return "";
    var col = COLUNAS_NOME_DEPUTADO.filter(function (c) { return c in row; })[0];
    if (!col) return "";
    var nome = row[col];
    var achou = deputadosChave.filter(function (d) {
      return [d.nome_na_api, d.nome_no_painel_de_votacao, d.nome_no_painel_de_emendas, d.nome_nas_diarias, d.unidade_no_documento]
        .indexOf(nome) !== -1;
    })[0];
    var chave = achou ? achou.nome_na_api : nome;
    if (!chave) return "";
    return '<a class="ver-perfil" href="../perfil/' + slugify(chave) + '.html">ver perfil</a>';
  }

  // ------------------------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------------------------
  function mostrarAviso(msg, erro) {
    var el = document.createElement("div");
    el.className = "aviso" + (erro ? " erro" : "");
    el.textContent = msg;
    raiz.insertBefore(el, raiz.firstChild);
  }

  function renderSeletorTabela() {
    var nomes = Object.keys(manifest.tabelas).sort();
    var opts = nomes.map(function (n) {
      return '<option value="' + esc(n) + '"' + (n === estado.tabela ? " selected" : "") + '>' + esc(n) + '</option>';
    }).join("");
    return '<div class="linha-filtro"><span class="rotulo">tabela</span>' +
      '<select id="sel-tabela"><option value="">— escolha —</option>' + opts + '</select></div>';
  }

  // ------------------------------------------------------------------------------------
  // OS-082 — entrega (2): a filtragem interativa (acceptance (b)/(c)). OS-093 achado A:
  // até aqui `estado.filtros` era escrito por controle NENHUM. Cada linha abaixo escreve
  // exatamente um `{coluna, operador, valor}`, e QUALQUER mudança nela re-processa
  // imediatamente — o filtro é a única parte deste explorador que não espera "aplicar".
  // ------------------------------------------------------------------------------------
  var OPERADORES_FILTRO = [
    { valor: "contem", rotulo: "contém" },
    { valor: "igual", rotulo: "é igual a" },
    { valor: "maior_que", rotulo: "maior que" },
    { valor: "menor_que", rotulo: "menor que" },
  ];

  function renderFiltros() {
    if (!TABELA_ATUAL) return "";
    var header = TABELA_ATUAL.header;
    var linhas = estado.filtros.map(function (f, i) {
      var opColuna = header.map(function (c) {
        return '<option value="' + esc(c) + '"' + (c === f.coluna ? " selected" : "") + '>' + esc(c) + '</option>';
      }).join("");
      var opOperador = OPERADORES_FILTRO.map(function (o) {
        return '<option value="' + o.valor + '"' + (o.valor === f.operador ? " selected" : "") + '>' + esc(o.rotulo) + '</option>';
      }).join("");
      return '<div class="filtro-linha" data-i="' + i + '">' +
        '<select class="filtro-coluna" data-i="' + i + '"><option value="">— coluna —</option>' + opColuna + '</select>' +
        '<select class="filtro-operador" data-i="' + i + '">' + opOperador + '</select>' +
        '<input class="filtro-valor" data-i="' + i + '" type="text" value="' + esc(f.valor || "") + '" placeholder="valor">' +
        '<button type="button" class="secundario filtro-remover" data-i="' + i + '">remover</button>' +
        '</div>';
    }).join("");
    return '<div id="filtros-raiz" class="cartao">' +
      '<div class="linha-filtro"><span class="rotulo">filtros (por linha)</span>' +
      '<button type="button" id="btn-add-filtro" class="secundario">+ adicionar filtro</button></div>' +
      '<div class="filtros-lista">' + linhas + '</div></div>';
  }

  function ligarFiltros() {
    var raizFiltros = document.getElementById("filtros-raiz");
    if (!raizFiltros) return;
    var btnAdd = document.getElementById("btn-add-filtro");
    if (btnAdd) {
      btnAdd.addEventListener("click", function () {
        estado.filtros.push({ coluna: "", operador: "contem", valor: "" });
        reRenderFiltros();
      });
    }
    raizFiltros.querySelectorAll(".filtro-coluna").forEach(function (sel) {
      sel.addEventListener("change", function () {
        estado.filtros[parseInt(sel.getAttribute("data-i"), 10)].coluna = sel.value;
        processarEExibir();
      });
    });
    raizFiltros.querySelectorAll(".filtro-operador").forEach(function (sel) {
      sel.addEventListener("change", function () {
        estado.filtros[parseInt(sel.getAttribute("data-i"), 10)].operador = sel.value;
        processarEExibir();
      });
    });
    raizFiltros.querySelectorAll(".filtro-valor").forEach(function (inp) {
      inp.addEventListener("input", function () {
        estado.filtros[parseInt(inp.getAttribute("data-i"), 10)].valor = inp.value;
        processarEExibir();
      });
    });
    raizFiltros.querySelectorAll(".filtro-remover").forEach(function (btn) {
      btn.addEventListener("click", function () {
        estado.filtros.splice(parseInt(btn.getAttribute("data-i"), 10), 1);
        reRenderFiltros();
      });
    });
  }

  function reRenderFiltros() {
    var raizFiltros = document.getElementById("filtros-raiz");
    if (!raizFiltros) return;
    raizFiltros.outerHTML = renderFiltros();
    ligarFiltros();
    processarEExibir();
  }

  // ------------------------------------------------------------------------------------
  // OS-082 — RISCO 2 do BRIEF / sinal 35m: a cifra recalculada (quantas linhas passaram no
  // filtro, de quantas a tabela publicada tem) é uma TAXA — e vive num DOM que nenhuma
  // guarda de build enxerga. `PainelRender.renderizarTaxa` é o único lugar que a escreve,
  // sempre com o seu numerador e o seu denominador no mesmo elemento.
  // ------------------------------------------------------------------------------------
  function renderResumoSelecao(filtradasInfo) {
    var alvo = document.getElementById("resumo-selecao");
    if (!alvo) return;
    var taxa = PainelRender.renderizarTaxa(
      filtradasInfo.linhas.length, TABELA_ATUAL.rows.length,
      { sufixo: " linhas selecionadas" }
    );
    alvo.innerHTML = '<div class="janela">' + taxa + '<br>' +
      esc(calcularJanela(filtradasInfo.linhas).replace(/^./, function (c) { return c.toUpperCase(); })) +
      '</div><div class="linha-filtro">' +
      '<button type="button" id="btn-baixar-selecao" class="secundario">baixar CSV desta ' +
      'seleção (linhas originais)</button></div>';
    var btn = document.getElementById("btn-baixar-selecao");
    if (btn) btn.addEventListener("click", function () { baixarSelecaoCSV(filtradasInfo); });
  }

  function montarPainelControles() {
    if (!TABELA_ATUAL) return "";
    var header = TABELA_ATUAL.header;
    var opcoesColuna = header.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join("");
    var html = '<div class="cartao"><div class="linha-filtro">';
    html += '<span class="rotulo">agrupar por (até 3)</span>';
    for (var i = 0; i < 3; i++) {
      html += '<select class="sel-group" data-i="' + i + '"><option value="">—</option>' + opcoesColuna + '</select>';
    }
    html += '</div><div class="linha-filtro">';
    html += '<span class="rotulo">agregação</span><select id="sel-agregacao">' +
      ["contagem", "soma", "minimo", "maximo", "distintos", "mediana"].map(function (a) {
        return '<option value="' + a + '"' + (a === estado.agregacao ? " selected" : "") + '>' + a + '</option>';
      }).join("") + '</select>';
    html += '<span class="rotulo">sobre a coluna</span><select id="sel-agregar-coluna"><option value="">—</option>' + opcoesColuna + '</select>';
    html += '</div><div class="linha-filtro">';
    html += '<span class="rotulo">gráfico</span><select id="sel-grafico">' +
      ["bar", "stacked_bar", "line", "dot"].map(function (g) {
        return '<option value="' + g + '"' + (g === estado.grafico ? " selected" : "") + '>' + g + '</option>';
      }).join("") + '</select>';
    html += '<span class="rotulo">ordenar por</span><select id="sel-ordenar"><option value="">—</option></select>';
    html += '<label><input type="checkbox" id="chk-desc"> desc</label>';
    html += '<span class="rotulo">pivotar coluna</span><select id="sel-pivot"><option value="">—</option>' + opcoesColuna + '</select>';
    html += '</div><div class="linha-filtro">';
    html += '<button id="btn-aplicar">aplicar</button>';
    html += '<button id="btn-baixar" class="secundario">baixar CSV</button>';
    html += '<button id="btn-compartilhar" class="secundario">link de compartilhamento</button>';
    html += '</div></div>';
    return html;
  }

  // ------------------------------------------------------------------------------------
  // Issue #111 item 8 — every column header carries a mouse-over label. `manifest.tabelas`
  // already declares a `colunas` kind (chave/data/dinheiro/contagem/texto) per real column
  // of the currently-loaded table (build.py's own `infer_kind`); the "valor" column an
  // aggregation produces has no source column, so it is described from the aggregation
  // itself instead.
  // ------------------------------------------------------------------------------------
  var ROTULOS_TIPO_COLUNA = {
    chave: "identificador — usado para juntar linhas, não para somar",
    data: "data, no formato AAAA-MM-DD",
    dinheiro: "valor em reais",
    contagem: "contagem — um número inteiro",
    texto: "texto livre",
  };

  function descricaoColuna(nomeColuna) {
    if (nomeColuna === "valor") {
      return "valor agregado (" + estado.agregacao +
        (estado.agregarColuna ? " de " + estado.agregarColuna : "") + ")";
    }
    var infoTabela = manifest && TABELA_ATUAL && manifest.tabelas ? manifest.tabelas[TABELA_ATUAL.nome] : null;
    var tipo = infoTabela && infoTabela.colunas ? infoTabela.colunas[nomeColuna] : null;
    if (tipo && ROTULOS_TIPO_COLUNA[tipo]) {
      return nomeColuna + " — " + ROTULOS_TIPO_COLUNA[tipo];
    }
    return nomeColuna;
  }

  function renderTabelaResultado(tabela, temPerfil) {
    var thead = "<tr>" + tabela.colunas.map(function (c) {
      return '<th title="' + esc(descricaoColuna(c)) + '">' + esc(c) + "</th>";
    }).join("") +
      (temPerfil ? "<th></th>" : "") + "</tr>";
    var tbody = tabela.linhas.slice(0, 500).map(function (l) {
      var linkPerfil = "";
      if (temPerfil && estado.groupBy.length) {
        var idxNome = tabela.colunas.indexOf(estado.groupBy[0]);
        if (idxNome !== -1) {
          linkPerfil = linkPerfilSeAplica(Object.fromEntries([[estado.groupBy[0], l[idxNome]]].concat(
            COLUNAS_NOME_DEPUTADO.map(function (c) { return [c, l[idxNome]]; })
          )));
        }
      }
      return "<tr>" + l.map(function (v) { return "<td>" + esc(v) + "</td>"; }).join("") +
        (temPerfil ? "<td>" + linkPerfil + "</td>" : "") + "</tr>";
    }).join("");
    return '<div class="tabela-scroll"><table class="explorador"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table></div>' +
      (tabela.linhas.length > 500 ? '<p class="aviso">mostrando as primeiras 500 de ' + tabela.linhas.length + ' linhas agregadas — o CSV baixado contém todas.</p>' : "");
  }

  function processarEExibir() {
    var filtradasInfo = filtrarComIndices(TABELA_ATUAL.rows);
    var filtradas = filtradasInfo.linhas;
    var agregada = agruparEAgregar(filtradas);
    agregada = pivotar(agregada);
    agregada = ordenarLinhas(agregada);
    renderResumoSelecao(filtradasInfo);
    var temPerfil = COLUNAS_NOME_DEPUTADO.some(function (c) { return TABELA_ATUAL.header.indexOf(c) !== -1; });
    var alvo = document.getElementById("resultado");
    if (!alvo) return;
    var html = "";
    if (TABELA_ATUAL.truncada) {
      html += '<div class="aviso">esta tabela tem mais de ' + ROW_CAP.toLocaleString("pt-BR") +
        ' linhas — o limite declarado do explorador; as linhas além do limite não foram carregadas.</div>';
    }
    if (estado.groupBy.length) {
      html += '<div class="cartao">' + desenharGrafico(agregada) + '</div>';
    }
    html += renderTabelaResultado(agregada, temPerfil);
    alvo.innerHTML = html;
    // B2 fix: deputadosChave is loaded ONCE. Before this fix the promise below resolved
    // immediately on every call once cached, so each processarEExibir() scheduled another
    // one forever (an unbounded microtask loop — 2001 re-renders measured with zero
    // interaction). Re-render exactly once, the time the table actually loads.
    if (temPerfil && !deputadosChave) {
      carregarDeputadosChaveSeNecessario().then(processarEExibir).catch(function () {});
    }
  }

  function ligarControles() {
    var painel = document.getElementById("controles");
    if (!painel) return;
    document.querySelectorAll(".sel-group").forEach(function (sel, i) {
      sel.value = estado.groupBy[i] || "";
      sel.addEventListener("change", function () {
        estado.groupBy[i] = sel.value || null;
        estado.groupBy = estado.groupBy.filter(Boolean);
      });
    });
    var selAg = document.getElementById("sel-agregacao");
    selAg.addEventListener("change", function () { estado.agregacao = selAg.value; });
    var selCol = document.getElementById("sel-agregar-coluna");
    selCol.addEventListener("change", function () { estado.agregarColuna = selCol.value || null; });
    var selGrafico = document.getElementById("sel-grafico");
    selGrafico.addEventListener("change", function () { estado.grafico = selGrafico.value; });
    var selPivot = document.getElementById("sel-pivot");
    selPivot.addEventListener("change", function () { estado.pivotColuna = selPivot.value || null; });
    var selOrdenar = document.getElementById("sel-ordenar");
    selOrdenar.addEventListener("change", function () { estado.ordenarPor = selOrdenar.value || null; });
    var chkDesc = document.getElementById("chk-desc");
    chkDesc.addEventListener("change", function () { estado.ordemDesc = chkDesc.checked; });
    document.getElementById("btn-aplicar").addEventListener("click", processarEExibir);
    document.getElementById("btn-baixar").addEventListener("click", function () {
      var filtradas = aplicarFiltros(TABELA_ATUAL.rows);
      var agregada = pivotar(ordenarLinhas(agruparEAgregar(filtradas)));
      baixarCSV(agregada);
    });
    document.getElementById("btn-compartilhar").addEventListener("click", function () {
      window.location.hash = codificarFragmento();
      mostrarAviso("link atualizado — copie a URL da barra de endereço para compartilhar.", false);
    });
  }

  // OS-082 — RISCO 1 do BRIEF / acceptance (b): antes de buscar uma tabela acima do
  // limite, anunciar o tamanho e deixar o leitor escolher — nenhuma é recusada.
  function selecionarTabela(nome) {
    estado.tabela = nome;
    var info = manifest && manifest.tabelas ? manifest.tabelas[nome] : null;
    if (info && typeof info.bytes === "number" && info.bytes > TABELA_PESADA_LIMITE) {
      raiz.innerHTML = renderAvisoTabelaPesada(nome, info);
      ligarSeletor();
      var btn = document.getElementById("btn-carregar-mesmo-assim");
      if (btn) btn.addEventListener("click", function () { carregarEExibirTabela(nome); });
      return;
    }
    carregarEExibirTabela(nome);
  }

  function renderAvisoTabelaPesada(nome, info) {
    var mb = (info.bytes / (1024 * 1024)).toFixed(1).replace(".", ",");
    return renderSeletorTabela() +
      '<div class="aviso tabela-pesada"><p><strong>' + esc(nome) + '</strong> tem ' + mb +
      ' MB — é a tabela publicada inteira. Nenhuma linha é recusada aqui; o download só ' +
      'pode demorar mais.</p>' +
      '<button type="button" id="btn-carregar-mesmo-assim">carregar mesmo assim</button></div>';
  }

  function carregarEExibirTabela(nome) {
    raiz.innerHTML = '<p class="aviso">carregando ' + esc(nome) + '…</p>';
    carregarTabela(nome).then(function (t) {
      TABELA_ATUAL = t;
      renderTudo();
    }).catch(function (e) {
      raiz.innerHTML = renderSeletorTabela();
      ligarSeletor();
      mostrarAviso(String(e.message || e), true);
    });
  }

  function renderTudo() {
    raiz.innerHTML = renderSeletorTabela() +
      renderFiltros() +
      '<div id="controles">' + montarPainelControles() + '</div>' +
      '<div id="resumo-selecao"></div>' +
      '<div id="resultado"></div>';
    ligarSeletor();
    if (TABELA_ATUAL) {
      ligarFiltros();
      ligarControles();
      var selOrdenar = document.getElementById("sel-ordenar");
      TABELA_ATUAL.header.concat(["valor"]).forEach(function (c) {
        var o = document.createElement("option");
        o.value = c; o.textContent = c;
        selOrdenar.appendChild(o);
      });
      processarEExibir();
    }
  }

  function ligarSeletor() {
    var sel = document.getElementById("sel-tabela");
    if (!sel) return;
    sel.addEventListener("change", function () {
      if (sel.value) selecionarTabela(sel.value);
    });
  }

  function iniciar() {
    carregarManifest().then(function (m) {
      manifest = m;
      // OS-082 — entrega (1): as catorze perguntas fundadoras, já conferidas contra as
      // telas de canvas na construção (`build_catorze`) e publicadas em `manifest.catorze`.
      // `filtros.js` só desenha; guardado (não quebra uma construção antiga sem esta chave).
      if (typeof window !== "undefined" && window.PainelFiltros &&
          typeof window.PainelFiltros.montar === "function") {
        window.PainelFiltros.montar(document.getElementById("catorze-raiz"), m.catorze);
      }
      var fragmento = null;
      try {
        fragmento = decodificarFragmento();
      } catch (e) {
        mostrarAviso(String(e.message || e), true);
        fragmento = null;
      }
      if (fragmento && fragmento.tabela) {
        estado = Object.assign(estado, fragmento);
        selecionarTabela(estado.tabela);
      } else {
        renderTudo();
      }
    }).catch(function (e) {
      raiz.innerHTML = '<div class="aviso erro">não foi possível carregar manifest.json — ' + esc(e.message || e) + '</div>';
    });
  }

  // S2 — under Node (a test harness) this file EXPORTS its guards instead of starting
  // itself, so signal 35d's browser half can be EXECUTED rather than grepped. In a
  // browser `module` is undefined, so `iniciar()` runs exactly as before.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      pararSeNomeiaDuasTabelas: pararSeNomeiaDuasTabelas,
      carregarTabela: carregarTabela,
      processarEExibir: processarEExibir,
      criarParserCSV: criarParserCSV,
      esc: esc,
      descricaoColuna: descricaoColuna,
      __definirManifest: function (m) { manifest = m; },
      __definirTabelaAtual: function (t) { TABELA_ATUAL = t; },
      __definirEstado: function (e) { estado = Object.assign(estado, e); },
      __deputadosChaveCarregado: function () { return deputadosChave !== null; },
      // OS-082 — entrega (2)/(3), exportado para que os testes EXECUTEM o filtro/janela/
      // extração em vez de reimplementá-los em Python.
      filtrarComIndices: filtrarComIndices,
      aplicarFiltros: aplicarFiltros,
      calcularJanela: calcularJanela,
      montarCsvSelecao: montarCsvSelecao,
      TABELA_PESADA_LIMITE: TABELA_PESADA_LIMITE,
      COLUNAS_DE_ANO_CONHECIDAS: COLUNAS_DE_ANO_CONHECIDAS,
    };
  } else {
    iniciar();
  }
})();
