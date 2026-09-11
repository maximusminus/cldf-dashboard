/*
 * OS-103 — o exportador do construtor: a vista que está na tela, escrita como um `.pdf` e como
 * um `.docx`, dentro do navegador do leitor, sem biblioteca alguma e sem uma única requisição.
 *
 * Este arquivo é puro. Não conhece o DOM, faz requisição nenhuma, não lê o relógio: recebe uma
 * `visao` — o objeto que `construtor.js` monta a partir da MESMA agregação que pintou os KPIs,
 * o gráfico e a grade — e devolve bytes (`Uint8Array`). A data que vai na proveniência é a que
 * chega dentro da vista, posta lá pelo construtor com o relógio do leitor; posta duas vezes a
 * mesma vista com a mesma data, saem duas vezes os mesmos bytes.
 *
 * Os dois escritores são irmãos dos de `cldf.pdf` e `cldf.docx`, escritos em Python para os
 * relatórios que o build publica (OS-101): a mesma estrutura de objetos no PDF (catálogo,
 * páginas, duas fontes Helvetica em WinAnsi, um par página+fluxo por página, xref de
 * deslocamentos), o mesmo ZIP armazenado sem compressão com três partes no DOCX. A diferença
 * deliberada: aqui as larguras de glifo são APROXIMADAS por classe de caractere (estreito,
 * normal, largo), não a tabela métrica da Helvetica — o que só altera onde uma linha quebra,
 * nunca um número.
 *
 * O caractere de porcentagem aparece neste arquivo exatamente duas vezes, nas literais que o
 * formato PDF exige — o cabeçalho "PDF-1.4" e o "EOF" final — e em mais lugar nenhum (35o).
 */

(function (global) {
  "use strict";

  // ------------------------------------------------------------------------------------
  // Texto → bytes cp1252 (o WinAnsiEncoding das duas fontes)
  // ------------------------------------------------------------------------------------
  var CP1252_EXTRA = {
    "€": 0x80, "…": 0x85, "†": 0x86, "‡": 0x87, "‰": 0x89,
    "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95,
    "–": 0x96, "—": 0x97, "˜": 0x98, "™": 0x99, "Š": 0x8A,
    "š": 0x9A, "Œ": 0x8C, "œ": 0x9C, "Ÿ": 0x9F, "Ž": 0x8E,
    "ž": 0x9E,
  };

  function paraCp1252(texto) {
    var saida = "";
    var s = String(texto);
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80 || (c >= 0xA0 && c <= 0xFF)) {
        saida += String.fromCharCode(c);
      } else if (CP1252_EXTRA[s[i]] !== undefined) {
        saida += String.fromCharCode(CP1252_EXTRA[s[i]]);
      } else {
        saida += "?";
      }
    }
    return saida;
  }

  function escaparPdf(bin) {
    return bin.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }

  function bytesDeBinario(bin) {
    var u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i) & 0xFF;
    return u;
  }

  // ------------------------------------------------------------------------------------
  // Larguras aproximadas, em milésimos de em, por classe de caractere
  // ------------------------------------------------------------------------------------
  var ESTREITOS = " !'.,:;|Iijlft()[]-";
  var LARGOS = "mwMW@";
  var MAIUSCULAS = "ABCDEFGHKNOPQRSUVXYZ";

  function larguraDoCaractere(ch, negrito) {
    var base = ch.normalize ? ch.normalize("NFD")[0] : ch;
    var w;
    if (ESTREITOS.indexOf(base) !== -1) w = 278;
    else if (LARGOS.indexOf(base) !== -1) w = 833;
    else if (MAIUSCULAS.indexOf(base) !== -1) w = 667;
    else w = 556;
    return negrito ? w + 30 : w;
  }

  function larguraDoTexto(texto, tamanho, negrito) {
    var soma = 0;
    var s = String(texto);
    for (var i = 0; i < s.length; i++) soma += larguraDoCaractere(s[i], negrito);
    return soma * tamanho / 1000;
  }

  function encurtar(texto, largura, tamanho, negrito) {
    var s = String(texto);
    if (larguraDoTexto(s, tamanho, negrito) <= largura) return s;
    while (s.length > 1 && larguraDoTexto(s + "…", tamanho, negrito) > largura) s = s.slice(0, -1);
    return s + "…";
  }

  function quebrar(texto, largura, tamanho, negrito) {
    var linhas = [];
    String(texto).split("\n").forEach(function (paragrafo) {
      var atual = "";
      paragrafo.split(" ").forEach(function (palavra) {
        var tentativa = atual ? atual + " " + palavra : palavra;
        if (larguraDoTexto(tentativa, tamanho, negrito) <= largura) {
          atual = tentativa;
          return;
        }
        if (atual) linhas.push(atual);
        if (larguraDoTexto(palavra, tamanho, negrito) <= largura) {
          atual = palavra;
          return;
        }
        var pedaco = "";
        for (var i = 0; i < palavra.length; i++) {
          if (larguraDoTexto(pedaco + palavra[i], tamanho, negrito) > largura && pedaco) {
            linhas.push(pedaco);
            pedaco = "";
          }
          pedaco += palavra[i];
        }
        atual = pedaco;
      });
      linhas.push(atual);
    });
    return linhas;
  }

  // ------------------------------------------------------------------------------------
  // PDF
  // ------------------------------------------------------------------------------------
  var LARGURA = 595;
  var ALTURA = 842;
  var MARGEM = 56;
  var LARGURA_UTIL = LARGURA - 2 * MARGEM;
  var CORPO = 10;
  var ENTRELINHA = 13;
  var TOPO = ALTURA - MARGEM;
  var BASE = MARGEM + 24;
  var PALETA = [[0.10, 0.23, 0.32], [0.76, 0.07, 0.12], [0.16, 0.62, 0.56], [0.91, 0.77, 0.42], [0.55, 0.35, 0.59], [0.96, 0.64, 0.38]];

  function n(x) {
    var s = (Math.round(x * 100) / 100).toString();
    return s;
  }

  function Pagina() {
    this.ops = [];
    this.y = TOPO;
  }
  Pagina.prototype.texto = function (x, y, texto, tamanho, negrito) {
    var fonte = negrito ? "/F2" : "/F1";
    this.ops.push("BT " + fonte + " " + n(tamanho) + " Tf " + n(x) + " " + n(y) + " Td (" +
      escaparPdf(paraCp1252(texto)) + ") Tj ET");
  };
  Pagina.prototype.textoDireita = function (xDireita, y, texto, tamanho, negrito) {
    this.texto(xDireita - larguraDoTexto(texto, tamanho, negrito), y, texto, tamanho, negrito);
  };
  Pagina.prototype.linha = function (x1, y1, x2, y2, espessura) {
    this.ops.push(n(espessura) + " w 0.5 G " + n(x1) + " " + n(y1) + " m " + n(x2) + " " + n(y2) + " l S");
  };
  Pagina.prototype.retangulo = function (x, y, w, h, cor) {
    this.ops.push(n(cor[0]) + " " + n(cor[1]) + " " + n(cor[2]) + " rg " + n(x) + " " + n(y) + " " + n(w) + " " + n(h) + " re f 0 g");
  };
  Pagina.prototype.polilinha = function (pontos, cor, espessura) {
    if (!pontos.length) return;
    var partes = [n(espessura) + " w " + n(cor[0]) + " " + n(cor[1]) + " " + n(cor[2]) + " RG"];
    pontos.forEach(function (p, i) { partes.push(n(p[0]) + " " + n(p[1]) + (i === 0 ? " m" : " l")); });
    partes.push("S 0 G");
    this.ops.push(partes.join(" "));
  };

  function Documento() {
    this.paginas = [new Pagina()];
  }
  Documento.prototype.atual = function () { return this.paginas[this.paginas.length - 1]; };
  Documento.prototype.garantir = function (altura) {
    if (this.atual().y - altura < BASE) this.paginas.push(new Pagina());
    return this.atual();
  };
  Documento.prototype.paragrafo = function (texto, tamanho, negrito, recuo) {
    var linhas = quebrar(texto, LARGURA_UTIL - (recuo || 0), tamanho, negrito);
    var self = this;
    linhas.forEach(function (l) {
      var p = self.garantir(tamanho * 1.3);
      p.y -= tamanho * 1.3;
      p.texto(MARGEM + (recuo || 0), p.y, l, tamanho, negrito);
    });
  };
  Documento.prototype.espaco = function (h) { this.atual().y -= h; };

  function tabelaPdf(doc, cabecalho, linhas) {
    var ncol = cabecalho.length;
    if (!ncol) return;
    var primeira = Math.min(LARGURA_UTIL * 0.45, Math.max(90, larguraDoTexto(cabecalho[0], CORPO, true) + 8));
    linhas.forEach(function (l) {
      var w = larguraDoTexto(String(l[0]), CORPO, false) + 8;
      if (w > primeira) primeira = Math.min(LARGURA_UTIL * 0.45, w);
    });
    var resto = ncol > 1 ? (LARGURA_UTIL - primeira) / (ncol - 1) : 0;
    var larguras = [ncol > 1 ? primeira : LARGURA_UTIL];
    for (var i = 1; i < ncol; i++) larguras.push(resto);

    function cabecalhoNaPagina(p) {
      p.y -= ENTRELINHA;
      var x = MARGEM;
      cabecalho.forEach(function (c, j) {
        if (j === 0) p.texto(x, p.y, encurtar(c, larguras[j] - 4, CORPO, true), CORPO, true);
        else p.textoDireita(x + larguras[j] - 2, p.y, encurtar(c, larguras[j] - 4, CORPO, true), CORPO, true);
        x += larguras[j];
      });
      p.linha(MARGEM, p.y - 3, LARGURA - MARGEM, p.y - 3, 0.6);
      p.y -= 4;
    }
    var p = doc.garantir(ENTRELINHA * 3);
    cabecalhoNaPagina(p);
    linhas.forEach(function (linha) {
      var antes = doc.atual();
      p = doc.garantir(ENTRELINHA);
      if (p !== antes) cabecalhoNaPagina(p);
      p.y -= ENTRELINHA;
      var x = MARGEM;
      linha.forEach(function (c, j) {
        var texto = String(c);
        if (j === 0) p.texto(x, p.y, encurtar(texto === "" ? "(vazio)" : texto, larguras[j] - 4, CORPO, false), CORPO, false);
        else p.textoDireita(x + larguras[j] - 2, p.y, texto, CORPO, false);
        x += larguras[j];
      });
    });
    doc.espaco(4);
  }

  function graficoPdf(doc, grafico) {
    var rotulos = grafico.rotulos || [];
    if (!rotulos.length) return;
    var alturaGrafico = 170;
    var alturaRotulos = 40;
    var p = doc.garantir(alturaGrafico + alturaRotulos + ENTRELINHA * 2);
    p.y -= ENTRELINHA;
    var esquerda = MARGEM + 50;
    var largura = LARGURA_UTIL - 50;
    var topo = p.y;
    var base = topo - alturaGrafico;
    var series = grafico.series && grafico.series.length ? grafico.series : [{ nome: null, valores: grafico.valores }];
    var maximo = 0;
    var i, s;
    for (i = 0; i < rotulos.length; i++) {
      var soma = 0;
      for (s = 0; s < series.length; s++) {
        var v = series[s].valores[i] || 0;
        if (grafico.visual === "linha") { if (v > maximo) maximo = v; } else soma += v;
      }
      if (grafico.visual !== "linha" && soma > maximo) maximo = soma;
    }
    if (maximo <= 0) maximo = 1;
    var passo = largura / rotulos.length;
    function y(v) { return base + (v / maximo) * alturaGrafico; }
    p.linha(esquerda, base, esquerda + largura, base, 0.5);
    p.linha(esquerda, base, esquerda, topo, 0.5);
    [0, 0.5, 1].forEach(function (f) {
      p.textoDireita(esquerda - 4, y(maximo * f) - 3, formatarEixo(maximo * f, grafico.tipoValor), 7, false);
    });
    if (grafico.visual === "linha") {
      for (s = 0; s < series.length; s++) {
        var pontos = [];
        for (i = 0; i < rotulos.length; i++) pontos.push([esquerda + passo * (i + 0.5), y(series[s].valores[i] || 0)]);
        p.polilinha(pontos, PALETA[s] || PALETA[0], 1.2);
      }
    } else {
      for (i = 0; i < rotulos.length; i++) {
        var acumulado = base;
        for (s = 0; s < series.length; s++) {
          var h = ((series[s].valores[i] || 0) / maximo) * alturaGrafico;
          p.retangulo(esquerda + passo * i + passo * 0.15, acumulado, passo * 0.7, h, PALETA[s] || PALETA[0]);
          acumulado += h;
        }
      }
    }
    var cada = Math.max(1, Math.ceil(rotulos.length / 30));
    for (i = 0; i < rotulos.length; i += cada) {
      var rot = encurtar(rotulos[i] === "" ? "(vazio)" : rotulos[i], Math.max(passo * cada - 2, 30), 6, false);
      p.texto(esquerda + passo * i + 1, base - 9, rot, 6, false);
    }
    p.y = base - alturaRotulos;
    if (series.length && series[0].nome !== null) {
      var legenda = series.map(function (sr) { return sr.nome === "" ? "(vazio)" : sr.nome; }).join(" · ");
      doc.paragrafo("séries: " + legenda, 8, false, 0);
    }
  }

  function formatarEixo(valor, tipo) {
    var inteiro = Math.trunc(valor);
    var s = String(Math.abs(inteiro)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (inteiro < 0) s = "-" + s;
    return tipo === "dinheiro" ? "R$ " + s : s;
  }

  function rodape(paginas, titulo) {
    var total = paginas.length;
    paginas.forEach(function (p, i) {
      p.linha(MARGEM, MARGEM + 14, LARGURA - MARGEM, MARGEM + 14, 0.4);
      p.texto(MARGEM, MARGEM + 4, encurtar(titulo, LARGURA_UTIL - 80, 8, false), 8, false);
      p.textoDireita(LARGURA - MARGEM, MARGEM + 4, "página " + (i + 1) + " de " + total, 8, false);
    });
  }

  function textoDosFiltros(visao) {
    if (!visao.filtros || !visao.filtros.length) return ["nenhum filtro em vigor — todas as linhas da tabela"];
    return visao.filtros.map(function (f) {
      return f.coluna + ": " + f.valores.map(function (v) { return v === "" ? "(vazio)" : v; }).join(", ");
    });
  }

  function textoDaProveniencia(visao) {
    var pr = visao.proveniencia || {};
    var linhas = [
      "tabela: " + (pr.tabela || ""),
      "sha256 (manifest.json): " + (pr.sha256 || ""),
      "linhas lidas: " + formatarEixo(pr.linhas || 0, "contagem") + (pr.truncada ? " (tabela cortada no teto do navegador)" : ""),
      "licença dos dados: " + (pr.licenca || ""),
      "vista: " + (pr.url || ""),
      "gerado pelo leitor em: " + (pr.data || ""),
    ];
    return linhas;
  }

  function pdf(visao) {
    var doc = new Documento();
    doc.paragrafo(visao.titulo || "Relatório", 16, true, 0);
    doc.espaco(4);
    if (visao.descricao) doc.paragrafo(visao.descricao, 9, false, 0);
    doc.espaco(6);

    doc.paragrafo("Filtros em vigor", 11, true, 0);
    textoDosFiltros(visao).forEach(function (l) { doc.paragrafo(l, CORPO, false, 10); });
    doc.espaco(6);

    doc.paragrafo("Indicadores", 11, true, 0);
    (visao.kpis || []).forEach(function (k) {
      var p = doc.garantir(ENTRELINHA);
      p.y -= ENTRELINHA;
      p.texto(MARGEM + 10, p.y, k.rotulo + ": ", CORPO, false);
      p.texto(MARGEM + 10 + larguraDoTexto(k.rotulo + ": ", CORPO, false), p.y, k.valor, CORPO, true);
    });
    doc.espaco(6);

    if (visao.grafico && visao.grafico.eixo) {
      doc.paragrafo((visao.grafico.rotuloValor || "") + " por " + visao.grafico.eixo, 11, true, 0);
      graficoPdf(doc, visao.grafico);
      doc.espaco(6);
    }

    doc.paragrafo("Grade", 11, true, 0);
    if (visao.grade && visao.grade.cabecalho && visao.grade.cabecalho.length) {
      tabelaPdf(doc, visao.grade.cabecalho, visao.grade.linhas || []);
      if (visao.grade.total > visao.grade.mostradas) {
        doc.paragrafo(formatarEixo(visao.grade.mostradas, "contagem") + " de " + formatarEixo(visao.grade.total, "contagem") + " valores", 8, false, 0);
      }
    }
    doc.espaco(8);

    doc.paragrafo("Proveniência", 11, true, 0);
    textoDaProveniencia(visao).forEach(function (l) { doc.paragrafo(l, 8, false, 10); });

    rodape(doc.paginas, visao.titulo || "Relatório");

    var objetos = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      null,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    ];
    var kids = [];
    doc.paginas.forEach(function (p, i) {
      var nPagina = 5 + 2 * i;
      kids.push(nPagina + " 0 R");
      objetos.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + LARGURA + " " + ALTURA + "] " +
        "/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents " + (nPagina + 1) + " 0 R >>");
      var fluxo = p.ops.join("\n");
      objetos.push("<< /Length " + fluxo.length + " >>\nstream\n" + fluxo + "\nendstream");
    });
    objetos[1] = "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + doc.paginas.length + " >>";

    var saida = "%PDF-1.4\n";
    var deslocamentos = [];
    objetos.forEach(function (corpo, i) {
      deslocamentos.push(saida.length);
      saida += (i + 1) + " 0 obj\n" + corpo + "\nendobj\n";
    });
    var inicioXref = saida.length;
    saida += "xref\n0 " + (objetos.length + 1) + "\n0000000000 65535 f \n";
    deslocamentos.forEach(function (d) {
      var s = String(d);
      while (s.length < 10) s = "0" + s;
      saida += s + " 00000 n \n";
    });
    saida += "trailer\n<< /Size " + (objetos.length + 1) + " /Root 1 0 R >>\nstartxref\n" + inicioXref + "\n%%EOF\n";
    return bytesDeBinario(saida);
  }

  // ------------------------------------------------------------------------------------
  // DOCX
  // ------------------------------------------------------------------------------------
  var W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  var R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

  var CONTENT_TYPES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    "</Types>";

  var ROOT_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    "</Relationships>";

  var SECT_PR = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
    '<w:pgMar w:top="1120" w:right="1120" w:bottom="1120" w:left="1120" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>';

  var BORDA = "<w:tblBorders>" + ["top", "left", "bottom", "right", "insideH", "insideV"].map(function (lado) {
    return "<w:" + lado + ' w:val="single" w:sz="4" w:space="0" w:color="999999"/>';
  }).join("") + "</w:tblBorders>";

  function escaparXml(valor) {
    return String(valor).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function run(texto, negrito, tamanho) {
    var props = '<w:rFonts w:ascii="Helvetica" w:hAnsi="Helvetica" w:cs="Helvetica"/>';
    if (negrito) props += "<w:b/>";
    if (tamanho) props += '<w:sz w:val="' + tamanho + '"/><w:szCs w:val="' + tamanho + '"/>';
    // Uma quebra de linha no texto vira <w:br/>, como em cldf/docx.py — uma ementa que
    // começa por uma quebra sai igual no .pdf e no .docx (revisão da OS-103).
    var partes = String(texto).split("\n").map(function (p) {
      return '<w:t xml:space="preserve">' + escaparXml(p) + "</w:t>";
    });
    return "<w:r><w:rPr>" + props + "</w:rPr>" + partes.join("<w:br/>") + "</w:r>";
  }

  function paragrafo(texto, negrito, tamanho, recuo) {
    var props = '<w:spacing w:after="60"/>';
    if (recuo) props += '<w:ind w:left="' + recuo + '"/>';
    return "<w:p><w:pPr>" + props + "</w:pPr>" + run(texto, negrito, tamanho) + "</w:p>";
  }

  function celula(texto, negrito, largura, direita) {
    var jc = direita ? '<w:jc w:val="right"/>' : "";
    return '<w:tc><w:tcPr><w:tcW w:w="' + largura + '" w:type="dxa"/></w:tcPr>' +
      "<w:p><w:pPr>" + jc + "</w:pPr>" + run(texto === "" ? "(vazio)" : texto, negrito, 18) + "</w:p></w:tc>";
  }

  function tabela(cabecalho, linhas) {
    var ncol = cabecalho.length;
    var total = 9666;
    var primeira = ncol > 1 ? Math.round(total * 0.4) : total;
    var resto = ncol > 1 ? Math.round((total - primeira) / (ncol - 1)) : 0;
    var larguras = [primeira];
    for (var i = 1; i < ncol; i++) larguras.push(resto);
    var grid = "<w:tblGrid>" + larguras.map(function (w) { return '<w:gridCol w:w="' + w + '"/>'; }).join("") + "</w:tblGrid>";
    var linha = function (cels, negrito) {
      return "<w:tr>" + cels.map(function (c, j) { return celula(String(c), negrito, larguras[j], j > 0); }).join("") + "</w:tr>";
    };
    return '<w:tbl><w:tblPr><w:tblW w:w="' + total + '" w:type="dxa"/>' + BORDA + "</w:tblPr>" + grid +
      linha(cabecalho, true) + linhas.map(function (l) { return linha(l, false); }).join("") + "</w:tbl>";
  }

  function documento(visao) {
    var partes = [];
    partes.push(paragrafo(visao.titulo || "Relatório", true, 32, 0));
    if (visao.descricao) partes.push(paragrafo(visao.descricao, false, 18, 0));
    partes.push(paragrafo("Filtros em vigor", true, 22, 0));
    textoDosFiltros(visao).forEach(function (l) { partes.push(paragrafo(l, false, 20, 300)); });
    partes.push(paragrafo("Indicadores", true, 22, 0));
    (visao.kpis || []).forEach(function (k) {
      partes.push('<w:p><w:pPr><w:spacing w:after="60"/><w:ind w:left="300"/></w:pPr>' +
        run(k.rotulo + ": ", false, 20) + run(k.valor, true, 20) + "</w:p>");
    });
    if (visao.grafico && visao.grafico.eixo) {
      partes.push(paragrafo("Gráfico: " + (visao.grafico.rotuloValor || "") + " por " + visao.grafico.eixo +
        " — o desenho está na versão .pdf; os valores estão na grade abaixo.", false, 18, 0));
    }
    partes.push(paragrafo("Grade", true, 22, 0));
    if (visao.grade && visao.grade.cabecalho && visao.grade.cabecalho.length) {
      partes.push(tabela(visao.grade.cabecalho, visao.grade.linhas || []));
      if (visao.grade.total > visao.grade.mostradas) {
        partes.push(paragrafo(formatarEixo(visao.grade.mostradas, "contagem") + " de " + formatarEixo(visao.grade.total, "contagem") + " valores", false, 16, 0));
      }
    }
    partes.push(paragrafo("Proveniência", true, 22, 0));
    textoDaProveniencia(visao).forEach(function (l) { partes.push(paragrafo(l, false, 16, 300)); });
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
      '<w:document xmlns:w="' + W + '" xmlns:r="' + R + '"><w:body>' + partes.join("") + SECT_PR + "</w:body></w:document>";
  }

  // ZIP armazenado (método 0), data fixa 1980-01-01, CRC-32 calculado aqui.
  var TABELA_CRC = (function () {
    var t = new Uint32Array(256);
    for (var i = 0; i < 256; i++) {
      var c = i;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = TABELA_CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function utf8(texto) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(texto);
    var bin = unescape(encodeURIComponent(texto));
    return bytesDeBinario(bin);
  }

  function u16(v) { return [v & 0xFF, (v >>> 8) & 0xFF]; }
  function u32(v) { return [v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF]; }

  function zipArmazenado(partes) {
    var DATA_DOS = 33;   // 1980-01-01
    var HORA_DOS = 0;
    var locais = [];
    var central = [];
    var deslocamento = 0;
    partes.forEach(function (parte) {
      var nome = utf8(parte.nome);
      var dados = parte.bytes;
      var crc = crc32(dados);
      var cabecalho = [].concat(
        u32(0x04034B50), u16(20), u16(0), u16(0), u16(HORA_DOS), u16(DATA_DOS),
        u32(crc), u32(dados.length), u32(dados.length), u16(nome.length), u16(0)
      );
      locais.push({ cabecalho: cabecalho, nome: nome, dados: dados });
      central.push([].concat(
        u32(0x02014B50), u16(20), u16(20), u16(0), u16(0), u16(HORA_DOS), u16(DATA_DOS),
        u32(crc), u32(dados.length), u32(dados.length), u16(nome.length), u16(0), u16(0),
        u16(0), u16(0), u32(0), u32(deslocamento)
      ).concat(Array.prototype.slice.call(nome)));
      deslocamento += cabecalho.length + nome.length + dados.length;
    });
    var tamanhoCentral = 0;
    central.forEach(function (c) { tamanhoCentral += c.length; });
    var fim = [].concat(u32(0x06054B50), u16(0), u16(0), u16(partes.length), u16(partes.length),
      u32(tamanhoCentral), u32(deslocamento), u16(0));
    var total = deslocamento + tamanhoCentral + fim.length;
    var saida = new Uint8Array(total);
    var pos = 0;
    function por(arr) { for (var i = 0; i < arr.length; i++) saida[pos++] = arr[i]; }
    locais.forEach(function (l) { por(l.cabecalho); por(l.nome); por(l.dados); });
    central.forEach(por);
    por(fim);
    return saida;
  }

  function docx(visao) {
    return zipArmazenado([
      { nome: "[Content_Types].xml", bytes: utf8(CONTENT_TYPES) },
      { nome: "_rels/.rels", bytes: utf8(ROOT_RELS) },
      { nome: "word/document.xml", bytes: utf8(documento(visao)) },
    ]);
  }

  var api = {
    pdf: pdf,
    docx: docx,
    paraCp1252: paraCp1252,
    larguraDoTexto: larguraDoTexto,
    quebrar: quebrar,
    crc32: crc32,
    documentoXml: documento,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.PainelExportar = api;
})(typeof window !== "undefined" ? window : this);
