# cldf — dados abertos de accountability legislativo do Distrito Federal

Versão 0.46.0 · 106 tabelas · 249 arquivos de painel

Os dados consolidados de accountability legislativo do Distrito Federal que a Câmara
Legislativa declarou formalmente não possuir consolidados, montados a partir da API
pública e dos portais da própria Casa e publicados como dados abertos que qualquer
cidadão pode rederivar ou contestar em vez de simplesmente acreditar.

## Por onde começar

- **O painel** — `painel/index.html`: as perguntas da missão, uma tela por pergunta.
- **O explorador** — `painel/explorador.html`: filtre, agrupe e baixe qualquer tabela.
- **Fontes e metodologia** — `painel/fontes-e-metodologia.html`: o que cada tabela é, de
  onde cada número veio, o que ele **não** diz, e o link de cada arquivo no repositório —
  inclui `data/derived/provenance.json`, as medições e os sinais de qualidade em JSON.

## Os dados

`data/derived/` traz 106 arquivos `.csv` em UTF-8, com BOM para abrirem direto no
Excel. As mesmas tabelas em `.xlsx` ficam no repositório de trabalho e não neste site, por
tamanho.

Toda tabela declara os seus limites junto com os seus números. Onde a fonte se contradiz,
este projeto publica as duas leituras lado a lado em vez de escolher uma; onde a fonte é
silenciosa, publica o silêncio como contagem em vez de preencher.

## O que este projeto não é

Não é da Câmara Legislativa do Distrito Federal e não fala por ela. As fontes são a API de
dados abertos da Casa, o Portal da Transparência, o portal CKAN de dados abertos e a
Biblioteca Digital — todas públicas, todas lidas sem credencial, sempre em série e nunca em
paralelo.

## Licença

Dados: [CC BY-SA 4.0](LICENSE-data) — copie, redistribua, cruze e publique, inclusive
comercialmente, citando a fonte e mantendo a mesma licença em qualquer adaptação. Código e
interface: [PolyForm Noncommercial 1.0.0](LICENSE) — uso não comercial.

## Código-fonte

https://github.com/maximusminus/cldf-painel
