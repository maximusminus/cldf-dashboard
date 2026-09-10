/*
 * OS-082 — o invariante de renderização (sinal 35m): uma taxa só existe na tela junto do
 * seu numerador e do seu denominador, no MESMO elemento, e nunca como um `%` solto.
 *
 * `build.py`'s `render_rate_html` já prova isto para todo número calculado NA CONSTRUÇÃO
 * (sinal 35c). O painel dinâmico recalcula uma cifra — quantas linhas passaram no filtro,
 * de quantas a tabela tem — DEPOIS da construção, num DOM que nenhuma guarda de build
 * enxerga (RISCO 2 do BRIEF). Este arquivo é o mesmo invariante, um nível mais estrito: ele
 * não tem a saída "só o numerador" que `render_rate_html` usa para uma contagem simples —
 * quem chama `renderizarTaxa` está SEMPRE pedindo uma taxa, então a única alternativa a
 * emiti-la pareada é não emitir número nenhum, com uma nota dizendo por quê.
 *
 * Puro: nenhuma leitura de DOM, nenhuma requisição, nenhuma mutação. `explorador.js` é quem
 * decide QUANDO chamar e ONDE escrever o resultado.
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

  function ehNumeroValido(v) {
    return typeof v === "number" && !isNaN(v) && isFinite(v);
  }

  // Espelha `fmt_numero` de build.py: inteiro sem casas, fracionário com vírgula pt-BR.
  function formatarNumero(valor) {
    if (!ehNumeroValido(valor)) return "—";
    if (Math.round(valor) === valor) {
      return String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    var partes = valor.toFixed(2).split(".");
    return partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + partes[1];
  }

  // Espelha `_valor_atributo` de build.py: o valor exato em `data-n`/`data-d`, nunca uma
  // forma abreviada — texto e atributo sempre concordam ao centavo.
  function valorAtributo(valor) {
    if (Math.round(valor) === valor) return String(Math.round(valor));
    return valor.toFixed(2);
  }

  /**
   * `renderizarTaxa(numerador, denominador, opcoes)` — o invariante do sinal 35m.
   *
   * Com os dois números: `<span class="taxa" data-n="…" data-d="…">N de D sufixo — P,P%</span>`
   * — o `%` só existe DENTRO deste span, ao lado do `data-n`/`data-d` que o provam.
   *
   * Sem denominador (ou sem numerador) legível: NENHUM número e NENHUM `%` — um span vazio
   * com a nota explicando por quê, nunca um número travestido de taxa.
   */
  function renderizarTaxa(numerador, denominador, opcoes) {
    opcoes = opcoes || {};
    var sufixo = opcoes.sufixo || "";
    var nota = opcoes.nota || "sem denominador para esta seleção";
    if (!ehNumeroValido(numerador) || !ehNumeroValido(denominador)) {
      return (
        '<span class="taxa taxa-vazia">— <span class="nota-vazia">(' + esc(nota) + ")</span></span>"
      );
    }
    var pct = "";
    if (denominador) {
      var pctVal = (numerador / denominador) * 100;
      pct = " — " + pctVal.toFixed(1).replace(".", ",") + "%";
    }
    return (
      '<span class="taxa" data-n="' + valorAtributo(numerador) + '" data-d="' +
      valorAtributo(denominador) + '">' + esc(formatarNumero(numerador)) + " de " +
      esc(formatarNumero(denominador)) + esc(sufixo) + esc(pct) + "</span>"
    );
  }

  var api = {
    esc: esc,
    formatarNumero: formatarNumero,
    valorAtributo: valorAtributo,
    renderizarTaxa: renderizarTaxa,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.PainelRender = api;
  }
})(typeof window !== "undefined" ? window : this);
