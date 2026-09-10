/*
 * OS-082 — entrega (1): as catorze perguntas fundadoras, conferidas contra as 23 telas de
 * canvas a cada construção (`build.py`'s `build_catorze`, escrito em `manifest.json` como
 * `catorze`). Nenhum dado é retypado aqui: este arquivo só DESENHA o que o manifesto já diz
 * — servida (com o link para a tela que já responde) ou, se um dia alguma não for mais
 * servida por tela nenhuma, um filtro nomeado sobre o explorador (hoje: nenhuma precisa,
 * porque as catorze já são q01–q14 e todas as 14 declaram `canvas`).
 *
 * Puro, sem requisição própria: `explorador.js` já buscou `manifest.json` e passa o
 * resultado para `montar()`.
 */
(function (global) {
  "use strict";

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Uma pergunta já servida por uma tela vira um link para ela; uma que não é vira o texto
   * puro da pergunta com uma nota — este segundo ramo não é alcançado hoje (as catorze são
   * todas servidas), mas fica escrito porque "nenhuma silenciosamente ausente" também vale
   * para o dia em que isso deixar de ser verdade. */
  function renderItem(q) {
    var pergunta = esc(q.pergunta_origem);
    if (q.servida && q.canvas) {
      return (
        '<li><a href="' + esc(q.canvas) + '">' + esc(q.titulo || pergunta) + "</a>" +
        '<div class="pergunta-origem-mini">' + pergunta + "</div></li>"
      );
    }
    return (
      "<li>" + pergunta +
      '<div class="pergunta-origem-mini">ainda não respondida por uma tela — ' +
      "explore a tabela relevante abaixo</div></li>"
    );
  }

  /** Monta a seção dentro de `alvo` (um elemento do DOM) a partir de `manifest.catorze` —
   * a lista de 14 que `build_catorze` escreveu. Não faz nada se `alvo` ou a lista faltarem,
   * porque uma construção antiga (sem esta chave) não deve quebrar a página. */
  function montar(alvo, catorze) {
    if (!alvo || !catorze || !catorze.length) return;
    var itens = catorze
      .slice()
      .sort(function (a, b) { return a.indice - b.indice; })
      .map(renderItem)
      .join("");
    var servidas = catorze.filter(function (q) { return q.servida; }).length;
    alvo.innerHTML =
      '<div class="cartao"><h2>As catorze perguntas fundadoras</h2>' +
      "<p>" + servidas + " de " + catorze.length + " já respondidas por uma tela do painel " +
      "interativo — clique para abrir. O que sobra deste explorador é a pergunta que " +
      "nenhuma das catorze previu: filtre qualquer uma das tabelas abaixo.</p>" +
      '<ol class="catorze">' + itens + "</ol></div>";
  }

  var api = { renderItem: renderItem, montar: montar };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.PainelFiltros = api;
  }
})(typeof window !== "undefined" ? window : this);
