# Tabelas publicadas

Cada tabela aqui vem acompanhada da consulta que a produziu. **Você não precisa acreditar em
nenhum número desta pasta: você pode refazê-lo.**

Coleta das proposições realizada a partir de **21 de agosto de 2026**; das votações, em
**26–28 de agosto de 2026**. Fontes: a API pública da Câmara Legislativa do Distrito Federal e o
Painel de Votação do seu Portal da Transparência. Licença dos dados: **CC BY-SA 4.0**
([`../../LICENSE-data`](../../LICENSE-data)) — re-escolhida na OS-083 para seguir a mesma
licença que a maioria dos pacotes de `dados.cl.df.gov.br` já declara.

## O que existe hoje

| Arquivo | Linhas | O que traz |
|---|---|---|
| `proposicoes-apresentadas-por-ano-e-especie.csv` / `.xlsx` | 52 | proposições **apresentadas** por ano e espécie, 2022–2026 |
| `proposicoes-apresentadas-por-autor.csv` / `.xlsx` | 930 | as mesmas proposições, por autor e espécie, em **duas contagens** — **substituída**, ver abaixo |
| `proposicoes-apresentadas-e-aprovadas-por-ano-e-especie.csv` / `.xlsx` | 52 | **dataset 1**: apresentadas **e o que aconteceu com elas**, por ano e espécie |
| `proposicoes-apresentadas-e-aprovadas-por-autor.csv` / `.xlsx` | 921 | dataset 1 com autoria, por ano, espécie e autor — chave `autor_id` |
| `proposicoes-por-autor-e-ano.csv` / `.xlsx` | 173 | dataset 1 resumido: quanto cada autor apresentou e quanto foi aprovado, por ano |
| `proposicoes-honorificas-comemorativas-e-mocoes.csv` / `.xlsx` | 3.952 | **dataset 2**: a **relação nominal** — uma linha por proposição honorífica, comemorativa ou moção, com ementa e veredito |
| `sessoes-plenarias-quorum.csv` / `.xlsx` | 2 | sessões plenárias, total de presentes e se atingiram quórum — **cobertura parcial**, ver seção própria abaixo |
| `votacoes-por-ano-e-tipo.csv` / `.xlsx` | 8 | **votações nominais × simbólicas, por ano**, com favoráveis, contrários e abstenções |
| `votacoes-detalhe.csv` / `.xlsx` | 3.370 | uma linha por matéria votada, com a apuração e a ementa |
| `votos-nominais-por-deputado.csv` / `.xlsx` | 9.065 | **como cada deputado votou**, matéria por matéria |
| `proposicoes-do-executivo-por-ano-e-especie.csv` / `.xlsx` | 19 | **dataset 6**: as proposições de **iniciativa do Poder Executivo**, por ano e espécie — aprovadas no texto original, aprovadas com emendas, rejeitadas ou pendentes |
| `proposicoes-do-executivo.csv` / `.xlsx` | 571 | a **relação nominal** das mesmas proposições, uma linha por proposição, com quantas emendas foram acatadas |
| `convocacoes-de-autoridades.csv` / `.xlsx` | 26 | **dataset 10**: uma linha por **requerimento de convocação** — quem seria convocado, e o que a Casa decidiu |
| `comissoes-parlamentares-de-inquerito.csv` / `.xlsx` | 5 | **dataset 11**: uma linha por **requerimento que pede a criação de uma CPI** — com as assinaturas, e com **duas colunas vazias que são o achado**, ver seção própria |
| `comissoes-parlamentares-de-inquerito-assinaturas.csv` / `.xlsx` | 63 | quem assinou cada um desses requerimentos, nome a nome |
| `tempo-de-tramitacao-por-ano-e-especie.csv` / `.xlsx` | 52 | **dataset 12**: quanto tempo levou a tramitação, por ano e espécie — **distribuição, nunca média** — e as **duas** colunas de sem deliberação |
| `proposicoes-sem-deliberacao.csv` / `.xlsx` | 21.764 | a **relação nominal** das proposições que nunca foram deliberadas, com há quantos dias cada uma está aberta e a data a que esse número se refere |
| `frequencia-deputados-em-plenario-por-ano.csv` / `.xlsx` | 173 | **dataset 14**: quantas sessões de **plenário** cada deputado frequentou, por ano — **leia a seção própria antes de citar o percentual** |
| `presencas-em-plenario-por-sessao.csv` / `.xlsx` | 15.819 | uma linha por **(sessão, deputado presente)** — a matéria-prima da tabela acima |
| `conferencia-presenca-pdf-x-painel.csv` / `.xlsx` | 29 | a conferência entre **duas fontes independentes** das mesmas 2 sessões: a Lista de Presença em PDF e o Painel de Votação |
| `emendas-loa-por-deputado.csv` / `.xlsx` | 3.286 | **dataset 8**: uma linha por emenda parlamentar à LOA, 2023–2026, com parlamentar, partido e as medidas de valor do Painel de Emendas Parlamentares — **leia a seção própria antes de citar `partido` ou `status_execucao`** |
| `emendas-loa-por-deputado-e-ano.csv` / `.xlsx` | 107 | a tabela acima por (ano, parlamentar, partido) |
| `emendas-loa-cobertura.csv` / `.xlsx` | 6 | o que o painel traz por exercício e o que está publicado |
| `sessoes-plenarias-por-sessao.csv` / `.xlsx` | 1.259 | **dataset 13, segunda leitura**: toda sessão que `DM_SESSAO` nomeia, 2020–2026, com presença registrada ou não — **leia a seção própria antes de ler `quorum_atingido` como "cancelada"** |
| `proposicoes-painel-conferencia.csv` / `.xlsx` | 46 | **dataset 1, segunda superfície**: por ano e sigla, quantas proposições a API JSON tem e quantas o Painel de Proposições tem, e **cada diferença partida em cinco colunas** — leia a seção própria antes de citar o 5.099 de 2024 |
| `proposicoes-painel-tema.csv` / `.xlsx` | 26.565 | uma linha por (proposição, tema) como o painel classifica — 48 temas, uma classificação que a API não traz |
| `proposicoes-painel-autoria.csv` / `.xlsx` | 24.580 | uma linha por (proposição, autor) do painel, com `tipo_autor` — um tipo que a API não traz |
| `verba-indenizatoria-por-deputado-e-mes.csv` / `.xlsx` | 1.008 | o Quadro Demonstrativo da CLDF: nove rubricas, gasto e teto, por deputado e mês |
| `repasse-duodecimo-por-mes.csv` / `.xlsx` | 60 | o duodécimo mês a mês, previsto ao lado do recebido |
| `despesa-por-estagio-e-mes.csv` / `.xlsx` | 55 | empenhado, liquidado e pago — três estágios, nunca três despesas |
| `empenhos-detalhados.csv` / `.xlsx` | 7.198 | uma nota de empenho por linha; o credor é só nome |
| `pagamentos-em-ordem-cronologica.csv` / `.xlsx` | 6.313 | uma ordem bancária por linha, com a ultrapassagem derivada das duas datas |
| `conferencia-da-cadeia-da-despesa.csv` / `.xlsx` | 5 | as quatro superfícies por ano, nenhuma eleita como a certa |
| `fornecedores-do-contrato-central.csv` / `.xlsx` | 572 | um credor por linha, por CNPJ verificado no dígito |
| `verba-indenizatoria-por-comprovante.csv` / `.xlsx` | 2.226 | uma nota por linha, sem CPF nenhum, com a classificação verbatim da fonte |
| `conferencia-verba-comprovantes-x-quadro.csv` / `.xlsx` | 1.013 | as duas publicações do mesmo gasto: 100 batem, 729 meses só têm o Quadro |
| `verba-indenizatoria-fornecedores.csv` / `.xlsx` | 233 | quem recebeu, pelo CNPJ que confere; 81 atendem mais de um gabinete |
| `diarias-por-beneficiario.csv` / `.xlsx` | 163 | um pagamento de diária por linha, com o período de afastamento e o Ato da Mesa que o autorizou — R$ 1.090.115,28 |
| `ausencias-e-afastamento-autorizado.csv` / `.xlsx` | 96 | as faltas às ordinárias partidas entre as cobertas por afastamento autorizado (**93**) e as demais (**3.493**) — sem veredito |
| `ordinarias-em-afastamento-autorizado.csv` / `.xlsx` | 102 | cada ordinária dentro de um período autorizado, com o Ato; 9 delas com o deputado presente |
| `conferencia-diarias-planilha-x-portal-de-dados.csv` / `.xlsx` | 9 | planilha mensal contra portal de dados abertos, 2026: 6 de 7 meses conferidos batem |
| `ausencias-em-votacoes-nominais.csv` / `.xlsx` | 96 | por deputado e sessão legislativa: presente na sessão e **não registrou voto** (1.606 no período), com os dois denominadores lado a lado |
| `ausencias-por-votacao-nominal.csv` / `.xlsx` | 482 | uma linha por votação nominal: presentes no dia, votantes, e a diferença |
| `frequencia-em-sessoes-ordinarias.csv` / `.xlsx` | 96 | presença nas **sessões ordinárias** de cada sessão legislativa, com o `limite_regimental` ao lado e a partição por quórum — **contagens, nunca veredito** |
| `sessoes-ordinarias-por-dia-da-semana.csv` / `.xlsx` | 13 | quantas ordinárias cada dia da semana reuniu, e quantas não atingiram quórum |
| `producao-por-deputado.csv` / `.xlsx` | 25 | **uma linha por deputado da 9ª Legislatura**: apresentadas por espécie, aprovadas/rejeitadas/pendentes, mediana de dias até deliberar, emendas do gabinete por desfecho, presença com primeira e última sessão, LOA ao centavo, pareceres da CCJ por veredito — **contagens, nunca taxa; leia a seção própria antes de ordenar por qualquer coluna** |
| `licitacoes-e-dispensas.csv` / `.xlsx` | 357 | **a contratação, procedimento a procedimento**: 197 licitações e 160 dispensas/cotações, com estimado, adjudicado e a economia feita aqui — leia a seção própria antes de somar economia |
| `compras-por-modalidade-e-ano.csv` / `.xlsx` | 17 | as 340 compras por **origem**, ano e modalidade — PNCP e ComprasNet são duas séries e não se somam |
| `contratos-vigentes.csv` / `.xlsx` | 395 | um contrato, ata, acordo ou convênio por linha, **com CNPJ, gestor e fiscais** — a única superfície da contratação que traz registro |
| `obras.csv` / `.xlsx` | 5 | as obras em execução, ligadas à compra pelo número do pregão |
| `empresas-sancionadas.csv` / `.xlsx` | 11 | as empresas que a Casa impediu de licitar, com o que os contratos e os pagamentos dizem delas — **sem veredito** |
| `conferencia-contratacao-x-pagamento.csv` / `.xlsx` | 297 | por CNPJ: o que foi contratado ao lado do que foi pago (OS-062) e do que vem de gabinete (OS-060) |
| `despesa-por-classificacao-orcamentaria.csv` / `.xlsx` | 3.238 | **no que a Casa gasta**: unidade orçamentária, ano, mês, função, subfunção, natureza da despesa e fonte, com empenhado, liquidado e pago — **as colunas `*_rotulo` estão vazias e isso é o achado**; leia a seção própria |
| `despesa-por-funcao-e-subfuncao.csv` / `.xlsx` | 40 | a soma por ano, função e subfunção — **duas funções e oito subfunções é o universo inteiro**; nenhuma fatia é publicada como coluna |
| `despesa-por-natureza-e-ano.csv` / `.xlsx` | 213 | a soma por ano e natureza, com os dígitos separados por posição — **72 valores são 36 naturezas em duas grafias**; leia a seção própria antes de agrupar |
| `transferencias-voluntarias-recebidas.csv` / `.xlsx` | 60 | as transferências voluntárias recebidas, mês a mês — **todos os 60 meses são zero** |
| `conferencia-classificacao-x-total.csv` / `.xlsx` | 55 | o detalhamento da Casa somado ao lado do total que a Casa publica — **fecham ao centavo nos 55 meses** |
| `folha-de-pagamento-por-pessoa-e-mes-2017-2018.csv` | 25.151 | **a folha, no grão da fonte**: uma linha por pessoa, por folha e por mês — 7ª legislatura (2017-09 →). **Só `.csv`**; leia a seção própria antes de somar |
| `folha-de-pagamento-por-pessoa-e-mes-2019-2022.csv` | 186.522 | a mesma tabela, 8ª legislatura. **Só `.csv`** |
| `folha-de-pagamento-por-pessoa-e-mes-2023-2026.csv` | 232.197 | a mesma tabela, 9ª legislatura. **Só `.csv`** |
| `folha-por-pessoa-e-ano.csv` / `.xlsx` | 24.183 | por matrícula e ano, com `meses_com_registro` **ao lado de** `linhas`: quando os dois diferem, a pessoa esteve em mais de uma folha no mês |
| `folha-por-cargo-e-ano.csv` / `.xlsx` | 1.195 | a soma por cargo e ano, sempre com `matriculas_distintas` ao lado de `linhas` |
| `folha-por-lotacao-e-mes.csv` / `.xlsx` | 17.713 | a soma por lotação e mês |
| `folha-por-tipo-e-mes.csv` / `.xlsx` | 645 | a soma por `Tipo` e mês — **INATIVO, PENSIONISTA e PENSAO ESPECIAL entram**, como a fonte os publica |
| `vinculos-de-pessoal.csv` / `.xlsx` | 8.714 | o vínculo como período: primeiro e último mês, com admissão, aposentadoria e desligamento — **o calendário de mandato que faltava** |
| `tabela-de-remuneracao-vigente.csv` / `.xlsx` | 5.050 | as tabelas de remuneração em formato longo, **cada célula com a `fonte_legal` que a própria fonte cita** |
| `conferencia-quadro-mensal-x-consolidado.csv` / `.xlsx` | 108 | as duas publicações da mesma folha, mês a mês — **35 meses em ambas, 0 divergências** |
| `conferencia-folha-x-natureza.csv` / `.xlsx` | 104 | a folha ao lado da dotação em que é empenhada — **os dois números não medem o mesmo ato**; leia a seção própria |
| `deputados-chave.csv` / `.xlsx` | 25 | as quatro grafias de cada nome e a chave que as une — toda linha da tabela acima passa por aqui |
| `leis-orcamentarias-dotacao.csv` | 106.367 | **a dotação votada**, linha a linha, 2010–2025 — uma linha por (ano, documento, unidade orçamentária, função, subfunção, natureza, fonte), com `tipo_documento` dizendo se é `PROPOSTA` ou `FINAL`. **Só `.csv`**: o `.xlsx` equivalente tem 208 MB e o GitHub recusa arquivos acima de 100 MB |
| `creditos-adicionais-por-lei.csv` / `.xlsx` | 127 | **os créditos adicionais**, um por lei — acréscimos, decréscimos e o total movimentado; os dois lados fecham a zero nas 127 |
| `creditos-adicionais-por-emenda.csv` | 25.443 | o detalhe: uma linha por emenda de cada crédito, com a classificação de origem e a de destino. **Só `.csv`**, por consistência com a tabela acima — o `.xlsx` tem 62 MB, acima dos 50 MB que o GitHub recomenda |
| `conferencia-loa-x-creditos.csv` / `.xlsx` | 51.764 | a dotação votada ao lado do que os créditos moveram, por classificação — **só 1.996 chaves (3,9 %) aparecem nas duas fontes**, e isso é o achado, não uma falha |
| `campos-atomicos.csv` / `.xlsx` | 2.591 | **o mapa de campos**: cada campo atômico que o acervo bruto guarda, com o tipo, o rótulo e a descrição que a fonte escreveu (ou `n/d`), o arquivo de origem, o módulo e as colunas publicadas que alimenta — OS-104; e, desde a OS-106, `campo_normalizado`, a chave que ESTE projeto computa a partir da grafia (caixa, acentos e separadores dobrados), ao lado dela |
| `colunas-publicadas.csv` / `.xlsx` | 1.287 | cada coluna das outras 102 tabelas, com o campo atômico que carrega ou as referências de que foi computada, declarados em código pelo módulo produtor — OS-104; `campo_normalizado` desde a OS-106 |
| `campos-unicos.csv` / `.xlsx` | 2.550 | **o mapa de campos, um campo por linha**: uma linha por (fonte, entidade, `campo_normalizado`), com as grafias que a fonte usa, os arquivos, os tipos, rótulos e descrições originais e as colunas publicadas, unidos por `;` — uma dobra de `campos-atomicos`, não uma leitura nova — OS-106 |
| `provenance.json` | — | a regra de cada tabela e a lista das consultas que as originaram |

> **Duas tabelas desta versão são publicadas só em `.csv`, e isto é uma decisão registrada, não um arquivo que faltou.** O `.xlsx` deste projeto é escrito sem compressão desde a versão 0.3.0, para que os mesmos dados produzam sempre os mesmos bytes e qualquer pessoa possa reconferir o arquivo. O preço é o tamanho: `leis-orcamentarias-dotacao` tem 22 MB em `.csv` e teria 208 MB em `.xlsx`, acima do limite rígido de 100 MB por arquivo do GitHub — o envio foi de fato recusado. `creditos-adicionais-por-emenda` tem 9 MB e 62 MB, abaixo do limite rígido e acima do recomendado, e acompanha a primeira por consistência. **Nenhuma linha e nenhuma coluna ficam de fora**: o `.csv` publicado é a tabela inteira. Quem usa planilha precisa importar o `.csv` em vez de abrir o `.xlsx` — no LibreOffice e no Excel, *Dados → De texto/CSV*, com UTF-8 e vírgula como separador.


**Cobertura, e ela NÃO é a mesma em todas as tabelas.** Proposições: **2022–2026** (22.748
registros). Sessões: **duas sessões de agosto de 2026**, não a janela inteira. Votações:
**2023–2026**. Presenças em plenário: **2020–2026** (961 sessões) — a janela **mais larga** deste
repositório, e ela começa dois anos antes de todas as outras. Qualquer comparação entre famílias tem
de levar essa diferença junto.
As convocações herdam **as duas janelas ao mesmo tempo**: são identificadas em 2022–2026, mas o
desfecho só pode vir de 2023–2026 — por isso o `REQ 3334/2022` aparece sem deliberação publicada.
As CPIs cobrem **2022–2026**, a janela do acervo de proposições, e duas CPIs que o próprio acervo
cita ficam de fora por serem anteriores a ela — ver a seção do dataset 11.
O tempo de tramitação e a relação das proposições sem deliberação cobrem **2022–2026** pelo mesmo
motivo, e daí sai um limite que o número esconde: a proposição mais antiga desta relação está aberta
há **1.662 dias**, e esse máximo é o limite da coleta, não o limite da Casa.

> **Correção publicada em 27/08/2026.** Até esta versão estas duas tabelas de proposições traziam
> **somente 2024** e este texto dizia que *"os anos 2022, 2023 e 2025 ainda não foram coletados"*.
> **Isso era falso desde a versão 0.2.0**: a coleta 2022–2025 tinha sido feita e ficou no acervo
> local sem nunca ser reexportada, e o texto continuou afirmando o contrário. As tabelas agora
> refletem o acervo — de 4.932 para 22.748 registros. **Os números de 2024 não mudaram** (a soma
> de 2024 continua exatamente 4.932); o que havia era ausência, não erro.

## Legislaturas anteriores — as 7 tabelas de arquivo

**Nenhuma linha foi retirada desta pasta e nenhuma tabela foi despublicada.** O que mudou na
OS-086 é o painel: ele conta **só a 9ª legislatura, 2023–2026**, com 2022 ao lado como linha de
base da legislatura anterior. As sete tabelas abaixo são inteiramente anteriores a 2023, portanto
**nenhuma delas alimenta qualquer número da legislatura atual** — elas continuam aqui, continuam
recalculáveis, e o painel as reúne numa seção declarada, "Legislaturas anteriores".

| Arquivo | O que é, e de quando |
|---|---|
| `folha-de-pagamento-por-pessoa-e-mes-2012-2016.csv` | folha de pagamento de 2012 a 2016 — 7ª legislatura e anteriores |
| `folha-de-pagamento-por-pessoa-e-mes-2017-2018.csv` | folha de pagamento de 2017 e 2018 — 7ª legislatura |
| `folha-de-pagamento-por-pessoa-e-mes-2019-2022.csv` | folha de pagamento de 2019 a 2022 — 8ª legislatura, a anterior a esta |
| `emendas-loa-execucao-2021-2022.csv` / `.xlsx` | execução das emendas parlamentares à LOA em 2021 e 2022 — 8ª legislatura |
| `concurso-2018-aprovados-por-cargo-e-categoria.csv` / `.xlsx` | concurso público de 2018 — lista de aprovados, por cargo e categoria |
| `concurso-2018-nomeados.csv` / `.xlsx` | concurso público de 2018 — nomeações publicadas |
| `concurso-2018-funil.csv` / `.xlsx` | concurso público de 2018 — do aprovado ao empossado |

**As outras 95 tabelas não são "atuais" por serem desta lista ou daquela.** Muitas delas — a
folha 2023–2026, a LOA, os créditos adicionais, as proposições — publicam anos anteriores a 2023
no mesmo arquivo, e continuam publicando. É o painel que corta, receita por receita, nomeando a
coluna de ano de cada tabela; a tabela publicada aqui não muda de bytes por causa disso. Quem
quiser a série inteira lê o `.csv`, ou abre o explorador do painel, que não corta nada.

## O que estas tabelas NÃO dizem

> **Atualização de 27/08/2026 — esta seção era verdadeira e deixou de ser.** Até esta versão ela
> dizia, corretamente, que *"nenhuma coluna aqui diz se uma proposição foi aprovada"*. As três
> tabelas de **dataset 1** publicadas hoje dizem. O texto original fica abaixo, riscado pela data,
> porque explica **por que** custou tanto: os campos `situacaoProposicao` e `parecer` vêm nulos em
> todo registro do endpoint de listagem, e o resultado só existe proposição por proposição — foram
> **22.748 consultas individuais**, uma por proposição, para chegar aos vereditos.

**As duas tabelas antigas** (`proposicoes-apresentadas-por-ano-e-especie` e
`proposicoes-apresentadas-por-autor`) continuam sem dizer nada sobre aprovação, e continuam
publicadas com os mesmos bytes. Nelas, **"apresentadas" significa apresentadas, e mais nada.**

## Dataset 1 — apresentadas **e** aprovadas

As três tabelas novas respondem à primeira das quatorze perguntas que originaram este projeto:
*proposições apresentadas e aprovadas, por ano e por espécie, com autoria*.

Cada linha traz `apresentadas` e depois **cinco colunas de resultado, que somam exatamente
`apresentadas`**:

| Coluna | O que é | Total 2022–2026 |
|---|---|---|
| `aprovadas` | chegou a *Sanção, Veto ou Promulgação* no próprio histórico da proposição | **978** |
| `rejeitadas` | chegou a *Arquivar* | **6** |
| `pendentes` | ainda em tramitação, sem nenhum dos dois marcadores | **2.967** |
| `nao_se_aplica` | o CLDF **não registra veredito** para esta espécie | **18.797** |
| `inclassificavel` | a regra falhou (histórico vazio, ou dois marcadores na mesma data) | **0** |

### `nao_se_aplica` não quer dizer "nenhuma aprovada"

É a maior coluna da tabela, e ela é uma constatação sobre o registro, não uma lacuna deste
projeto. Indicação (12.138), Requerimento (3.616) e Moção (3.029) — três das oito espécies que a
pergunta original cita pelo nome — são **lidas e encerradas administrativamente**, nunca votadas a
favor ou contra, e o sistema do próprio CLDF não carrega veredito nenhum para elas. **Ausência e
zero são fatos diferentes, e estas tabelas não os confundem.**

### `inclassificavel` vale 0 e está publicada assim de propósito

É o estado de falha da própria regra. Publicá-la valendo zero em toda linha é a afirmação de que a
regra **nunca falhou uma vez** em 22.748 registros — uma afirmação que você pode conferir, em vez
de uma que você teria de aceitar.

### Não há coluna de percentual, e isso é deliberado

Uma "taxa de aprovação" precisaria de um denominador, e o denominador honesto aqui é
`aprovadas + rejeitadas + pendentes` — que para a maioria das espécies é zero. Uma taxa calculada
sobre `apresentadas` dividiria por um número que inclui 18.797 registros aos quais o conceito não
se aplica. Aqui estão as contagens; a razão que você conseguir defender, você monta.

### `aprovada` significa "aprovada pela Casa", e nada além

Em nenhum registro o histórico distingue **sancionada**, **vetada** ou **promulgada sobre veto** —
o que o Governador faz com um projeto aprovado é ato do Executivo, fora do sistema da Câmara.
Nenhuma tabela aqui pode ser lida como "virou lei".

### A tabela por autor que esta substitui

`proposicoes-apresentadas-e-aprovadas-por-autor` usa `autor_id`, o identificador estruturado que a
própria API devolve em `/proposicao/autores`: **57 autores reais** — 39 deputados de duas
legislaturas, 13 comissões, e Mesa Diretora, Poder Executivo, Defensoria Pública do DF, Tribunal de
Contas do DF e Sugestão Legislativa.

`proposicoes-apresentadas-por-autor`, publicada antes, divide o **campo de texto** `autoria` num
separador e chega a 351 nomes distintos só em 2024. As duas discordam sobre quem assinou o quê, e
**a correta é a nova**. A antiga **continua publicada, com os mesmos bytes, e não foi recalculada**
— para que nenhum número já baixado e citado por terceiros mude debaixo de quem o citou. Use a
nova; a antiga fica como registro do que já foi publicado.

**Nas duas tabelas por autor a advertência é a mesma:** uma proposição coassinada aparece na linha
de cada signatário, então as colunas **não somam entre autores**. Nas 22.748 proposições, as linhas
proposição × autor são **28.688** — um excesso de **5.940** por coautoria, publicado como número em
`provenance.json`. Para totais exatos, use a tabela por ano e espécie.

**Uma proposição não tem autor declarado** (a API responde com lista vazia): ela é contada como
apresentada na tabela por espécie e não aparece em nenhuma linha de autor. O número está em
`provenance.json`, em `proposicoes_sem_autor_declarado`.

## Dataset 2 — a relação nominal das honoríficas, comemorativas e moções

`proposicoes-honorificas-comemorativas-e-mocoes` é uma **lista, não uma contagem**: uma linha por
proposição, com número, ano, espécie, autoria, ementa e veredito. **3.952 linhas, 2022–2026.**

A regra que decide o que entra e em que categoria está escrita por inteiro em
[`../../docs/specs/DESIGN-dataset2.md`](../../docs/specs/DESIGN-dataset2.md), e **cada linha
publicada traz a cláusula que a colocou ali** (coluna `clausula`). Nenhuma categoria desta tabela
é uma opinião sem endereço.

| Categoria | Linhas | O que é |
|---|---:|---|
| `mocao` | 3.034 | **toda** Moção. Decidida pela espécie, nunca por palavra-chave |
| `titulo_honorifico` | 480 | o título de Cidadão Honorário ou Benemérito **concedido** a alguém |
| `data_comemorativa` | 353 | institui o Dia/Semana/Mês, ou inclui no Calendário Oficial de Eventos |
| `denominacao` | 67 | dá nome a logradouro, praça, escola, teatro ou equipamento público |
| `indeterminada` | 18 | pertence à família, e a regra não sabe dizer a qual das quatro |
| **Total** | **3.952** | |

### Se você for filtrar por categoria, leia isto antes

**As 18 linhas `indeterminada` não são lixo nem erro.** São proposições que comprovadamente
pertencem a esta família — **criam** uma medalha, **reconhecem** uma comenda, **regulam** como um
título é concedido, ou **revogam** um título já concedido — e que a regra não consegue atribuir a
uma das quatro categorias. Exemplos reais, do próprio acervo:

> PR 39/2024 — "Institui o titulo de Cidadão Pioneiro de Brasília" *(cria o título; não o concede
> a ninguém)*
> PDL 234/2024 — "Revoga o Decreto Legislativo nº 2.386 de 2023 que concedeu o título de Cidadão
> Honorário de Brasília concedido ao Sr. Ricardo Cappelli" *(retira uma honraria)*

**Quem filtrar por `categoria = 'mocao'` (ou qualquer outra) não as verá, e o denominador que
usar estará menor do que o conjunto real.** O número está aqui e em `provenance.json` justamente
para que isso seja descoberto sem ler a tabela inteira. A exportação também verifica, toda vez,
que a soma das categorias é igual ao total de linhas: a coluna `categoria` não pode deixar de
responder por tudo sem que a publicação falhe.

### `data_comemorativa` contém eventos, não só datas

O **Calendário Oficial de Eventos do DF é um calendário de eventos**, e a CLDF põe datas
comemorativas e competições esportivas na mesma lista. A regra não separa as duas coisas **porque
a fonte não separa**:

> PL 1526/2025 — "Institui e inclui no calendário oficial de eventos do Distrito Federal o
> **IRONMAN 70.3 Brasília**."

**48 das 353 linhas** desta categoria são desse tipo (`data_comemorativa_que_e_evento_e_nao_data`
em `provenance.json`). A regra **não foi estreitada para escondê-las**: estreitá-la excluiria
esses 48 registros da tabela por inteiro, trocando uma linha mal rotulada por uma linha ausente —
e uma linha ausente é invisível.

### O que ficou de fora, e por decisão declarada

**Requerimento, Indicação, Recurso, Questão de Ordem e Proc foram excluídos pela espécie**, antes
de qualquer palavra-chave. As ementas dessas espécies falam **sobre** uma honraria em vez de
concedê-la — *"Requer a realização de Sessão Solene para outorga do Título de Cidadão Honorário
ao Senhor Fulano"* — e mantê-las listaria a mesma honraria duas e três vezes, além de misturar um
ato da Casa com um pedido dirigido a outra pessoa. **536 proposições** foram excluídas por essa
regra apesar de carregarem sinal honorífico, e o número está em `provenance.json`.

**O nome do homenageado não é uma coluna.** "Relação nominal" quer dizer uma linha por
proposição, não extração de nomes próprios: adivinhar o nome de uma pessoa em texto livre e
publicá-lo como campo estruturado é outro produto, e mais arriscado. Quem quer o homenageado lê
a coluna `ementa`, que traz as palavras do próprio registro.

### As outras colunas

- **`veredito`** segue a mesma regra do dataset 1. A maioria das linhas lê `nao_se_aplica`, e
  **isso não quer dizer reprovada**: para Moção o sistema da CLDF não registra veredito nenhum.
  Ver a seção do dataset 1 acima, que explica isso por inteiro.
- **`subtipo_mocao`** (`louvor`, `aplauso`, `congratulacao`, `pesar`, `outra`) é **descritivo** e
  nunca foi usado para incluir ou excluir linha alguma. Vazio fora de Moção. **`outra` inclui as
  52 moções de repúdio** — o oposto de uma homenagem —, e a contagem está em `provenance.json`.
- **`autores` e `autor_ids`** são listas de coautoria separadas por `; `, na ordem que a fonte
  declara, vindas do `autor_id` estruturado e nunca do campo de texto `autoria`. São uma lista,
  **não uma chave**: para contagens por autor, use as tabelas do dataset 1.
- **`ementa`** é publicada literalmente como consta no acervo, sem correção de espaços,
  maiúsculas, aspas ou erros de digitação.

### Quanto disto foi conferido à mão

**60 linhas — 12 de cada categoria — foram lidas contra a própria ementa. 2 divergências**, ambas
do tipo descrito acima (evento no lugar de data). O registro linha a linha, com as ementas e o
procedimento para refazer exatamente a mesma amostra a partir do `.csv` publicado, está em
[`../../docs/specs/dataset2-conferencia-manual.md`](../../docs/specs/dataset2-conferencia-manual.md).
**Zero divergências nunca foi a exigência; publicar o número é.**

## As duas colunas de autoria, e por que são duas

O campo `autoria` da API **não é o nome de um autor**: é uma lista de coautoria, escrita como
`"Deputado A, Deputado B, Deputado C"`. Em 2024 existem **351 strings distintas de `autoria`
para 36 autores reais**. Quem agrupar pelo campo bruto vai inventar trezentos parlamentares.

Por isso a tabela traz duas contagens, e **as duas estão certas**:

| Coluna | O que conta | Exemplo: Deputado Ricardo Vale, 2024 |
|---|---|---|
| `apresentadas_como_autor_unico` | proposições em que a pessoa assina sozinha | **129** |
| `apresentadas_com_coautoria` | proposições em que a pessoa aparece, sozinha ou acompanhada | **228** |

A segunda coluna é o mesmo número que o filtro `autoria` da própria API devolve. **Ela não
pode ser somada entre autores**: uma proposição com três signatários aparece nas três linhas.
Se você quer "quantas proposições existem", use a tabela por espécie: ela soma exatamente
**4.932 em 2024** e **22.748 no período inteiro**.

## Sessões e quórum — cobertura parcial, declarada

`sessoes-plenarias-quorum` vem de uma fonte diferente das outras duas: não a API, e sim a **Lista
de Presença** que a CLDF publica em PDF para cada sessão plenária
(`cl.df.gov.br/sessoes-plenarias`). `quorum_atingido` é **derivado por este projeto**, não um
campo que a CLDF declara: conta como atingido quando `total_presentes` ≥ 13 de 24 (maioria
absoluta, art. 20, II da Lei Complementar nº 13/1996) — o limiar exato que a fonte usa para
"quórum de abertura de sessão", especificamente, não foi encontrado na pesquisa; toda linha
declara essa ressalva na própria coluna `quorum_source`.

**Cobertura: 2 sessões** (64ª e 65ª Ordinárias, agosto de 2026), não a janela 2022–2026. A tabela
publicada não é reprodutível pelos mesmos dois comandos abaixo (`harvest`/`export`): o PDF da
Lista de Presença não pode ser lido por um script determinístico (a explicação técnica está em
[`../../docs/specs/DESIGN-sessoes.md`](../../docs/specs/DESIGN-sessoes.md)), então cada sessão
publicada aqui foi lida por um modelo, não por código — `PYTHONPATH=src python3 -m cldf.sessao`
refaz apenas a busca dos PDFs, não a extração dos dados.

**A coluna `data` publicava `18/08/2026` e passa a publicar `2026-08-18`.** Toda outra data
derivada por este projeto na camada publicada sempre foi ISO (`AAAA-MM-DD`); esta não era, porque
o valor vinha do PDF na grafia do próprio documento e nada o normalizava no caminho. Quem tiver
baixado esta tabela antes de 2026-09-05 tem duas células na grafia antiga: são as mesmas duas
datas, escritas de outro jeito, e nenhum outro valor da tabela mudou. A partir daqui a camada
inteira é verificada antes de qualquer byte ser escrito — uma coluna nomeada como data carrega
uma data ISO, está vazia, ou pertence a uma coluna que a tabela declara publicar verbatim da
fonte (é o caso, e o único, da coluna `data` de `verba-indenizatoria-por-comprovante`, que é
texto livre da própria fonte).

## Votações — o que estas três tabelas são, e as quatro armadilhas

Vêm de uma **terceira fonte**: o **Painel de Votação** do Portal da Transparência da CLDF, que é
um relatório Power BI publicado pela própria Câmara. **O dado é da CLDF; o transporte é da
Microsoft.** Toda leitura aqui é citada ao painel e à data em que foi lida — nunca a "a CLDF diz".

**Período: 2023–2026**, uma legislatura, a que tomou posse em janeiro de 2023. A fonte publica
desde 04/02/2020; os anos anteriores **não foram coletados por escolha, não por limite da fonte**.

> **Mudança de 28/08/2026, e ela NÃO é uma correção.** As três tabelas de votação passaram a trazer
> `as_of` **2026-08-27** no lugar de **2026-08-26**. **Nenhum outro valor mudou** — 8, 3.370 e 9.065
> linhas, idênticas coluna a coluna quando se ignora o `as_of`. O motivo é a seção logo abaixo: a
> fonte se atualiza todo dia, esta entrega leu a fonte de novo, e a coluna existe justamente para
> que isso apareça em vez de passar despercebido.

### 1. A fonte se atualiza todo dia, e por isso existe a coluna `as_of`

O modelo por trás do painel tem atualização diária. `as_of` traz a data da última atualização que
a **própria fonte declara**. Duas coletas em dias diferentes podem divergir **sem que nada esteja
errado** — uma correção lá em cima, uma sessão a mais. Por isso a promessa de reprodutibilidade
deste projeto, para estas três tabelas, é precisa: **refazer a partir da evidência guardada dá os
mesmos bytes**; refazer a consulta ao vivo é outra coisa, é uma checagem de deriva, e ela informa
em vez de reprovar.

### 2. `co_materia` é REUTILIZADO — a mesma matéria pode ser votada duas vezes

A fonte usa o mesmo `co_materia` para ocasiões diferentes, inclusive em anos diferentes (as
matérias 3109 e 3112 são votadas em dois anos), e **não publica nenhuma coluna que distinga uma
ocasião da outra**. A chave real é `(co_materia, tipo_votacao, ano)`. Por isso um parlamentar pode
aparecer duas vezes na mesma matéria com votos diferentes — são duas votações, não um erro. **Este
projeto não inventou um número de turno que a fonte não fornece.**

### 3. `INVÁLIDO` e `NÃO SE APLICA` não são deputados

Numa votação simbólica não há posição individual, e a fonte registra isso pondo um marcador no
lugar do nome — **`NÃO SE APLICA` em 2023–2024 e `INVÁLIDO` em 2025–2026**, dois nomes para a mesma
coisa. Esses **2.891 registros foram removidos** de `votos-nominais-por-deputado` (o total está em
`provenance.json`) e continuam no acervo local. Publicá-los criaria um deputado que não existe com
milhares de votos.

### 4. Ausência não é abstenção

Quem não aparece numa votação **não está registrado como ausente, nem como abstenção**. `ABSTENCAO`
e `NAO INFORMADO` são valores que a própria fonte registra para quem estava lá. Contar ausências a
partir destas tabelas é inventar um dado que a fonte não tem.

### Como conferir sem acreditar em nós

Os números anuais desta tabela foram medidos **duas vezes, por consultas diferentes**: uma que
agrega por ano e outra que desce até o voto individual. As duas batem em todas as 3.370 votações e
em todos os quatro anos. Se uma coluna tivesse sido lida errado, as duas divergiriam — é essa
divergência que o programa procura antes de publicar qualquer coisa.

## Dataset 6 — o que a Câmara fez com os projetos do Governo

`proposicoes-do-executivo-por-ano-e-especie.csv` / `.xlsx` — **19 linhas.**
`proposicoes-do-executivo.csv` / `.xlsx` — **571 linhas, uma por proposição, 2022–2026.**

A pergunta é a sexta das quatorze: **das proposições que o Poder Executivo mandou para a Câmara,
quantas foram aprovadas como vieram, quantas foram aprovadas com emendas (e quantas emendas foram
acatadas), e quantas foram rejeitadas.**

| | 2022–2026 |
|---|---:|
| proposições de iniciativa do Executivo | **571** |
| aprovadas no texto original | **182** |
| aprovadas com emendas | **130** |
| rejeitadas | **1** |
| ainda pendentes | **258** |
| emendas acatadas | **5.188** |

**São duas tabelas e elas dizem a mesma coisa em dois níveis.** A primeira agrega por ano e
espécie; a segunda lista proposição por proposição. Elas são conferidas **célula a célula** a cada
publicação e nada é publicado se discordarem — duas tabelas que batem no total geral e discordam
linha a linha pareceriam certas em qualquer resumo que alguém escrevesse.

### Quem entra, e quem fica de fora

Entra quem tem `autoria` igual a **`Poder Executivo`** — uma string única e literal, nunca
misturada com o nome de um deputado. O campo `governador` não existe como autoria nesta fonte
(0 registros). A mesma identificação é conferida contra a autoria **estruturada** da API
(`autor_id` 6), e as duas leituras apontam exatamente as mesmas 571 proposições.

Ficam de fora, e o número está publicado porque exclusão sem tamanho é exclusão que ninguém pode
pesar: **142** proposições de **Comissão** e **37** da **Mesa Diretora** — o Legislativo iniciando,
não o Executivo. Doze delas são assinadas por uma comissão **junto com deputados**.

### Antes de citar `aprovada_no_texto_original`: este é o rótulo mais fraco dos quatro

Os outros três são lidos de um campo. Este é uma **ausência** — nenhuma emenda daquela proposição
termina com status `Aprovado(a)` —, e uma ausência vale o que valer a cobertura do registro.

**E a cobertura tem buraco.** A Câmara abre prazo de emenda, recebe emendas, e às vezes **não
registra o que foi feito delas**: são **1.646 emendas em 195 proposições** que aparecem no registro
de tramitação e nunca recebem um status. Onde isso acontece numa proposição aprovada sem nenhuma
emenda acatada, o rótulo se apoia no **silêncio** da fonte e não na resposta dela.

**São 22 das 182**, e a maior é a **LOA de 2023** (`PL 2992/2022`): 19 emendas protocoladas e
assinadas, nenhuma decidida no registro. Essas linhas **estão marcadas na própria tabela** — a
coluna `original_com_emenda_nao_decidida` na tabela agregada, e `emendas_registradas` maior que
zero com `emendas_decididas` igual a zero na relação. **A regra não foi estreitada para zerar esse
número**: estreitar tiraria essas proposições da tabela, trocando uma linha discutível por uma
linha ausente, e linha ausente é invisível.

### As três colunas de emenda, e por que são três

Elas são encaixadas — **acatadas ⊆ decididas ⊆ registradas** — e a exportação falha se deixarem de
ser:

| Coluna | O que conta | Total |
|---|---|---:|
| `emendas_registradas` | emendas que o registro de tramitação **nomeia** (assinadas, incluídas em bloco de assinatura, canceladas) | 7.736 |
| `emendas_decididas` | as que receberam **alguma** mudança de status, qualquer que fosse | 6.090 |
| `emendas_acatadas` | as cujo **último** status é `Aprovado(a)` — a pergunta *"quantas acatadas"* do roteiro | 5.188 |

**Nenhuma das três é o número de emendas apresentadas**, e não existe coluna com esse nome: o
registro nomeia uma emenda quando algo acontece com ela, e uma coluna com esse nome seria uma
afirmação que o acervo não sustenta.

**`emendas_acatadas` não é subconjunto das aprovadas.** 149 emendas acatadas estão em 17
proposições cujo veredito ainda é `pendente` — a Casa emenda antes de decidir. Quem assumir o
contrário vai achar as duas colunas inconsistentes.

### De onde vem "houve emenda", e de onde NÃO vem

Vem do **registro de tramitação da própria proposição**, que anota cada mudança de status de cada
documento Emenda com o vocabulário publicado pela fonte: `Aprovado(a)`, `Rejeitado(a)`,
`Prejudicado(a)`, `Retirado(a)`, `Não apreciado(a)`, `Inadmitido(a)`. **Vale o último status**, e
não qualquer status já registrado: há emendas marcadas `Aprovado` e corrigidas minutos depois, e
uma regra de *"já foi aprovada alguma vez"* publicaria a correção como aprovação em três projetos
com nome e número.

**Não vem do campo `etapa`**, e isso importa. A `etapa` traz os sufixos `Disponibilizada(Emenda)`
e `Retorno(Emenda)` em **429** das 571 — mas isso registra a **abertura do prazo** de emendas ou a
chegada de um documento, não uma emenda existente nem acatada. O registro de tramitação aponta
**157**. Contar pela `etapa` publicaria quase três vezes o que o registro sustenta, e ainda assim
perderia 12 proposições cuja etapa já avançou.

### *"Com emenda de mérito"* — o roteiro pediu, e a fonte não tem

A pergunta original diz *aprovadas com **emenda de mérito***. **Nenhum campo em lugar nenhum
tipifica uma emenda por mérito.** O domínio publicado pela CLDF tem sete valores e todos são de
**forma**: `Orçamentária`, `Aditiva`, `Modificativa`, `Subemenda`, `Supressiva`, `de Plenário`,
`Substitutiva`. A rota `tipo-emenda` não existe publicamente.

Por isso a coluna se chama **`aprovada_com_emendas`** e não *"com emenda de mérito"*. O que o
registro sustenta é que a Casa **acatou ao menos uma emenda**; que essa emenda mudou a substância
do texto é outra afirmação, e ela não pode ser feita a partir desta fonte.

### `aprovada` significa aprovada **pela Câmara**, e nada além

Sanção, veto e promulgação são atos do **Executivo**, e nenhum registro aqui os distingue. Esse
limite pesa mais neste dataset do que em qualquer outro: **quem propôs estas 571 proposições é o
mesmo poder que depois as sanciona ou veta**, e esta tabela não diz nada sobre esse segundo ato.

### Quanto disto foi conferido à mão

**46 registros lidos um a um — 2 divergências.** Amostra estratificada (até 15 por categoria),
sorteada de forma determinística a partir da própria tabela publicada: qualquer pessoa refaz o
mesmo sorteio sem precisar deste repositório. As duas divergências são as duas linhas do
`aprovada_no_texto_original` apoiadas no silêncio da fonte — `PL 2579/2022` e `PL 2992/2022` — e
elas **estão marcadas na tabela**. O relatório linha a linha está em
[`../../docs/specs/dataset6-conferencia-manual.md`](../../docs/specs/dataset6-conferencia-manual.md).

**É amostra, não censo**, e a diferença é declarada: os datasets 10 e 11 puderam ler o universo
inteiro (45 e 15 registros); 571 não pode ser lido à mão.

**E há uma segunda leitura, independente desta.** As emendas dos três projetos do ciclo
orçamentário de 2024 já tinham sido contadas por outra via — o próprio endpoint de documentos da
API, em outro dia, para outro dataset:

| Projeto | Pela API | Pelo registro de tramitação |
|---|---:|---:|
| LOA 2024 `PL 613/2023` | 657 | 679 |
| PPA 2024–27 `PL 612/2023` | 307 | 301 |
| LDO 2024 `PL 371/2023` | 278 | 280 |

**3% de diferença, nos dois sentidos, e elas não deveriam bater exatamente**: o registro nomeia
documentos depois cancelados e não enxerga emendas cuja única movimentação esteja fora das formas
que este projeto lê. A diferença está publicada em vez de arredondada — duas medidas próximas
apresentadas como iguais são exatamente o número que ninguém confere.

## Dataset 10 — convocações de autoridades, e a pergunta que a CLDF não responde

`convocacoes-de-autoridades.csv` / `.xlsx` — **26 linhas, 2022–2026.** Uma linha por
**requerimento de convocação**: um pedido para que a Câmara convoque alguém a comparecer e prestar
esclarecimentos.

> **LEIA ISTO ANTES DE USAR A TABELA.** O roteiro deste projeto pedia três coisas sobre cada
> convocação: quais foram **requeridas**, quais a Casa **aprovou**, e se a autoridade convocada
> **compareceu**. Esta tabela responde às duas primeiras. **A terceira não tem resposta — e essa
> ausência é o resultado, não uma falha desta tabela.** Ver a seção própria abaixo.

### O que conta como convocação aqui

Uma coisa só: um **Requerimento** que pede à Casa que **convoque** alguém. Duas fronteiras
importam, e as duas foram decisões, não acasos:

- **Não é só Secretário de Estado.** O roteiro original falava em Secretários. A regra é mais
  larga de propósito, porque a regra estreita teria perdido uma convocação real: o `REQ 16/2023`
  convoca dois cidadãos que não eram Secretários — Anderson Torres e Fernando de Sousa Oliveira —
  para prestar esclarecimentos sobre 8 de janeiro de 2023.
- **Convite não é convocação.** O acervo tem **6** requerimentos que pedem o *convite* de uma
  autoridade. Um convite pode ser recusado; uma convocação, não. Eles **não** estão nesta tabela, e
  a contagem está em `provenance.json`. A Casa usa os dois instrumentos deliberadamente: a mesma
  deputada **convidou** o Presidente do BRB em março de 2025 (`REQ 1934/2025`) e o **convocou** em
  agosto (`REQ 2189/2025`).

### A armadilha da palavra "convocação"

No registro da CLDF, `convocação` tem **dois sentidos sem relação um com o outro**, e o outro é o
mais comum: a convocação de **aprovados em concurso público**. Das 45 proposições cuja ementa
contém a palavra, **19 não são convocações de ninguém**:

> `REQ 3466/2022` — *"Requer informações ao Senhor Presidente da CAESB, informações acerca de
> **convocação de aprovados em concurso público**"*
>
> `REQ 1352/2024` — *"Requer informações à SEDUH acerca da **convocação da Conferência Distrital
> das Cidades**"* *(um evento, não uma pessoa)*

Quem filtrar o acervo por `convocação` e contar terá **45**. O número certo é **26**, e a regra que
separa os dois sentidos está escrita em
[`docs/specs/DESIGN-dataset10.md`](../../docs/specs/DESIGN-dataset10.md), cláusula por cláusula.
As 45 ementas foram **lidas uma a uma** — não uma amostra, o universo inteiro — e a regra concorda
com a leitura manual nas 45: **0 divergências**
([`docs/specs/dataset10-conferencia-manual.md`](../../docs/specs/dataset10-conferencia-manual.md)).

### `cargo_convocado` — o cargo como a ementa o escreve

Esta coluna **cita**, não classifica. Vem com a caixa alta do registro
(`SECRETÁRIO DE ESTADO DE SAÚDE DO DISTRITO FEDERAL`), com os pronomes de tratamento
(`Excelentíssima Senhora Secretária de Estado de Mobilidade Urbana`) e, quando a ementa nomeia uma
pessoa em vez de um cargo, **com o nome da pessoa**.

Não há taxonomia e isso é deliberado: normalizar esses textos em categorias arrumadas seria este
projeto afirmando uma classificação que a CLDF nunca publicou — e uma célula arrumada é uma célula
que ninguém consegue conferir contra a página de origem.

Quando um requerimento convoca várias autoridades, **a linha é uma só** e a coluna traz todas. O
`REQ 2553/2026` convoca quatro; dividi-lo em quatro linhas inventaria três convocações que o
registro não tem.

### `resultado` — e o que `sem_deliberacao_publicada` significa

| Valor | Linhas | O que quer dizer |
|---|---:|---|
| `rejeitada` | 2 | o Plenário votou e rejeitou |
| `aprovada` | 0 | nenhuma convocação foi aprovada no período |
| `outro_desfecho` | 0 | a fonte registrou um desfecho que **não é veredito** (prejudicado, sem quórum) |
| `sem_deliberacao_publicada` | 24 | **nenhuma das duas fontes publica um desfecho** |

> **`sem_deliberacao_publicada` NÃO significa rejeitada.** Significa que o registro público não diz
> o que aconteceu com aquele requerimento. A maioria das 24 é de 2026 e é recente; o
> `REQ 3334/2022` é anterior à janela do Painel de Votação. **Ausência e resultado são fatos
> diferentes**, e somar as 24 às 2 rejeitadas para dizer que "26 convocações foram negadas" seria
> falso.

**As duas rejeitadas foram estas**, e vale ler os números:

| Requerimento | Quem seria convocado | Data | Sim × Não |
|---|---|---|---|
| `REQ 2613/2026` | Secretário de Estado de Economia e Presidente do BRB | 03/03/2026 | 9 × 15 |
| `REQ 2974/2026` | Nelson Antônio de Souza, Presidente do BRB | 09/06/2026 | 8 × 11 |

### De onde vem cada desfecho, linha por linha

A coluna `resultado_fonte` diz qual fonte respondeu, e as duas colunas seguintes trazem a **prova
literal** — para que ninguém precise acreditar na normalização deste projeto:

- `resultado_rotulo_painel` — o rótulo que o Painel de Votação publica, sem tradução;
- `resultado_marcador_api` — o marcador de tramitação da API que sustentou o veredito.

**Duas fontes independentes, e elas se conferem.** Onde as duas falam, o programa **para** se
discordarem. Isso acontece em uma linha (`REQ 2974/2026`) e as duas concordam.

> **O resultado NÃO é calculado a partir dos votos, e isso importa.** No período coberto, o Painel
> classifica **duas votações nominais contra o sinal da própria apuração**: o `PDL 275/2025` é
> `REPROVADO` com 12 Sim e 5 Não — 12 de 24 não é maioria absoluta — e um destaque de emenda ao
> `PL 1267/2024` é `APROVADO` com 0 Sim e 21 Não, porque o que se aprovou foi a rejeição do
> destaque. Um programa que fizesse a conta `Sim > Não` publicaria as duas ao contrário. **O rótulo
> da fonte é a fonte; a apuração está publicada ao lado dele para ser conferida, não para
> substituí-lo.**

### As colunas de votos só existem em votação NOMINAL

`votos_sim`, `votos_nao` e `abstencoes` ficam **vazias** quando não houve votação nominal. Numa
votação simbólica a fonte não registra posição individual alguma, e publicar `0 × 0` ali faria uma
votação simbólica parecer uma **rejeição unânime**. **Célula vazia é ausência de registro, nunca
zero.**

### O comparecimento: a CLDF não publica se a autoridade apareceu

**Não existe coluna `compareceu` nesta tabela, e a razão não é que faltou coletar.** A razão é que
**o registro público da Câmara Legislativa do Distrito Federal não informa isso.**

Foi procurado, em 2026-08-28, em tudo que a CLDF publica:

| Onde | O que se procurou | O que se achou |
|---|---|---|
| API pública | `/presenca`, `/convocacao`, `/audiencia`, `/ata`, `/comissao`, `/pauta`, `/evento`, `/autoridade`, `/orador` | **404** — não existem |
| API pública | `/reuniao/filter` | **existe**: 32 reuniões desde 03/2025, e **os participantes são só deputados** |
| Painel de Votação | as 62 entidades do modelo | a tabela de presença liga-se a `DM_PARLAMENTAR_PRESENCA` — **só parlamentares** |
| Portal | `/comissoes`, `/agenda`, `/transparencia` | nenhum registro de comparecimento |
| Portal | `/atas`, `/convocacoes` | **404** |

Uma coluna vazia diria "faltou dado". **A verdade é mais forte e é outra: a CLDF não tem esse dado
consolidado.** É exatamente o tipo de constatação que este projeto existe para produzir — e é uma
resposta publicável a uma das quatorze perguntas, não uma pergunta que ficou sem resposta.

**Um efeito prático disto:** ninguém — nem a imprensa, nem um pesquisador, nem um deputado — pode
hoje responder, a partir do registro oficial, se um Secretário convocado pela Câmara Legislativa
efetivamente compareceu. Não porque o dado seja secreto, mas porque não é publicado em lugar nenhum.

## Dataset 11 — as CPIs, e as duas colunas vazias que são o resultado

Duas tabelas. `comissoes-parlamentares-de-inquerito` tem **5 linhas**; a de assinaturas, **63**.

### Primeiro, o que estas 5 linhas são — e o que não são

Cada linha é **um requerimento que pediu à Casa a criação de uma Comissão Parlamentar de
Inquérito**, entre 2022 e 2026. **Não é a lista das CPIs que a Câmara Legislativa já teve.**

A diferença importa e tem um exemplo concreto: o próprio acervo cita a **CPI do Feminicídio** e a
**CPI dos Maus-tratos aos Animais**, mas só através de *outros* requerimentos — uma audiência
pública, um pedido de informações, uma prorrogação, uma indicação sobre o relatório final delas. Os
requerimentos que **criaram** essas duas são anteriores à janela de coleta deste projeto e não estão
aqui. **Ler `5` como "a CLDF teve 5 CPIs" seria errado.**

Também não estão aqui os 7 requerimentos que citam uma CPI sem pedir a criação de nenhuma: três
prorrogações, duas audiências públicas, um pedido de informações e uma oitiva. Publicá-los
duplicaria comissões que já têm linha própria.

### As duas colunas vazias, e por que a coluna vazia é a notícia

`instalada` e `relatorio_final` estão publicadas e estão **vazias em todas as 5 linhas**.

**Isso não é dado que faltou coletar. É que a CLDF não publica registro nenhum das suas CPIs.**
Procurou-se, em 28/08/2026, em tudo o que a CLDF publica sem senha:

| Onde | O que se procurou | O que se achou |
|---|---|---|
| Código do próprio site da CLDF | quais serviços existem em `public/` | são **19**, e nenhum é `comissao` ou `pauta` — os dois existem só **atrás de login** |
| API pública | `GET /orgao-legislativo/select-itens` | 27 órgãos legislativos, **exatamente 1 CPI** (a do Rio Melchior) |
| API pública | `GET /unidade/listar-ativas` | 89 unidades, 21 comissões, **nenhuma CPI** |
| API pública | `POST /reuniao/filter` | 32 reuniões desde 03/2025, **1 de CPI**; a data que existe ali é o carimbo de criação do registro **no sistema**, não a data de instalação |
| API pública | `GET /documentos-reuniao/{id}/documentos-assinados` | só dois tipos de documento: **PAUTA** e **RESULTADO DE PAUTA**. Nenhum tipo "relatório final" |
| API pública | `POST /reuniao/{id}/listar/todas-proposicoes/votacao` | **erro 500** — a rota existe, é pública, e está quebrada |

**Célula vazia aqui significa "a fonte não tem", nunca "não aconteceu".** E há prova disso dentro do
próprio acervo: o **REQ 795/2023** diz, com todas as letras, que a CPI criada pelo REQ 1/2023 foi
*"instalada"*; o **REC 5/2023** descreve destaques votados ao *"Relatório final apresentado pelo
Relator, no dia 29 de novembro de 2023"*. **Os dois fatos estão no registro — como texto livre na
ementa de outra proposição, nunca como campo.**

### Por que não preenchemos só a linha que dava

A superfície de reuniões marcaria **uma** das cinco linhas e deixaria quatro em branco. Um leitor
leria essas quatro como *"não instalada"* — e isso é falso pelo menos uma vez, porque o REQ 795/2023
diz o contrário. **Uma coluna toda vazia diz a verdade; uma coluna com uma linha preenchida diria
uma mentira sobre as outras quatro.** É a mesma decisão da coluna de comparecimento do dataset 10,
tomada pelo mesmo motivo.

### `assinaturas` — o que a coluna conta

É o número de **autores declarados** do requerimento, como a API os publica (a coluna
`assinaturas_fonte` nomeia o endpoint em toda linha). Três avisos:

1. **É coautoria, não um livro de assinaturas.** Para um requerimento de CPI as duas coisas
   coincidem na prática, mas são registros diferentes, e este projeto não afirma uma equivalência
   que a fonte nunca declarou.
2. **Não há coluna dizendo se o mínimo regimental foi atingido.** A fonte não publica nem o limiar
   nem quantos deputados estavam em exercício no dia. Quem tiver o Regimento em mãos faz a conta em
   uma subtração; nós publicamos o número, não o juízo.
3. **O trâmite registra mais assinaturas do que há autores** — em todos os 5 casos (27 contra 23,
   10 contra 9, 13 contra 11, 13 contra 12, 9 contra 8). Os dois números estão lado a lado em
   `provenance.json`. A diferença não é erro de nenhum dos dois: cada requerimento tem 2 ou 3
   documentos no trâmite, e quem assina no log são **usuários do sistema**, incluindo servidores da
   Casa — nomes que este projeto não publica. Se você contar as assinaturas no PDF e der outro
   número, a divergência já está escrita aqui.

### A ordem da tabela de assinaturas não é a ordem de assinatura

O campo `ordem` da fonte vem **nulo nas 28.689 linhas de coautoria** do acervo. A tabela é ordenada
por `autor_id`, o que é determinístico e **não é** uma afirmação sobre quem assinou primeiro.

## Dataset 12 — quanto tempo leva, e as 21.764 que nunca foram deliberadas

Duas tabelas. `tempo-de-tramitacao-por-ano-e-especie` tem **52 linhas** — as mesmas 52 células de
ano × espécie das tabelas de dataset 1, de propósito: dá para colocar as três lado a lado e a coluna
`apresentadas` bate célula por célula. `proposicoes-sem-deliberacao` tem **21.764 linhas**, uma por
proposição, e é a maior tabela deste repositório.

### O relógio: onde começa e onde termina

Começa na **`dataLeitura`** — presente nas **22.748 de 22.748** proposições do acervo, então nenhuma
fica de fora por falta de data de início. Termina no **marcador de etapa terminal que a própria CLDF
registra** (`Sanção Veto ou Promulgação` ou `Arquivar`), presente em **984**. As outras 21.764 não
têm data de fim **porque não terminaram** — e é exatamente isso que a segunda tabela publica.

Medido nas 984: **mínimo 1 dia, máximo 1.508, e nenhuma duração negativa.**

### Não existe coluna de média, e isso é a resposta e não uma omissão

O roteiro pedia *"tempo médio de tramitação"*. Esta tabela publica a **distribuição** e nenhuma
média, porque uma média sozinha sobre um tempo de tramitação é o número mais fácil de citar e mais
difícil de ser verdade sobre qualquer proposição concreta: a distribuição global é **n = 984, p25 =
24 dias, mediana = 100, p75 = 293, máximo = 1.508**. Metade das proposições decididas levou até 100
dias; um quarto delas levou mais de 293; e existe uma que levou mais de quatro anos. Uma média
esconderia as três coisas ao mesmo tempo.

> **Antes de conferir `dias_mediana` numa planilha, leia isto.** As três colunas de quantil usam o
> método do **posto mais próximo**: para uma lista ordenada de `n` durações e um quantil `p`, o valor
> de índice `teto(p × n) − 1`. Isso garante que **todo número publicado é a duração real de uma
> proposição real** — dá para apontar a linha que o produziu. O preço é que, quando `n` é par, o
> Excel, o pandas e o `statistics.median` do Python fazem a **média dos dois valores centrais** e
> esta tabela toma o **menor** dos dois. Se o seu número deu meio dia de diferença, é isto, e está
> escrito aqui em vez de virar uma discussão.

**Quando `deliberadas` é 0, as quatro colunas de distribuição vêm VAZIAS, nunca 0.** São **25 das 52
células** — todas as de Indicação, quatro das cinco de Moção, três das cinco de Requerimento. Um zero
ali diria que essas proposições foram decididas instantaneamente, que é o contrário do que
aconteceu.

### As duas colunas de "sem deliberação", e por que são duas

Esta é a decisão que dá forma à tabela, e ela foi tomada para que **você escolha o denominador em vez
de herdar o nosso**:

| Coluna | O que conta | Total |
|---|---|---:|
| `sem_deliberacao_estrito` | veredito `pendente` — o sistema da própria Casa diz que **falta uma decisão** | **2.967** |
| `sem_deliberacao_amplo` | **tudo** que não tem marcador terminal nenhum | **21.764** |

A diferença — **18.797** — é exatamente a coluna `nao_se_aplica` do dataset 1: Indicação,
Requerimento, Moção, Recurso e Questão de Ordem, para as quais o sistema do CLDF **não registra
veredito nenhum**, porque são lidas e encerradas administrativamente e nunca votadas a favor ou
contra.

Olhe a tabela e a diferença fica impossível de não ver: em toda linha de **Indicação** o estrito é
**0** e o amplo é a célula inteira; em toda linha de **Projeto de Lei** os dois são **iguais**. Uma
coluna só faria uma dessas duas famílias parecer a outra.

**NENHUMA DAS DUAS PODE SER CITADA SOZINHA.** A exportação **falha** se uma linha trouxer uma sem a
outra — é a única maneira de uma regra escrita num README continuar valendo depois que alguém
copiar a tabela.

### A armadilha desta tabela: "sem deliberação" não quer dizer "ainda em movimento"

**18.759 das 21.764 linhas têm no seu histórico um evento `ENCERRAR_PROPOSICAO`** — o sistema
encerrou o registro **sem que a Casa tenha decidido nada**. Não usamos esse evento como fim do
relógio, por três motivos verificáveis: ele não carrega resultado nenhum, ele é **reversível**
(3.478 proposições do acervo têm `REABRIR_PROPOSICAO`), e ele também aparece em 982 das 984
proposições que **foram** deliberadas — ou seja, não separa as duas populações.

**Encerrado e decidido são fatos diferentes nesta fonte, e só o segundo vira resultado publicado.**

### `as_of` — a data que viaja em toda linha

`dias_em_aberto` é a distância entre a `dataLeitura` e a data em `as_of`, hoje **2026-08-21**. Essa
data é **o evento de tramitação mais recente que este acervo contém** — "o registro até onde esta
cópia dele vai" — e **não** é "hoje". Um "hoje" faria os arquivos mudarem de bytes todo dia e
quebraria a reprodutibilidade, que é a única coisa que este projeto pede que você não tenha de
acreditar.

Ela viaja em **toda linha**, não só neste texto, para que uma linha copiada da tabela leve junto a
sua própria data. A exportação **falha** se alguma linha publicar dias em aberto sem ela.

### *"Há mais de 2 anos"* — contado, não filtrado

O roteiro pedia as proposições sem deliberação **há mais de 2 anos**. A tabela publica **todas** as
21.764 com o `dias_em_aberto` de cada uma, para que você use o corte que quiser; o corte do roteiro
está contado ao lado, em `provenance.json`: em 21/08/2026, **12.659** passam de 730 dias — **1.778**
no conjunto estrito e **10.881** no amplo. Uma tabela que já tivesse aplicado o filtro não
responderia nenhuma outra pergunta.

### *"Arquivadas por decurso de prazo ou fim de legislatura"* — a fonte não diz o motivo

A terceira coisa que o roteiro pedia no item 12 **não tem coluna aqui, e a ausência é o resultado**
(achado **F-077**). A CLDF marca `Arquivar` como **etapa** e **nunca registra o motivo**:

- nenhum dos **17** valores distintos de `descricaoTramitacao` em **585.282** eventos de tramitação
  é um verbo de arquivamento — `%arquiv%` casa com **0** eventos;
- as palavras **`decurso`** e **`legislatura`** aparecem em **0** desses 585.282 eventos, e
  `decurso de prazo` em **0** das 22.748 ementas.

Distinguir arquivamento por decurso de prazo de arquivamento por fim de legislatura seria **inferir
um motivo que o registro nunca dá**. Não há coluna vazia: a ausência é a resposta.

### Cobertura, e o limite que o próprio número esconde

**2022–2026**, a janela do acervo de proposições. Uma proposição lida antes de 01/02/2022 não está
no acervo e portanto não está em nenhuma das duas tabelas, **por mais tempo que esteja aberta**. A
linha mais antiga desta relação tem **1.662 dias em aberto** — e esse máximo é o limite da coleta,
não o limite da Casa. A CLDF certamente tem proposições abertas há mais tempo do que esta tabela
consegue mostrar.

E o limite herdado do dataset 1, porque o fim do relógio é o mesmo marcador: **`aprovada` significa
"aprovada pela Casa Legislativa" e nada além disso.** Sanção, veto e promulgação sobre veto são atos
do Executivo, e nenhum registro aqui os distingue.

## Dataset 14 — frequência em plenário, e a única armadilha que importa

Três tabelas novas. `frequencia-deputados-em-plenario-por-ano` tem **173 linhas** — uma por ano e
deputado, de **2020 a 2026**, cobrindo **961 sessões** e **40 deputados**.

### Antes de citar qualquer percentual: leia estas quatro linhas

`frequencia_pct` é `presencas ÷ sessoes_no_ano`. O denominador são **todas** as sessões de plenário
daquele ano. Quem **não estava empossado o ano inteiro** — suplentes, quem assumiu no meio do
mandato, quem saiu — aparece com percentual baixo **por esse motivo, e não por falta**:

| Deputado | Ano | Contra o ano | Dentro do próprio período |
|---|---|---:|---:|
| LUZIA DE PAULA | 2020 | 5/132 = **3,8%** | 5/5 = **100%** |
| TABANEZ | 2022 | 8/146 = **5,5%** | 8/8 = **100%** |
| GUARDA JANIO | 2022 | 17/146 = **11,6%** | 17/20 = **85,0%** |
| PROF. MARIA ANTONIA | 2022 | 21/146 = **14,4%** | 21/23 = **91,3%** |
| JOSÉ GOMES | 2022 | 24/146 = **16,4%** | 24/144 = **16,7%** |

LUZIA DE PAULA esteve em **todas** as sessões em que era deputada. Publicar "3,8%" sozinho seria
dizer o contrário do que o registro diz.

**Por isso cada linha traz também** `primeira_sessao`, `ultima_sessao`, `sessoes_no_periodo` e
`frequencia_no_periodo_pct` — as sessões realizadas entre a primeira e a última presença daquele
deputado, e o percentual contra **esse** período. Compare as duas colunas antes de escrever
qualquer frase. A última linha da tabela acima mostra por quê: o período de JOSÉ GOMES cobre quase
o ano inteiro, então **os 16,4% dele são ausência de verdade**. São as duas colunas que separam um
caso do outro.

### O que esta tabela NÃO é

1. **Não é a frequência total do deputado.** A fonte só tem **plenário**. Nenhuma reunião de
   **comissão** aparece — nem sob outro nome, nem parcialmente (achado **F-044**). Quem trabalha
   muito em comissão aparece aqui com menos presenças do que teve.
2. **A fonte não registra faltas.** Só existe linha quando houve presença. A ausência é **deduzida**
   por nós, nunca lida do registro. "O registro não diz que ele estava" e "o registro diz que ele
   faltou" são coisas diferentes, e só a primeira é verdade aqui.
3. **Não há justificativa de ausência.** Missão oficial, licença médica e falta sem motivo são
   indistinguíveis nesta fonte: todas as três são simplesmente a ausência de uma linha.

### A conferência com uma segunda fonte

`conferencia-presenca-pdf-x-painel` compara, nome por nome, **duas fontes independentes** das mesmas
sessões: a **Lista de Presença em PDF** que a CLDF publica e o **Painel de Votação**. As duas só se
encontram em **2 sessões** (18 e 19/08/2026), porque é o que a extração dos PDFs cobre hoje.

**Resultado: 29 nomes conferidos, 0 divergências** — e sem nenhuma normalização de nome.

**O tamanho da amostra é a limitação, e está dita aqui em vez de escondida:** 2 sessões não provam
que as duas fontes concordam sempre. Provam que, nas duas em que dá para comparar, concordaram
inteiramente. Uma divergência futura será **publicada como achado**, não tratada como erro:
assinar uma lista de papel e registrar login no painel são dois atos diferentes e podem
legitimamente divergir.

### Três coisas estranhas na fonte, publicadas como estão

- **`registros_na_fonte`** — o painel guarda **até 3 linhas** para o mesmo deputado na mesma sessão
  (achado **F-041**). São 1.489 pares assim, de 15.819. A tabela conta **sessões distintas**, não
  linhas; a coluna guarda o número original para quem quiser conferir.
- **`partido` com `INVÁLIDO` ou `NÃO INFORMADO`** (achado **F-042**) — são **deputados reais** cuja
  legenda a fonte não preencheu. Não foram removidos: apagá-los tiraria JORGE VIANNA e PAULA
  BELMONTE do registro publicado.
- **`tipo_sessao` com duas grafias** (achado **F-043**) — `SESSAO ORDINARIA` e `ORDINARIA` são a
  mesma coisa. A tabela traz **as duas colunas**: o rótulo literal da fonte e um normalizado, para
  que agrupar por tipo não gere dois baldes para uma coisa só.

### Quem trocou de partido

24 pares ano × deputado têm **mais de uma legenda** no mesmo ano, a maioria na janela partidária de
2022. A coluna `partido` traz **todas**, separadas por ` / `. Escolher uma seria inventar um fato.

## Datasets 3 e 4 — o parecer da CCJ, e a proposição aprovada contra ele

Quatro arquivos: `pareceres-ccj-admissibilidade`, `juizo-de-admissibilidade-por-comissao`,
`aprovadas-contra-parecer-da-ccj` e `aprovadas-contra-parecer-agregado`.

### Antes de citar qualquer linha: leia estas três

**1. `admissibilidade` NÃO é `inconstitucionalidade`, e a diferença não é sutil.** O juízo de
admissibilidade é uma decisão **processual** sobre se a proposição pode seguir tramitando. Uma
declaração de inconstitucionalidade é decisão do Judiciário e não acontece aqui. Nenhuma coluna
destas tabelas se chama `inconstitucional`, e isso é deliberado: de 11 pareceres da CCJ lidos à
mão, **0 continham a palavra `inconstitucional`**. A palavra que o registro usa é
`admissibilidade`, e é ela que está publicada.

**2. Nem todo juízo de admissibilidade é da CCJ — e é por isso que existe a segunda tabela.** A
**CEOF** (Comissão de Economia, Orçamento e Finanças) também emite juízo de admissibilidade, mas
sobre **adequação orçamentária** (RICLDF, art. 64, II, § 1º), não sobre admissibilidade jurídica
(art. 63, I, que é da CCJ). Os dois pareceres usam **as mesmas palavras**, e um leitor que
filtrasse só pelo veredito publicaria um projeto cujo *orçamento* a comissão de finanças
questionou como se a CCJ o tivesse considerado inadmissível. `juizo-de-admissibilidade-por-comissao`
publica **todas** as comissões justamente para que se veja o que ficou de fora do dataset 3.

**3. `contradiz_parecer` compara dois registros — não mede desobediência.** A Casa pode aprovar
uma proposição contra o parecer da CCJ por razões que o registro declara em outro lugar, inclusive
um substitutivo que sana o vício apontado. A coluna diz que **dois registros discordam**. Quem
quiser dizer mais que isso precisa ler o parecer, e o `documento_id` está publicado para isso.

### De onde vem a comissão (e por que não vem de um campo)

A fonte **não publica** a comissão do parecer em nenhum campo estruturado. O campo que parece
servir, `sigla_unidade`, traz o **gabinete do relator** — `GAB DEP PAULA BELMONTE`,
`GAB DEP FÁBIO FÉLIX` — em 24 dos 25 primeiros pareceres lidos. Ele está publicado como coluna
própria, para que se veja quem relatou, mas **não decide nada**.

A comissão é lida da cláusula que o próprio parecer escreve:
`Da COMISSÃO DE CONSTITUIÇÃO E JUSTIÇA, sobre o Projeto de Lei nº …`. A coluna
`comissao_fonte` diz qual regra respondeu:

| valor | o que significa |
|---|---|
| `clausula_da` | a cláusula `Da COMISSÃO DE …` do próprio parecer — a fonte forte |
| `sigla_cabecalho` | a sigla no cabeçalho (`PARECER Nº , DE 2023 - CCJ`), usada só quando a cláusula falta |
| `indeterminada` | nenhuma das duas apareceu — a linha **é publicada assim mesmo**, com o veredito, e nunca entra no dataset 3 |

**A fonte erra o nome da própria comissão, de duas formas, e as duas foram aceitas de propósito:**
`CONSTITUIIÇÃO` (um I a mais) e `CONSTITUIÇÃO DE JUSTIÇA` (`de` no lugar de `e`). Não existe
comissão com esses nomes na CLDF — são erros de digitação, e recusá-los descartaria pareceres reais
da CCJ deixando comissões fantasmas de uma linha na tabela por comissão.

### `contradiz_parecer` — o vocabulário inteiro, sem resto

| valor | quando |
|---|---|
| `sim` | a CCJ disse `inadmissivel` e a Casa aprovou |
| `nao` | o parecer e o desfecho concordam |
| `ressalva_aprovada` | parecer `admissivel_com_ressalva`, proposição aprovada — só é contradição se a ressalva foi ignorada, e isso este projeto não lê |
| `parecer_sem_clausula` | o parecer existe e é da CCJ, mas nenhuma cláusula reconhecida foi encontrada nele |
| `proposicao_pendente` | a proposição ainda não tem desfecho |
| `indeterminado` | a comissão não pôde ser lida |

Um valor fora desta lista **interrompe a publicação**. Ausência é coluna, nunca linha filtrada.

### A coluna `clausula` — corrigida em 2026-08-29, e vale saber o que mudou

A `clausula` existe por um motivo só: **conferir o rótulo contra as palavras do próprio parecer**.
Uma conferência à mão das 488 linhas encontrou dois defeitos nela — nenhum deles no rótulo, os
dois na **frase publicada ao lado**.

**1. A fonte cola duas palavras, e isso custava uma linha inteira.** Alguns pareceres concluem
*"pela ADMISSIBILIDADEconstitucional e jurídica"*, sem espaço. A regra exigia que a palavra
terminasse ali, então não a reconhecia:

- no `PL 332/2023` ela recuava para a última frase que reconhecia — **uma decisão judicial citada
  no meio do parecer, sobre outra lei** (RE 1.330.817/DF, sobre a Lei Distrital 4.949/2012). O
  rótulo saía certo; a frase publicada ao lado era de um caso diferente;
- no `PL 583/2023` ela não reconhecia nada, e um parecer de admissibilidade **real da CCJ** era
  publicado como `sem_clausula`. Esse é o erro invisível: a linha estava lá, bem formada, e faltava
  o veredito.

Medido sobre os 30.389 documentos guardados, a correção muda exatamente esses dois.

**2. A citação passava do fim da frase.** A `clausula` era uma janela fixa de caracteres em volta
do trecho encontrado, e nestes documentos o que está em volta não é enchimento:

- **depois** dela, a nota de rodapé que **copia o art. 63 do Regimento** — o texto que descreve *o
  trabalho* da CCJ, não a decisão dela sobre a proposição;
- **antes** dela, o parecer de **outra comissão** — no `PL 801/2023`, a opinião de mérito da
  CDESCTMAT colada à decisão de admissibilidade da CCJ. Duas comissões dentro de uma "cláusula" só.

Agora a citação para no fim da própria frase. Medido sobre as 2.682 cláusulas guardadas:
**217 iguais, 2.465 mais curtas, 0 mais longas** — a correção só encurta, nunca amplia. O tamanho
médio caiu de **343 para 193** caracteres.

**O que ainda fica:** **227** cláusulas começam no meio de uma frase, porque a conclusão é mais
longa que o limite de 220 caracteres para trás. É o mesmo limite de antes e ele não foi alargado
de propósito — alargá-lo quebraria a única garantia que torna esta correção conferível sem reler
tudo. O `documento_id` está em cada linha: o parecer inteiro pode ser lido na fonte.

### O universo, e o que ele não alcança

As tabelas cobrem as proposições cujo **log de tramitação registra um documento de parecer**.
Isso é um recorte do acervo, não o acervo inteiro, e tem um limite que nenhum número aqui mostra:
**um parecer que exista sem que o log o registre está fora do universo**, e nem a regra nem uma
conferência humana o encontrariam. O tamanho do universo e das duas contagens está em
`provenance.json`.

## Dataset 5 — os vetos do Governador, e a pergunta que muda de direção

Dois arquivos: `vetos-do-governador` e `vetos-cobertura`.

### Antes de citar qualquer linha: leia estas duas

**1. Não existe coluna dizendo se o veto foi mantido ou derrubado, e isso é deliberado.** A
pergunta posta em votação nem sempre é *"o veto se mantém?"*. Um bloco lê
`BLOCO DE VETOS 29/04/2026 - PELA REJEIÇÃO` e sai **REPROVADO**: era uma moção **para rejeitar**
os vetos, e ela foi derrotada — logo **os vetos ficaram de pé**. A mesma família de rótulo em
`VETO TOTAL PROJETO DE LEI 2886/2022` significa o contrário. **12 vetos** estão do lado invertido.

Para ler o desfecho, use **três colunas juntas**: `resultado_rotulo` (o rótulo literal do
Painel), `votacao_materia` (a pergunta) e `pergunta_invertida`.

**2. Isto não é a contagem de vetos que o Governador enviou.** É a contagem de vetos que **este
registro consegue ver**. Um veto nunca levado a voto e nunca relatado pela CCJ não aparece em
nenhuma das fontes públicas lidas.

### A tabela é a união de duas fontes, e nenhuma delas basta

| fonte | o que é |
|---|---|
| `painel` | uma votação de veto do Painel nomeou esta proposição (inclusive dentro de um bloco) |
| `relatorio_ccj` | existe um `Relatório de Veto` da CCJ sobre ela |
| `ambas` | as duas |

**24 vetos aparecem só no relatório da CCJ.** Uma tabela feita só do Painel os omitiria sem
que ninguém percebesse.

### Cobertura — leia `vetos-cobertura` antes de somar qualquer coisa

**168 das 325 proposições vetadas estão fora da janela de coleta 2022–2026.** Elas estão
publicadas, com `na_janela_de_coleta = nao` e sem ementa, porque descartá-las daria uma contagem
de vetos com cara de completa.

### Três coisas estranhas na fonte, publicadas como estão

- **2 documentos** que a fonte marca como `Relatório de Veto` são **Despachos** e não falam de
  veto nenhum. Excluídos e contados;
- **4 relatórios se contradizem** sobre o tipo do veto. Vale a linha de assunto do documento;
  as menções seguintes costumam ser sobre **emendas dentro do projeto**, não sobre o projeto. A
  contradição vai marcada em `tipo_veto_conflito`;
- **245 vetos sem tipo** — os blocos não dizem, item a item, se cada veto foi total ou parcial.

## Dataset 7 — o regime de urgência, e a coluna que está vazia de propósito

Arquivo: `proposicoes-em-regime-de-urgencia`. **Cinco linhas em 22.748 proposições.**

### A coluna `prazo_dias` está vazia em toda linha, e isso é um resultado

O roteiro pede *"prazo observado"*. **Nenhum dos cinco requerimentos diz um número de dias.** Os
cinco corpos foram lidos inteiros, à mão. O que eles dizem é a **base legal** —
`nos termos dos arts. 145, inciso XVI e 164 do Regimento Interno` — e isso está publicado na
coluna `base_regimental`, ao lado da ausência, para que ela venha com o motivo.

A coluna vazia quer dizer **"não publicado"**, não **"sem prazo"**. O prazo é regimental: quem
quiser calculá-lo precisa do Regimento Interno, que esta tabela não lê.

### O que cada coluna responde

| coluna | |
|---|---|
| `requerimento`, `autoria_requerimento` | quem pediu a urgência |
| `alvo_identificado` | se a proposição-alvo foi encontrada no acervo — **4 de 5** |
| `urgencia_votada`, `resultado_rotulo` | se o requerimento foi a voto, e o rótulo que o Painel publicou — **1 de 5** |
| `prazo_dias` | sempre vazia; ver acima |
| `base_regimental` | os artigos que o requerimento cita — **4 de 5** |

### O que esta tabela NÃO diz

**Não diz que estas cinco são todas as proposições que tramitaram em urgência.** São todas
aquelas para as quais existe um *requerimento pedindo o regime* neste registro. O campo
`regimeUrgencia` da API é servido e vem `false` nas 22.748, e **nenhum evento de tramitação das
cinco menciona urgência** — se o regime chegou a ser aplicado é coisa que este registro não diz.

**A quinta linha aponta para `PL 230/2019`**, fora da janela de coleta 2022–2026. Ela está
publicada com `alvo_identificado = nao` em vez de descartada, porque a falha do elo é visível
na tabela e não ao lado dela.

## Como refazer

```
PYTHONPATH=src python3 -m cldf.harvest --ano 2024     # refaz a coleta
PYTHONPATH=src python3 -m cldf.export                 # refaz as tabelas
PYTHONPATH=src python3 -m cldf.verify                 # confere contra a API de hoje

PYTHONPATH=src python3 -m cldf.painel                 # coleta as votações (2023-2026)
PYTHONPATH=src python3 -m cldf.painel --replay        # refaz a partir da evidência guardada

PYTHONPATH=src python3 -m cldf.presenca               # coleta as presenças em plenário (2020-2026)
PYTHONPATH=src python3 -m cldf.presenca --replay      # refaz a partir da evidência guardada
```

Só é preciso Python 3.12. **Nenhuma biblioteca externa** — o programa inteiro usa apenas a
biblioteca padrão, para que quem audita um número consiga ler todas as linhas que o
produziram.

## Se os seus números derem diferente

`verify` responde à pergunta que decide tudo: **a API mudou, ou este projeto errou?**

O arquivo [`../raw-manifest.json`](../raw-manifest.json) guarda o hash de cada resposta que
este projeto recebeu. `verify` refaz as consultas e compara. Se ele disser que nenhuma
resposta que alimenta as tabelas mudou, então as tabelas têm de bater byte a byte — e se as
suas não baterem, o erro é deste projeto e a evidência para encontrá-lo está aqui.

Duas coisas que `verify` trata como **não sendo** mudança de dado, e por quê:

- **A ordem das chaves no JSON da API varia entre execuções.** Na primeira reprodução
  completa, **40 de 66 respostas mudaram em bytes sem mudar em conteúdo**. O veredito é dado
  sobre o conteúdo (`sha256_canonico`), não sobre os bytes literais.
- **O total geral da base da CLDF muda o tempo todo.** Ele subiu de 155.965 para 155.971
  durante a própria sessão que gerou estas tabelas. Isso não afeta 2024 e não é tratado como
  falha; consultas que alimentam as tabelas publicadas estão marcadas com
  `fonte_das_tabelas: true` no manifesto.

## Reprodutibilidade byte a byte

Os `.csv` **e** os `.xlsx` são reproduzíveis byte a byte: exportar duas vezes os mesmos dados
gera arquivos com o mesmo SHA-256. Isso exigiu escrever o `.xlsx` à mão, porque um `.xlsx` é
um ZIP que normalmente carrega a hora em que foi criado — e um arquivo que carrega "agora"
nunca é igual a si mesmo.

Nenhum arquivo publicado aqui contém data ou hora interna. As datas ficam neste texto, onde
não custam nada.

**Verificado de novo em 27/08/2026, com o dataset 2.** O acervo local foi apagado, reconstruído
**apenas** a partir das 45.917 respostas guardadas em `data/raw/` — sem nenhuma chamada de rede —
e reexportado: `proposicoes-honorificas-comemorativas-e-mocoes.csv` e `.xlsx` saíram **idênticos
byte a byte** aos publicados aqui. As nove tabelas anteriores também não mudaram um único byte.

## Dataset 8 — emendas à LOA por deputado e partido, e as duas coisas que a tabela não é

Arquivos: `emendas-loa-por-deputado`, `emendas-loa-por-deputado-e-ano`, `emendas-loa-cobertura`.
**3.286 emendas, exercícios 2023–2026**, lidas do **Painel de Emendas Parlamentares** do Portal da
Transparência da CLDF — um relatório Power BI publicado pela Câmara, o segundo que este projeto lê.

### Por que este dataset existe agora, se a OS-013 disse que não podia existir

A OS-013 leu a API JSON e achou a emenda sem autor (1.242 de 1.242), o autor sem partido (227 de
227) e nenhum bloco. **Tudo isso continua verdadeiro para a API.** O painel é outra superfície, e
nela cada emenda vem com `NO_PARLAMENTAR` e `NO_PARTIDO`. O que mudou foi onde se olhou.

### O que `status_execucao` é, e o que não é

O roteiro pede *acatadas, rejeitadas, prejudicadas*. **Essa informação não está aqui.** O painel
diz se a emenda está `ATIVO` ou `CANCELADO` na execução orçamentária — outra pergunta. A API tem o
domínio de status legislativo (`Rejeitado(a)`, `Prejudicado(a)`…) mas não tem o deputado. Nenhuma
superfície pública da CLDF liga as duas coisas, e esta tabela não finge que liga.

### Antes de somar por partido, leia isto

`partido` é **o rótulo atual do painel** para o parlamentar, não o partido na data da emenda.
**Oito parlamentares aparecem como `GDF`** — Agaciel Maia, Arlete Sampaio, Cláudio Abrantes,
Fernando Fernandes, José Gomes, Júlia Lucy, Leandro Grass, Rafael Prudente — e **todas as emendas
deles na janela estão canceladas**. Estão publicados exatamente como o painel os publica.

### Os valores são as medidas do painel, não a soma das linhas

`vl_lei_alteracao`, `vl_empenhado`, `vl_bloqueado`, `vl_disponivel` são as medidas DAX que a
página mostra. A soma da coluna `VL_EMENDA` das linhas de fato **discorda** delas em 260 de 1.024
emendas de 2023 e não é publicada. `registros_na_fonte` diz sobre quantas linhas a medida foi
calculada. Detalhe: `docs/specs/DESIGN-dataset8.md` §3.

### Cobertura

O painel traz 2021 a 2026; publicado 2023 a 2026, por decisão do operador (OS-051). Os dois
exercícios de fora estão contados em `emendas-loa-cobertura`. `as_of` = `lastRefreshTime` do
modelo, 2026-09-01.

## Dataset 13, segunda leitura — todas as sessões que o painel nomeia, e o que "sem presença" não quer dizer

Arquivo: `sessoes-plenarias-por-sessao`. **1.259 sessões, 2020–2026**, lidas da dimensão
`DM_SESSAO` do Painel de Votação — 1.264 linhas na dimensão, 5 sentinelas da própria fonte
(códigos negativos, data 1900-01-01) excluídas e contadas. A tabela de 2 linhas lida das Listas
de Presença em PDF (`sessoes-plenarias-quorum`, OS-018) continua publicada ao lado; as duas
sessões que ela cobre conferem com esta em `presentes` (21 e 8), e a exportação recusa
divergência.

### `presenca_registrada = nao` não é "cancelada por falta de quórum"

O roteiro pede sessões *previstas, realizadas, canceladas por falta de quórum*. O painel tem
`status_sessao` ABERTA ou FECHADA e nada mais — nenhuma coluna diz "prevista" nem "cancelada".
O que a tabela diz é: **961 sessões têm presença registrada** (`FT_PRESENCA`) e **298 não têm**.
Das 298, **294 são sessões solenes** (2025 e 2026), para as quais o painel não registra presença;
4 são ordinárias ou extraordinárias sem registro. Uma sessão sem presença registrada é uma sessão
sobre a qual a fonte cala, não uma sessão que não houve.

### `quorum_atingido` é derivação, e fica vazia quando não há o que derivar

`sim` quando `presentes` ≥ 13 de 24 (maioria absoluta, LC nº 13/1996, art. 20, II); `nao` quando
há presença registrada e ela fica abaixo; **vazia** quando não há presença registrada. Nas 961
com registro: 752 atingiram, 209 não. `presentes` conta parlamentares distintos; o painel traz
mais de uma linha para 1.489 pares (achado F-041), e isso não muda a contagem.

### Uma linha traz `tipo_sessao = CODIGO 4`

A dimensão de tipos do painel nomeia nove códigos; a sessão `2021`, remota, traz o código 4, que
a dimensão não nomeia. Publicado como código, não como palavra inventada.

## Dataset 1, segunda superfície — o Painel de Proposições, e por que 5.099 e 4.932 são o mesmo ano

Arquivos: `proposicoes-painel-conferencia`, `proposicoes-painel-tema`, `proposicoes-painel-autoria`.
**19.503 proposições, 2023–2026**, lidas do **Painel de Proposições** do Portal da Transparência — o
terceiro relatório Power BI que este projeto lê. O dataset 1 continua sendo o que a API JSON diz;
estas tabelas ficam **ao lado** dele, não no lugar.

### A diferença de 2024 é de ano, não de cobertura

Para 2024 a API tem 4.932 proposições e o painel tem 5.099. A chave é o identificador interno da
proposição, **o mesmo nas duas superfícies** (19.392 pares conferidos: mesmo `PROPOSICAO`, mesma
`DATA_LEITURA`). Casando por ele, a diferença se decompõe inteira: 4.885 estão nas duas em 2024;
**214 estão no painel em 2024 e na API em 2025**; 45 estão na API em 2024 e no painel em 2023; 2
estão só na API. **Nenhuma proposição de 2024 está só no painel.** O `ano` da API é o ano do número
(`PL 971/2024`); o `ANO` do painel é a coluna da dimensão `dmProposicao`, que em 293 proposições
da janela é **um ano antes** do ano do número — o que essa coluna significa, a CLDF não diz em lugar
nenhum que este projeto alcance. A tabela de conferência mostra os dois lados; ninguém foi ajustado.

### O que mais a conferência diz

- **111 proposições de 2026 estão só no painel** — todas lidas pela CLDF depois de 2026-08-20,
  a última data de leitura que a coleta da API alcançou (o painel foi atualizado em 2026-09-01).
  É a idade da coleta, não uma lacuna.
- **17 proposições estão só na API** (15 de 2023, 2 de 2024): o painel não as traz. Publicado
  como está; não sabemos por quê.
- A coluna `so_no_painel_ausente_da_api` é **0** em todas as linhas.

### `tema` e `tipo_autor`

`dmTema` classifica cada proposição em um ou mais de 48 temas (Saúde, Educação, Trânsito…); a API
JSON não tem essa classificação. `dmAutor.tipo_autor` diz se o autor é PARLAMENTAR, ORGAO_EXTERNO,
UNIDADE_INTERNA, INICIATIVA_POPULAR ou SUGESTAO_LEGISLATIVA; a API traz o nome, não o tipo. Uma
proposição (`QO 3/2025`) não tem tema nem autor no painel. `ano` nessas duas tabelas é o do painel.
`as_of` = `lastRefreshTime` do modelo, 2026-09-01. Detalhe: `docs/specs/DESIGN-proposicoes-painel.md`.

## Produção e resultado por deputado — uma linha por deputado, e o que ela não é

Arquivos: `producao-por-deputado`, `deputados-chave`. **25 deputados distritais da 9ª Legislatura
(2023–2026)**: quem consta como autor de ao menos uma proposição do período na API JSON. Nenhuma
coluna é uma leitura nova: cada uma é a **re-soma** de uma tabela já publicada aqui, no mesmo
período, e `provenance.json` → `deputados` diz quais conferências passaram antes de o arquivo
ser escrito. Zero consultas à CLDF.

### O que cada grupo de colunas soma

- `apresentadas`, `ind`/`req`/`moc`/`pl`/`pdl`/`plc`/`pelo`/`pr`/`outras_especies`, `aprovadas`,
  `rejeitadas`, `pendentes`, `nao_se_aplica`, `inclassificavel`: `proposicoes-apresentadas-e-
  aprovadas-por-autor`, somada por deputado. **Uma proposição em coautoria conta para cada
  autor**, como o dataset 1 já faz. `aprovada` = aprovada pela Casa, nunca "virou lei".
- `deliberadas_com_data`, `dias_mediana_ate_deliberacao`: o relógio do dataset 12 (data de
  leitura → marcador terminal) sobre as aprovadas e rejeitadas com data; mediana de posto mais
  próximo, então toda mediana publicada é a duração real de uma proposição real.
- `emendas_gabinete` e os desfechos (`aprovadas`, `rejeitadas`, `nao_apreciadas`, `prejudicadas`,
  `retiradas`, `sem_desfecho`): as emendas que o **gabinete** protocolou (documento do tipo Emenda,
  unidade `GAB DEP …`, data do documento no período) pelo desfecho **estrutural** do documento —
  nenhuma leitura de prosa. São as emendas do deputado a projetos de qualquer autor, não as
  emendas recebidas pelos projetos dele.
- `sessoes_presente`, `sessoes_registradas`, `primeira_sessao`, `ultima_sessao`,
  `partidos_no_periodo`: `frequencia-deputados-em-plenario-por-ano`, somada. O denominador é o
  que o Painel de Votação **registra** (547 sessões no período), não o calendário. Os partidos
  vêm como o painel os grava, sentinelas incluídas (`INVÁLIDO`, `NÃO INFORMADO`).
- `loa_emendas`, `loa_canceladas`, `loa_vl_lei`, `loa_vl_empenhado`, `loa_vl_bloqueado`,
  `loa_vl_disponivel`: `emendas-loa-por-deputado`, somada ao centavo. As 169 emendas sob nomes
  `GDF` não entram em nenhuma linha e são contadas em `provenance.json`.
- `ccj_pareceres`, `ccj_admissivel`, `ccj_admissivel_com_ressalva`, `ccj_inadmissivel`,
  `ccj_outro_veredito`: **quantos** pareceres da CCJ (pela regra do dataset 3 — a comissão lida
  na cláusula do próprio parecer, nunca pelo cabeçalho) recaíram sobre proposições que o deputado
  assina. 419 pareceres no período, 29 deles `inadmissivel`; 75 recaem sobre proposições sem
  deputado signatário (Executivo, Mesa, comissões) e não entram em linha nenhuma.

### Antes de ordenar por qualquer coluna, leia isto

**Não é ranking, e a tabela não normaliza por tempo de mandato.** O acervo não tem calendário de
licenças e suplências; um deputado que assumiu depois ou saiu antes tem contagens menores, e a
tabela mostra isso pelas datas (`primeira_sessao`, `ultima_sessao`) em vez de corrigir. `Rafael
Prudente` está na tabela com uma indicação, dez emendas à LOA canceladas a zero e nenhuma sessão:
a linha fica, e `deputados-chave` diz em quantas fontes ele aparece (2 de 4).

**Contagens, nunca taxa.** As colunas `ccj_*` são as primeiras por deputado derivadas de uma
leitura de prosa, e por isso vêm com o denominador ao lado e sem nenhuma divisão: uma taxa sobre
`verdict_prosa` é o gatilho registrado do projeto, testado aqui contra um candidato real e
deliberadamente não disparado. A exportação **recusa** uma coluna cujo nome prometa percentual
e qualquer número quebrado numa coluna de contagem.

### `deputados-chave`

O mesmo nome está escrito de quatro jeitos: `Deputado Fábio Felix` (API), `FÁBIO FELIX` (Painel
de Votação), `FÁBIO FELIX` (Painel de Emendas), `GAB DEP FÁBIO FÉLIX` (cabeçalho do documento). A
chave é sem acento, em maiúsculas, sem o prefixo de cada fonte, e com **uma** abreviação declarada
(`PR DANIEL DE CASTRO` → `PASTOR DANIEL DE CASTRO`). As quatro colunas de nome trazem a grafia
original; vazia = a fonte não tem esse deputado no período. Detalhe: `docs/specs/DESIGN-deputados.md`.

## Ausência e frequência — o voto que não foi dado e a sessão a que não se foi

Quatro arquivos, e uma advertência antes de todos: **este projeto não publica veredito.** A norma
que define o limite de faltas ressalva expressamente *licença, afastamento, ausência justificada
ou missão autorizada*, e **nenhuma fonte pública que este projeto alcança traz esse registro**. No
que está aqui, uma falta e uma licença são a mesma linha. As tabelas dão os números; a conclusão é
de quem lê, com essa ressalva à vista. A norma, artigo por artigo, está em
`docs/specs/NORMA-frequencia.md`; a derivação, em `docs/specs/DESIGN-frequencia.md`.

## Verba indenizatória: o gasto de gabinete, e as duas contas que a CLDF publica dele

A verba indenizatória é o recurso que a Casa repassa para custear os trabalhos dos gabinetes —
locação de imóvel e de veículo, combustível, material, consultoria, divulgação. **A CLDF publica
esse gasto em dois lugares, e eles não dizem a mesma coisa.**

### `verba-indenizatoria-por-deputado-e-mes` — o Quadro Demonstrativo

É a consolidação da própria Casa, lida do painel que ela publica na página de Verbas
Indenizatórias do Portal da Transparência. Uma linha por deputado e mês, nas **nove rubricas que a
CLDF usa**, com o teto mensal autorizado ao lado do gasto.

**R$ 10.608.419,85 gastos na 9ª Legislatura, contra R$ 19.922.934,96 de teto autorizado.**

Em **24 das 1.008 linhas** a soma das nove rubricas não é o total que o painel mostra. Os dois
números estão publicados lado a lado e a coluna `rubricas_somam` diz quando não batem. É um fato
sobre a fonte, não um erro consertado aqui.

### `verba-indenizatoria-por-comprovante` — as notas

2.226 comprovantes, um por linha, com fornecedor, CNPJ, número, data, valor e a classificação
**como a fonte a escreveu**. A fonte usa **64 grafias diferentes** para as mesmas nove rubricas —
só "combustível" aparece em cinco — e deixa 74 células em branco. Este projeto **não normaliza**
essa coluna: a rubrica normalizada já existe e é a da própria Casa, na tabela acima.

**Nenhum CPF é publicado**, nem do deputado nem do prestador, embora a fonte traga os dois. Um CPF
público numa planilha é uma coisa; consolidá-lo numa tabela feita para ser baixada e cruzada é
outra. O **CNPJ do fornecedor É publicado** — é registro de empresa e é o que identifica quem
recebeu — mas só quando os seus dígitos verificadores conferem, e a célula bruta da fonte não sai:
**em 19 linhas ela traz um CPF**, e o que se publica no lugar é `forma_do_registro_na_fonte`, que
diz o que a célula era sem repetir o número.

**Uma linha publica uma data que este projeto não corrige e um mês que ele não afirma.** O
comprovante **6469** traz `data = 1907-01-17` numa linha cujo próprio `ano` é 2023 — 116 anos de
distância. A data **continua publicada exatamente como veio**: este projeto não corrige fonte, e
pode ser o que o papel diz. O que saiu foi o **`mes`**, que não é da fonte — era este projeto que
o derivava da data — e que publicava `1907-01`, uma competência que fonte nenhuma declara.
A célula está vazia e a linha é contada (`data_fora_do_ano_declarado`). O recibo de R$ 718,00
segue publicado, com valor, fornecedor e CNPJ.

**O contorno da regra foi medido, não arbitrado.** Sobre os 2.226 comprovantes, a distância entre
o ano da data e o ano da linha é: **+0 em 2.107**, **+1 em 19**, **−1 em 1** e **−116 em 1**. A
população ±1 é contabilidade ordinária — 13 comprovantes de janeiro/2024 arquivados sob o
ano-verba de 2023, uma despesa de dezembro paga em janeiro — e **mantém o seu mês**. Só a
distância maior que um ano esvazia a célula.

### `conferencia-verba-comprovantes-x-quadro` — o achado

Comparando as duas publicações, por deputado e mês:

- **100 de 1.012** pares batem ao centavo.
- **729 existem só no Quadro** — meses inteiros de gabinete cujo gasto a Casa consolida e para os
  quais **nenhuma nota foi publicada**.
- **4 existem só nos comprovantes.** Eram cinco: a quinta era `IOLANDO, 1907, 1` — uma
  competência que só existia porque este projeto a derivava da data acima, e que saiu com ela.
- Somados, os comprovantes publicados são **R$ 3.984.937,03: 37,6 %** do que a Casa consolida.

Um mês sem nota publicada aparece com a coluna **vazia**, nunca com zero. Zero diria que o
gabinete não gastou; o que a fonte diz é que nada foi publicado.

### `verba-indenizatoria-fornecedores` — quem recebeu

233 fornecedores, agrupados pelo CNPJ, com **todas** as grafias que a fonte usa para cada
registro (nenhuma escolhida como canônica). **81 deles atendem mais de um gabinete.**

O agrupamento é aritmético e não tipográfico, e isso não é preciosismo: a primeira versão
completava todo CNPJ com zeros à esquerda, e com isso juntou o Auto Posto Andrade com o Posto
Colina, e o Facebook com uma locadora de vídeo, sob um mesmo "fornecedor". A regra final verifica
os dois dígitos verificadores do próprio CNPJ — o que recupera **746** registros cujos zeros à
esquerda uma coluna numérica tinha perdido, e recusa os 100 valores que não são registro nenhum.

**As duas colunas de data — corrigidas na `v0.27.1`, e vale dizer o que estava errado.**
`primeiro_comprovante` e `ultimo_comprovante` saem **só** de datas que a fonte escreveu como data
(`AAAA-MM-DD`): **2.128 dos 2.226 comprovantes**. A fonte escreve os outros **98** como texto
livre cortado em dez caracteres — `3/31/2026`, `01 de sete` (cortado no meio da palavra),
`31/052026` — e um deles é `TOTAL GERA`, o rótulo da linha de total da própria planilha. Esses 98
não entram em nenhuma das duas pontas. **Um fornecedor cujos comprovantes não tragam nenhuma data
legível publica as duas células vazias** — são **2** dos 233. Célula vazia aqui quer dizer *«a
fonte não escreveu uma data que dê para ler»*, **nunca** *«não houve comprovante»*: a coluna
`comprovantes` continua inteira.

Até a `v0.27.0` estas duas colunas eram o menor e o maior **texto** daquela coluna, o que é uma
comparação alfabética entre coisas que não são datas — e como letra ordena depois de dígito, a
linha sem CNPJ publicava `ultimo_comprovante = TOTAL GERA`. Nove das 233 linhas mudaram.
Nada foi adivinhado: ler `3/31/2026` exigiria decidir que o primeiro campo é o mês, e a fonte não
diz isso em lugar nenhum. É a mesma recusa de `prazo_dias`, dos dois meses de 0 bytes das diárias
e das 13.245 células de rótulo vazias do orçamento — **este projeto publica vazio antes de
publicar palpite**.

A derivação inteira, com o guard e as medições, está em `docs/specs/DESIGN-verba.md`.

## Diárias, e a parte da ausência que passa a ter nome

Até aqui este projeto descrevia o que um deputado **produz** e onde ele **está**. Não descrevia
um único real do que ele **custa**. Estas quatro tabelas abrem esse eixo, e a primeira coisa que
elas fazem é fechar — **em parte** — o maior limite declarado da tabela de frequência.

`frequencia-em-sessoes-ordinarias` não tem coluna de veredito porque o art. 19, grupo II, do
Código de Ética ressalva do limite a *"licença, afastamento, ausência justificada ou **missão
autorizada pela Câmara Legislativa**"*, e nenhuma fonte alcançável publicava esse registro.
A folha de diárias publica uma parte dele: cada pagamento nomeia um **período de afastamento** e
o **Ato da Mesa Diretora** que o autorizou.

### `diarias-por-beneficiario`

Um pagamento por linha, como a CLDF o publica no seu portal de dados abertos: **163 pagamentos,
R$ 1.090.115,28**, de 2023 a 2026. **44 a deputados e 119 a servidores, consultores, assessores e
diretores** — a diária é da Casa, não do gabinete, e a tabela publica as duas coisas.

Três colunas da fonte são texto livre e foram lidas por este projeto, com o texto original ao
lado de cada leitura:

- **o período** — `01/02 a 08/02/2026` é um intervalo, mas `24/06 e 07/07/2025` são **dois dias**,
  não seis semanas. A coluna `periodo_forma` diz qual dos dois (ou `data_unica`, ou `ilegivel`).
  **Duas linhas** têm período ilegível e não cobrem nada.
- **o valor** — a fonte escreve `R$ 20.443,50` num lugar e `13880.25` no outro; há **uma devolução
  negativa**. Uma célula ilegível deixa a coluna vazia, nunca vira zero.
- **a quantidade** — `3 diárias e meia`, `meia diária`, e a grafia `diárais`. Uma não foi legível.

### `ausencias-e-afastamento-autorizado`

A partição, por deputado e sessão legislativa: **93 das 3.586 faltas às ordinárias da 9ª
Legislatura — 2,6 % — caem dentro de um período de afastamento autorizado por Ato da Mesa.**

**Leia o nome da terceira coluna com cuidado.** `ausencias_sem_cobertura_conhecida` é **o que a
fonte não explica**, não o que é injustificado. A diária cobre missão oficial e mais nada: não é
licença médica, não é licença para tratar de interesse particular, não é licença-maternidade, não
é luto, não é ausência justificada — e nenhuma dessas tem fonte pública consolidada. Os outros
3.493 casos continuam exatamente tão indeterminados quanto estavam.

Dezessete dos 24 deputados receberam ao menos uma diária; sete não receberam nenhuma, e as linhas
deles trazem zero na coluna do meio — o que não diz nada sobre as faltas que têm.

### `ordinarias-em-afastamento-autorizado`

A tabela em que a coluna acima se confere **linha a linha**: cada sessão ordinária que caiu dentro
de um período autorizado, com a data, o Ato da Mesa, o destino e o motivo que a própria CLDF
publicou. São **102**, e em **9 delas o deputado compareceu assim mesmo** (`presente = sim`).
Essas nove não contam como falta coberta — não houve falta a cobrir — e estão aqui porque são a
prova de que a cobertura **não é mecânica**.

### `conferencia-diarias-planilha-x-portal-de-dados`

A mesma folha de diárias é publicada em dois lugares: uma planilha por mês no Portal da
Transparência e um recurso estruturado no portal de dados abertos, que é a fonte das três tabelas
acima. Esta tabela compara as duas, mês a mês, no ano corrente.

**Seis dos sete meses legíveis batem ao centavo** — inclusive contra o total que a própria
planilha imprime na última linha. Os outros três casos estão publicados em vez de omitidos:

- **abril e julho de 2026** — o portal lista o arquivo do mês e serve **zero bytes**. O mês não
  foi conferido, e `linhas_na_planilha = -1` diz isso em vez de fingir um mês sem diárias.
- **agosto de 2026** — as duas publicações discordam **duas vezes**: o portal de dados traz uma
  quarta linha (R$ 1.300,00) que a planilha não tem, e para uma linha que ambos têm eles declaram
  quantidades diferentes de diárias (`4 diárias e meia` contra `2 diárias e meia`) pelo mesmo
  valor. É um fato sobre a fonte. Não foi corrigido aqui.

A conferência cobre **o ano corrente e mais nada** — a página serve um ano por vez, e o
denominador está dito na regra da tabela em vez de ficar implícito.

### O nome, pela quinta vez

As outras quatro fontes escrevem o nome parlamentar; as diárias escrevem o **nome civil completo**
— e não de forma consistente: **seis dos dezessete** deputados que receberam diária aparecem sob
duas grafias na mesma fonte (`Martins Machado` e `Marcos Martins Machado`; `Doutora Jane` e `Jane
Klebia Reis`). `deputados-chave` ganhou a coluna `nome_nas_diarias` com **todas** as grafias, e
cada equivalência está declarada no código, nunca inferida por semelhança. A coluna `fontes`
continua contando quatro: as diárias são fonte de pagamento, não de produção, e um deputado que
nunca viajou não tem cobertura menor por isso.

A derivação inteira, com o guard e as medições, está em `docs/specs/DESIGN-diarias.md`.

### `ausencias-em-votacoes-nominais` e `ausencias-por-votacao-nominal`

`votos-nominais-por-deputado` mostra 9.068 votos **dados**. Falta o outro lado, e é este: o
deputado constava **presente na sessão daquele dia** e **não registrou voto**. São **1.606** casos
em **10.637** oportunidades, ao longo das **482 votações nominais** de 2023 a 2026 — de 28 em 459
a 118 em 388, conforme o deputado.

Duas colunas de denominador, de propósito:

- `votacoes_nominais_presente` / `presente_e_nao_votou` — a medida defensável: ele estava na Casa.
- `votacoes_nominais_da_sessao_legislativa` / `nao_votou` — todas as nominais do período, presente
  ou não. É o número que a maioria presume; mistura falta à sessão com falta ao voto, e está aqui
  para que a mistura seja visível em vez de suposta.

**Abstenção é voto** e tem coluna própria. Deixar de registrar não é abster-se.

**O que não dá para medir, e é a maior parte:** das votações do período, **2.888 são simbólicas**,
e nelas o painel guarda uma única linha-marcador sem nome de deputado nenhum. Em 85 % das
votações, portanto, **a ausência não é mensurável** — não porque este projeto tenha escolhido não
medir, mas porque a fonte não registra.

### `frequencia-em-sessoes-ordinarias`

Já existe `frequencia-deputados-em-plenario-por-ano`, que divide pelo **ano civil sobre todos os
tipos de sessão**. A norma não faz isso: ela conta **sessões ordinárias** dentro de cada **sessão
legislativa** (107, 108, 124 e 68, contra 139, 157, 167 e 84). São denominadores diferentes, e só
o segundo pode ser comparado ao limite da norma. Esta tabela usa o segundo; a outra continua onde
está.

`limite_regimental` é o menor número de faltas que alcança **a terça parte** das ordinárias
daquele período — o limite do art. 19, grupo II do Código de Ética da CLDF (Resolução nº
341/2024). Ele é publicado **como número, ao lado das faltas**. Não há coluna dizendo se o
deputado passou dele, pela razão do parágrafo de abertura.

**E a resposta depende do denominador — os dois estão na mesma linha porque escolher um seria
escolher a conclusão pelo leitor:**

| se o denominador for | quantos alcançam o limite em ao menos uma sessão legislativa |
|---|---|
| todas as ordinárias | **23 de 24** |
| só as que reuniram quórum (13 presentes) | **7 de 24** |

**O recesso não conta como falta.** O Regimento (art. 4º, I) marca os períodos legislativos de 1º
de fevereiro a 30 de junho e de 1º de agosto a 15 de dezembro; o denominador são as ordinárias
efetivamente realizadas, então julho e a virada do ano saem sozinhos. Medido: das 407 ordinárias,
**0** caem fora desses períodos.

**Ninguém desta legislatura teve mandato parcial.** Os 24 deputados aparecem pela primeira vez em
2023-02-01 e todos os 24 nas três semanas finais da coleta. Uma contagem baixa aqui não se explica
por ter assumido tarde ou saído cedo.

### `sessoes-ordinarias-por-dia-da-semana`

A tabela que evita a leitura errada de todas as anteriores. **Das 407 ordinárias, 123 não
reuniram os 13 deputados da maioria absoluta e 3 não registraram presença alguma** — e isso não
está espalhado por igual:

| sessão legislativa | terça | quarta | quinta |
|---|---|---|---|
| 33 (2023) | 40 sessões, mediana 23 presentes | 37, mediana 20 | 30, mediana 14 |
| 34 (2024) | 38, mediana 21 | 35, mediana 20 | 35, mediana 10 |
| 35 (2025) | 37, mediana 22 | 37, mediana 19 | 49, **mediana 2** |
| 36 (2026) | 24, mediana 21 | 23, mediana 15 | 21, **mediana 1, nenhuma com quórum** |

A terça-feira se sustenta nos quatro anos. A quinta-feira deixa de reunir. Em 2025 a Casa passou
a registrar **duas ordinárias na mesma quinta** em 16 datas, e em ambas comparecem de 1 a 5
pessoas.


---

## A cadeia da despesa (OS-061)

Seis tabelas. Quatro são as superfícies que a própria CLDF publica, uma é a aritmética entre elas,
e uma é o credor.

### O que você pode perguntar a estas tabelas

**"Chegou tudo o que estava previsto?"** Não. Em **8 dos 60 meses** o repasse recebido difere do
previsto, e o acumulado 2022–2026 é de **−R$ 62.705.553,92**. Três das oito diferenças são grandes
e caem todas em **dezembro** — 2023 sozinho é −R$ 70,0 milhões. As outras cinco são de um a dois
centavos. A coluna `diferenca_recebido_previsto` traz cada uma.

**"As contas da própria fonte fecham?"** Em 55 dos 60 meses, sim. Em **5**, as três rubrigas
publicadas não somam o total publicado ao lado delas. A coluna `rubricas_somam_o_total` diz quais,
e o total continua sendo **o da fonte** — nós não o recalculamos.

**"Por que o liquidado às vezes é maior que o empenhado?"** Porque são **estágios**, não somas. O
que se empenha em março se liquida em abril, e a tabela é mensal. A desigualdade
empenhado ≥ liquidado ≥ pago **vale nos cinco anos** e falha em 42 dos 55 meses — isso é calendário,
não inconsistência. **Nunca some as três colunas**: elas são o mesmo dinheiro em três momentos, e
somá-las triplica o gasto da Casa.

**"A Casa paga na ordem?"** O art. 141 §1º manda pagar por ordem de exigibilidade e **justificar
por escrito** quando essa ordem é quebrada. A fonte publica a coluna dessa justificativa e ela está
**vazia nas 6.313 linhas**. Então derivamos, das duas datas que a fonte publica, quantas obrigações
mais antigas cada pagamento ultrapassou: **3.860 das 6.313 ordens (61 %) ultrapassaram ao menos
uma**, 36.641 ultrapassagens no total.

**Leia essa coluna com estes quatro limites, que são nossos e estão escritos antes do número:**
a coluna se chama **ultrapassagem** e não *irregularidade* — a lei admite exceções que o arquivo
não marca; a regra vale dentro de uma fonte de recursos e uma categoria, e **6.310 das 6.313
linhas estão numa única fonte**, o que torna esse recorte quase inócuo; liquidações do mesmo dia
não contam como ultrapassagem; e uma ordem perto do fim da janela tem menos pagamentos posteriores
para ultrapassar, então **2026 conta menos por ser recente, não por ser mais ordeira**.

**"Quanto do dinheiro dá para ver em detalhe?"** Pouco. As notas de empenho somam **13 % a 27 %**
do empenhado do ano; as ordens bancárias, **10,7 % a 17,1 %** do pago. O motivo é que os dois
registros detalhados cobrem despesa **contratual**, e o grosso do gasto da Casa é **folha**, que só
aparece agregada — sem contraparte, sem objeto e sem data. **Não publicamos essa fração como
coluna**: numerador e denominador estão em `conferencia-da-cadeia-da-despesa` e a divisão é sua.

**"Quem fornece à Casa pelas duas portas?"** Três, e as três são concessionárias: **Neoenergia,
Caesb e Telefônica**. Cruzamos os 572 credores do contrato central com os 232 fornecedores de
gabinete do OS-060, por CNPJ verificado no dígito. As duas economias quase não se tocam, e essa
quase-ausência é o resultado.

**"E o empenho, dá para ligar ao pagamento?"** Não por chave. O arquivo de empenhos publica o
credor como **nome puro** — nenhum CNPJ — e o de pagamentos publica o registro. A ponte por credor
não existe na fonte, então a conferência entre os dois estágios é **por ano**, que é chave sólida.

### Sobre CPF

**Nenhuma tabela deste acervo publica um identificador pessoal.** Desde esta versão, toda célula de
toda tabela passa por uma redação antes de ser escrita, e o exportador **se recusa a escrever** se
sobrar algum. Onde a fonte trazia um CPF ou um RG, você lê `[redigido]` — **o nome permanece**,
porque numa Moção de louvor o nome é o objeto do ato público; o número ao lado dele não é.

Isso corrigiu, nesta versão, quatro tabelas que já estavam publicadas: duas traziam CPF e RG de
dois cidadãos privados dentro do texto de uma ementa, e duas traziam CPF dentro do nome de
fornecedores. Os bytes dessas quatro tabelas mudaram por essa razão e por nenhuma outra.

## A contratação (OS-063) — como a Casa compra, com quem contrata, e quem ela já puniu

Seis tabelas, de seis arquivos que a CLDF publica no seu portal de dados abertos. **Elas não se
ligam entre si**, e essa é a primeira coisa a saber antes de usá-las.

### O que você pode perguntar a estas tabelas

**"Quanto a Casa economizou nas licitações?"** Nos procedimentos que chegaram a adjudicar,
**R$ 268.829.253,65 estimados viraram R$ 210.570.407,23 adjudicados** — diferença de
**R$ 58.258.846,42**. A coluna `economia_calculada` é essa subtração, linha a linha, e você pode
refazê-la com as duas colunas ao lado.

**"E os procedimentos que não adjudicaram nada?"** São **70** — 34 dispensas e 36 licitações
(23 com R$ 0,00 publicado e 13 sem valor nenhum). Para eles a coluna de economia fica **vazia**.
Um pregão fracassado não economizou o valor estimado: ele não comprou. A fonte discorda disso em
uma linha, e nós publicamos a discordância em vez de escolher um lado — ver abaixo.

**"A conta da própria fonte fecha?"** O arquivo de dispensas publica a economia dele. Das 160,
**124 batem** com estimado − adjudicado ao centavo (`economia_confere = sim`) e **33 ficam em
branco** — são as fracassadas, em que nem a fonte nem nós publicamos economia, e onde não há o que
conferir. Nas outras **3**, `economia_confere` diz `não`: duas em que a subtração da fonte simplesmente não fecha (uma erra por R$ 0,23, outra
por R$ 4.108,56) e **uma dispensa fracassada à qual a fonte atribui R$ 1.200,00 de economia sem
ter adjudicado nada**.

**"Dá para ligar uma licitação ao contrato que ela gerou?"** **Não.** `contratos` não publica
número de processo e `licitacoes` não publica número de contrato. A cadeia procedimento → contrato
→ pagamento está partida na própria fonte, e nenhuma coluna nossa a remenda. O que dá para ligar é
**o processo** entre licitações e compras (167 das 340 compras têm processo que aparece também na
tabela de procedimentos) e **o CNPJ** entre contrato e pagamento.

**"Quem tem contrato com a Casa, e recebeu?"** São **288 CNPJs distintos** em 395 contratos.
**246 deles receberam ao menos uma ordem bancária** no contrato central (OS-062) — mas leia a
próxima frase antes de dividir: a ordem bancária foi paga *àquela empresa*, não necessariamente
*sob aquele contrato*. Não existe chave que diga sob qual contrato um pagamento saiu.

**"Quem fornece à Casa pelas duas portas?"** As mesmas **três concessionárias** que o OS-062 já
tinha achado — Neoenergia, Caesb e Telefônica —, agora com contrato do lado. Nenhum fornecedor de
gabinete a mais aparece contratado.

**"E as empresas punidas?"** São **11**. **2 têm contrato** com a Casa (AFEFE Turismo e CAMOA
Serviços Telecom) e **3 receberam ordem bancária**. A tabela publica o nome, o CNPJ, a sanção
inteira e esses números — **e nenhuma coluna de veredito**. A sanção pode ser posterior ao
contrato, pode ter sido reconsiderada (uma delas foi, de 24 para 18 meses de impedimento) e o
impedimento vincula uma esfera que estes arquivos não delimitam. O número está ao lado do nome; a
leitura é sua.

### O CNPJ que não confere, e por que ele importa

O CNPJ só é publicado quando **os dois dígitos verificadores conferem**: **381 dos 395** contratos.
Dos outros 14, o mais instrutivo é a **CEB Distribuição**, que aparece em duas linhas com
`07.552.669/0001-92`. O CNPJ que recebe 59 ordens bancárias da Casa é `07.522.669/0001-92` — **dois
dígitos trocados**. Confiar na string teria ligado o contrato a nenhum pagamento, e um "quase
igual" teria ligado à empresa errada. Os outros: dois registros truncados no último dígito, **um
CPF na coluna de CNPJ** (a mesma classe dos 19 que o OS-060 achou — não publicamos, nem inteiro nem
em pedaços), **uma célula com sete registros** de um acordo multipartes, e seis órgãos públicos que
o arquivo nomeia sem registro nenhum. `forma_do_registro` diz qual é o caso de cada linha.

### Gestor e fiscal

As colunas `gestor`, `fiscal_tecnico` e `fiscal_administrativo` trazem **nomes de servidores**,
como a fonte os escreve. São pessoas nomeadas em função pública num registro público — a mesma
postura que este acervo já toma com o nome de deputado. Não há normalização, chave nem tabela de
nomes: quem quiser contar contratos por fiscal terá de decidir sozinho se duas grafias são a mesma
pessoa.

### O que nenhuma destas tabelas diz

Não dizem se um preço é alto, se uma dispensa deveria ter sido licitação, nem se um contrato com
empresa sancionada é irregular. Nenhum dos seis arquivos carrega o que seria preciso para dizer
qualquer uma dessas coisas. As duas divisões que estes números mais convidam — a economia como
fração do estimado, e a fatia do contratado que virou pagamento — **não são publicadas como
coluna**: numerador e denominador estão nas tabelas, e a divisão é sua.

## A classificação orçamentária (OS-064)

O OS-062 publicou **o que a Casa pagou**. O OS-063 publicou **com quem ela contratou**. Nenhum dos
dois diz **para quê**. Cinco tabelas respondem isso, e uma delas responde com uma coluna vazia de
propósito.

Sobre 2022–2026, em 3.238 linhas: **R$ 3.396.739.847,18 empenhados**, R$ 3.110.613.426,37
liquidados e R$ 3.104.894.861,51 pagos. A **função 1** (legislativa) leva R$ 3.224.475.788,45 e a
**função 28** (encargos especiais) R$ 155.358.239,22. Uma única subfunção — a **122**, administração
geral — leva **R$ 2.885.302.994,10**, e esses dois números estão publicados lado a lado
exatamente para que a divisão seja sua e não nossa.

### O detalhamento fecha com o total — e isso é notícia

`conferencia-classificacao-x-total` faz a pergunta que nenhuma outra tabela deste acervo faz: **a
soma do detalhamento que a Casa publica bate com o total que a Casa publica?**

**Bate ao centavo. 55 meses × 3 estágios = 165 comparações, 0 diferenças.** Este projeto costuma
achar o contrário, e é justamente por isso que a concordância está publicada em vez de suposta:
quem quiser saber se os dois arquivos da CLDF são consistentes agora tem a resposta com data, e uma
execução futura que deixe de bater **interrompe a publicação** em vez de publicar a diferença
caladamente.

### As colunas de rótulo estão vazias, e o vazio é o achado

A CLDF publica `Função 1`, `Subfunção 31`, `Natureza 339030`, `Fonte 100` — e **rótulo nenhum para
nenhum deles**. Foi decidido publicar rótulo em vez de código nu, e o rótulo foi então procurado em
**cinco fontes, sem sucesso**:

| Onde | Para quê | O que respondeu |
|---|---|---|
| `www.gov.br` (Portaria MOG nº 42/1999) | função, subfunção | renderiza as páginas em JavaScript — 0 links de arquivo em 285 KB de HTML |
| `www.tesourotransparente.gov.br` (Portaria STN/SOF nº 163/2001, MCASP) | natureza | 91 conjuntos e **nenhuma** tabela de natureza da despesa |
| `www.economia.df.gov.br` (tabela de fontes do DF) | fonte | portal Liferay, mesma coisa |
| `dados.gov.br` | todos | **401** sem chave registrada — este projeto não possui e não cria credencial |
| o próprio JSON da LOA da CLDF | todos | traz `funcao`, `subfuncao`, `natureza` e `fonte` **também como códigos nus** |

Então `339030` é publicado como `339030`. **Nenhum rótulo é inventado, deduzido ou digitado de
memória** — o registro completo do que foi tentado está em
[`../norms/PROVENANCE.md`](../norms/PROVENANCE.md). Consulte os códigos na Portaria MOG nº 42/1999
(função e subfunção) e na Portaria Interministerial STN/SOF nº 163/2001 (natureza).

**O que está publicado ao lado do código e NÃO é rótulo:** a separação posicional dos dígitos, que a
Portaria 163/2001 define por posição. `339030` é `3 · 3 · 90 · 30`. Isso é aritmética sobre um
código, não uma palavra sobre ele.

### A natureza mudou de largura em julho de 2025 — leia antes de agrupar

**Este é o aviso mais prático desta seção.** A CLDF escreve a natureza em **seis dígitos até junho
de 2025** e em **oito de julho de 2025 em diante**:

| | 2022 | 2023 | 2024 | 2025 | 2026 |
|---|---|---|---|---|---|
| naturezas de seis dígitos | 36 | 34 | 35 | 36 (jan–jun) | — |
| naturezas de oito dígitos | — | — | — | 36 (jul–dez) | 36 |

Medido: **todos os 36** códigos de oito dígitos são um código de seis que a fonte também publica com
`00` no fim; **0** ficam órfãos; e **nenhum mês carrega as duas larguras**. Ou seja: os **72 valores
distintos são 36 naturezas em duas grafias**. Quem agrupar pela coluna `natureza` ao longo do
período inteiro vai obter 72 grupos onde a Casa nomeia 36 coisas — e cada natureza vai aparecer
partida em duas, com 2025 dividido ao meio.

Use **`natureza_em_seis_digitos`** para agrupar. Ela está publicada ao lado da grafia da fonte, não
no lugar dela.

### Transferências voluntárias: 60 meses, todos zero

`transferencias-voluntarias-recebidas` publica 60 meses de 2022 a 2026 e **todos os valores são
zero**. O conjunto existe, a Casa o mantém, e o que ele diz é que a CLDF não recebeu transferência
voluntária nenhuma em cinco anos. Um zero que a fonte afirma é publicado como zero; um mês que a
fonte omite fica ausente e **nunca** é preenchido com zero.

### O que ficou de fora, e por quê

`creditos-adicionais` (127 arquivos) e `leis-orcamentarias` (41) **não eram alcançáveis pela API do
CKAN** na época desta OS: 126 de 127 e 40 de 41 não têm datastore nenhum, o único que tem foi
ingerido pelo CKAN como uma coluna única chamada literalmente `[ {`, e os arquivos de verdade
redirecionam (302) para `minio.cl.df.gov.br` — um host que nenhuma linha do registro de acesso
nomeava então. Esse host foi lido do cabeçalho `Location` e **não seguido** por esta OS.
**Resolvido pela OS-070**, que registrou o acesso de leitura a `minio.cl.df.gov.br` e publica os
dois conjuntos — ver "A LOA e os créditos adicionais que a alteram" abaixo.

### O que nenhuma destas tabelas diz

Não dizem se um gasto foi adequado, se uma natureza está aplicada corretamente, nem se 85 % em
administração geral é muito ou pouco. A divisão que estes números mais convidam — a fatia que cada
função, subfunção ou natureza representa do total — **não é publicada como coluna**: o numerador e o
denominador estão na mesma tabela, e a divisão é sua.

## A folha de pagamento (OS-066)

O OS-064 mostrou que a **subfunção 122** sozinha leva 85 % dos R$ 3,4 bilhões que a Casa empenha, e
não soube dizer por quê. A resposta está na natureza da despesa, na mesma tabela: a **3190**
(pessoal, aplicação direta) leva R$ 2.314.632.992,19 e a **3191** (obrigações patronais entre
órgãos) leva R$ 293.374.702,26. **77,2 % de tudo o que a Casa empenha é folha de pagamento** — e até
agora este acervo não publicava uma linha sobre ela.

Publica agora, no grão que a própria Casa publica: **uma linha por pessoa, por folha e por mês**,
com nome, matrícula, cargo, lotação e as catorze colunas de dinheiro, de **setembro de 2017 a julho
de 2026** — **443.870 linhas, 104 meses, 5.923 matrículas**, R$ 3.287.401.894,99 líquidos.

### Antes de somar qualquer coisa: a mesma pessoa aparece mais de uma vez no mês

Em julho de 2026 são **5.052 linhas para 2.623 matrículas distintas**, espalhadas por **onze**
folhas (`001`, `002`, `020`, `021`, `060`, `061`, `070`, `080`, `081`, `099`, `951`), e há **48
linhas com `tipo = DEPUTADO`** para os 24 deputados da Casa.

**Quem agrupar por nome dobra a folha.** A chave é `(competencia, matricula, folha)`, e por isso
toda tabela agregada deste conjunto traz **`matriculas_distintas` ao lado de `linhas`**: quando os
dois números diferem, é isso que está acontecendo. A `folha-por-pessoa-e-ano` traz
`meses_com_registro` ao lado de `linhas` pelo mesmo motivo.

### As três partições, e por que existem

A tabela principal está repartida em **três arquivos, na fronteira do mandato** — 7ª legislatura
(25.151 linhas, a partir de 2017-09), 8ª (186.522) e 9ª (232.197) — e sai **só em `.csv`, sem
`.xlsx`**.

Não é escolha estética. Um único arquivo foi medido em **139 MB**, acima do limite rígido de 100 MB
por arquivo do GitHub, o que o tornaria impublicável; o `.xlsx` determinístico e não comprimido
deste acervo passaria bem disso. **Nenhuma linha e nenhuma coluna ficam de fora** — o ano já era
coluna, e quem quiser a série inteira concatena os três arquivos.

### A aritmética fecha linha a linha — e o que quase a impediu de fechar estava na fonte

Cinco colunas de crédito **+** quatro de desconto (que **já chegam negativas**) **+** três de
auxílio **=** `liquido`, conferido em **todas as 443.870 linhas** antes de qualquer publicação.

Vale dizer o que aconteceu na primeira tentativa, porque é um fato sobre a fonte e não sobre a
conta. O datastore do portal serve estas colunas como números JSON, e alguns dos valores que ele
guarda carregam artefato de ponto flutuante: o `Outros descontos` da matrícula 115 em 2017-09 está
publicado como **`-8803.980000000001`**, não `-8803.98`. **95.716 linhas — 21,6 % — carregam
artefato assim.** Nenhuma diferença chega a meio centavo, e a identidade fecha em **443.870 de
443.870** quando medida no centavo publicado, que é exatamente o número que está no arquivo. O
valor original da fonte é preservado; o que foi ajustado foi a conferência, para conferir o que o
arquivo de fato contém.

### Duas publicações da mesma folha

A Casa publica a mesma folha duas vezes: **99 arquivos mensais** e um **consolidado 2022-2025** de
204.975 linhas. `conferencia-quadro-mensal-x-consolidado` põe as duas lado a lado, mês a mês: **35
meses aparecem nas duas, com 0 divergências.** Nenhuma é preferida e nenhuma diferença é resolvida
escolhendo uma.

O consolidado também é a **única** fonte de cinco meses cujo arquivo mensal não tem datastore
(2022-02, 2024-05, 2024-08, 2024-09, 2024-10). E **três meses não têm cobertura nenhuma** —
2018-07, 2018-08 e 2018-10 — publicados em `.csv` sem datastore. Eles aparecem na conferência como
sentinelas, com o motivo escrito. A **era de 62 arquivos em PDF** (2012-07 a 2017-08) está fora
deste OS e também aparece como sentinela. **Um mês que não se consegue ler é uma linha que diz
isso, nunca um buraco.**

### A conferência com o orçamento não fecha, e não deveria

`conferencia-folha-x-natureza` põe a folha ao lado da dotação em que ela é empenhada. **Os dois
números não medem o mesmo ato**: um é registro de folha de pagamento, o outro é empenho contra
dotação, feito no calendário do orçamento e carregando encargos patronais que o arquivo da folha
nunca mostra. Em 49 dos 104 meses há folha e nenhuma dotação 3190/3191; em nenhum acontece o
contrário. A diferença é publicada **como diferença**, com as duas leituras ao lado, e a coluna é
subtração exata — nunca uma fatia. Não chamamos isso de erro nem de conciliação.

### O que a Casa publica sobre salário legal

`tabela-de-remuneracao-vigente` traz as tabelas de remuneração da Casa em formato longo, **cada
célula com a `fonte_legal` que a própria fonte cita** — por exemplo, o subsídio de deputado sob o
Decreto Legislativo nº 2.382/2022. É exatamente o tipo de referência normativa que o OS-064
procurou em cinco publicações e não encontrou em nenhuma. Aqui a fonte a fornece sozinha, e
**nenhuma norma foi escolhida por este acervo**.

### O calendário de mandato, que faltava

`vinculos-de-pessoal` lê a relação nominal como vínculo: **8.714 períodos para 4.003 matrículas**,
com o primeiro e o último mês em que aparecem e as datas de **admissão, aposentadoria e
desligamento** que a fonte publica. A `producao-por-deputado` (OS-057) diz, na sua própria seção,
que este acervo não tinha calendário de mandato — agora tem, de 2022-06 em diante.

**O que ele ainda não resolve:** *licença* não é admissão, aposentadoria nem desligamento. Um
deputado com 193 de 547 sessões continua não separável entre falta e licença por nada que seja
alcançável aqui.

### Inativos, pensionistas e pensão especial entram

`tipo` traz seis valores preenchidos — `CONCURSADO`, `COMISSIONADO`, `DEPUTADO`, `REQUISITADO`,
`INATIVO`, `PENSIONISTA` — e uma parcela em branco que a fonte não classifica. Em julho de 2026 são
452 linhas `INATIVO`, 56 `PENSIONISTA`, 53 na lotação `PENSAO ESPECIAL` e 126 sem `tipo`. Eles são
publicados como a Casa os publica, no mesmo arquivo e com o mesmo detalhe — porque é assim que a
fonte faz, e porque sem eles nenhum total daqui fecharia com o total da própria Casa. `tipo` é
coluna: quem quiser separar, separa.

### O que nenhuma destas tabelas diz

- **Não liga um pagamento de folha a uma ordem bancária.** `pagamentos-em-ordem-cronologica`
  (OS-062) não traz matrícula e a folha não traz empenho. A ponte não existe na fonte.
- **Não diz se um salário está correto.** As tabelas de remuneração dizem o que a norma fixa; a
  folha diz o que foi pago. Comparar as duas é trabalho de quem lê, e nenhuma coluna aqui emite
  esse juízo.
- **Não traz nada anterior a setembro de 2017.** A era em PDF está fora deste OS.
- **Não traz terceirizados, estagiários nem concursos.** São outras bases, com outra decisão sobre
  dado pessoal, e outro OS.
- **Nenhuma fatia, nenhum percentual, nenhum ranking.** Nem sequer o mais óbvio — quanto a folha é
  do gasto da Casa. Numerador e denominador estão publicados; a divisão é sua.

## A LOA e os créditos adicionais que a alteram (OS-070)

O OS-064 publicou a execução por classificação e não pôde dizer por que ela diverge do que a Lei
Orçamentária Anual (LOA) votou. Esta seção publica os dois lados: a LOA (`leis-orcamentarias`, 41
arquivos, 2009–2024) e os créditos adicionais que a alteram depois de votada
(`creditos-adicionais`, 127 arquivos, PL-00250/2011 a PL-01152/2024) — os dois hoje alcançáveis
pelo redirecionamento a `minio.cl.df.gov.br` que a OS-070 registrou.

### `PROPOSTA` e `FINAL` são publicados os dois, nunca um escolhido pelo outro

Só **seis dos dezesseis anos** — 2010, 2011, 2018, 2019, 2020, 2021 — têm um recurso `FINAL` (o
texto promulgado). Nos outros dez, o único documento de dotação que a CLDF publica para aquele
ano é `PROPOSTA` (o projeto do Executivo, antes de emendado). `leis-orcamentarias-dotacao`
publica os dois onde os dois existem, com a coluna `tipo_documento` dizendo qual é qual. A
reconciliação com os créditos precisa de UM número por ano, e usa `final` quando existe —
publicando qual escolheu na própria coluna, nunca silenciosamente.

### A dupla entrada dos créditos fecha — 0 de 127 leis desbalanceadas

Cada crédito retira de uma classificação e acrescenta a outra. As 127 leis fecham a zero, e esse
número é reconferido a cada publicação: os dois lados de `creditos-adicionais-por-lei` são
recalculados a partir do detalhe por emenda, nunca confiados ao que a colheita escreveu.

### A conferência: só 3,9 % das chaves aparecem nas duas fontes, e isso é o ponto

`conferencia-loa-x-creditos` cruza (ano, unidade orçamentária, função, subfunção, natureza,
fonte) entre a LOA e os créditos — **51.764 chaves, e só 1.996 nas duas**. As outras 49.768 são
declaradas por uma fonte só, na maioria porque um crédito move dinheiro para ou de uma
classificação que a LOA original não continha. Uma chave declarada por uma fonte só publica
diferença **vazia**, porque uma diferença contra o silêncio não é uma diferença.

### Duas larguras de código, medidas e nunca convertidas

A LOA escreve a fonte em três dígitos (`100`) e em nove (`100000000`), às vezes no mesmo ano —
**e, ao contrário da natureza (OS-064), nenhuma medição aqui mostra que um é o outro com zeros à
direita**. Os dois são publicados lado a lado, com `fonte_largura` dizendo qual é qual. E **4.000
das 106.367 linhas de dotação publicam a natureza em um ou dois dígitos**, não seis — a própria
CLDF, medido em quinze dos dezesseis anos, não um erro de leitura daqui.

### O que nenhuma destas tabelas diz

- **Não diz se o dinheiro movido por um crédito foi executado.** OS-064 é a execução; nenhuma
  tabela aqui cruza as duas.
- **O ano de um crédito é o do seu próprio número de PL**, nunca o exercício que ele de fato
  alterou — a fonte não publica outra data, e nenhuma segunda superfície é consultada para supri-la.
- **`publicado_em` não é a data da lei.** É quando o arquivo chegou ao portal de dados abertos
  (o `created` do CKAN), nunca quando o crédito foi sancionado.
- **Nenhum rótulo novo.** As colunas `*_rotulo` seguem vazias pela razão já registrada na
  classificação orçamentária (OS-064).
- **Nenhuma fatia, nenhum percentual.** A pergunta mais óbvia — que fração da LOA um crédito
  moveu — é publicada como numerador e denominador, nunca como coluna de razão.

## Os terceirizados e os estagiários (OS-071)

A folha (OS-066) publicou quem a Casa emprega diretamente. Esta seção publica as duas forças de
trabalho que não são: os terceirizados (`terceirizados`, 1 arquivo, 6.689 linhas desde 2023-08) e
os estagiários (`estagiarios`, 10 arquivos — nove semestres e um mês avulso), mais a conferência
dos CNPJs dos terceirizados contra os contratos (OS-063) e os pagamentos (OS-062) já publicados.

### O nome é publicado nas duas populações, e a base não é a mesma da folha

Duas respostas do operador, ambas de 2026-09-04: "a. then approve. Don't run" para os
terceirizados, "Publish it, as the source does" para os estagiários. Nenhuma das duas populações
é servidora da Casa — um terceirizado é pago por uma empresa contratada, um estagiário por um
termo de estágio — então o nome aqui **não** carrega a base de servidor público que ampara os
nomes da folha. Cada tabela publicada diz isso ao lado da própria regra, não só aqui.

### `estagiarios-por-lotacao` não existe

O BRIEF desta OS previa essa tabela. Medido depois de aprovado: **nenhum dos dez arquivos de
estagiários publica uma coluna de lotação**, ou qualquer coisa parecida — o esquema medido nos
dez é `matricula`, `nome`, `data_admissao`, `data_desligamento`, e nada mais. Não é uma escolha
do operador a fazer: não há valor nenhum de lotação para agregar, e inventar um seria a mesma
fabricação que a classificação orçamentária (OS-064) já recusa para um código de despesa,
aplicada aqui a uma unidade organizacional. Só a espinha, `estagiarios-por-periodo`, é publicada.

### Um arquivo escreve a data por extenso, com o mesmo cabeçalho dos outros nove

Nove dos dez arquivos de estagiários escrevem as datas em ISO. Um, `"2025 - Maio"`, publica
exatamente as mesmas quatro colunas e escreve `"terça-feira, 23 de maio de 2023"` em vez de
`2023-05-23`. Como o cabeçalho é idêntico, a guarda que lê cabeçalhos não vê nada de errado; uma
segunda guarda lê cada data já convertida e para a execução se alguma célula não é uma data ISO
válida nem está genuinamente vazia — uma data vazia é um estágio ainda em curso, não um defeito.

### A conferência de CNPJ: o que ela diz e o que não diz

`conferencia-terceirizados-x-contratos` cruza os CNPJs que forneceram terceirizados contra os
contratos (OS-063) e os pagamentos (OS-062) já publicados — 15 CNPJs distintos na série toda.
**Não diz que um contrato ou um pagamento é PARA essas pessoas**: `contratos` não publica
nenhuma chave de trabalhador, e esta tabela não inventa uma.

### O que nenhuma destas tabelas diz

- **Nenhum valor de remuneração**, para nenhuma das duas populações. Nenhuma fonte publica um, e
  esta OS não deriva um a partir do valor de um contrato.
- **`estagiarios-por-lotacao` não existe** — ver acima.
- **Não liga um terceirizado a um contrato específico**, só a empresa que o forneceu ao CNPJ.
- **Nenhuma fatia, nenhum percentual, nenhum ranking.**

## O rol de informações classificadas, e o repasse que a Casa diz ter enviado (OS-075)

Duas pontas: o que a própria Casa declara secreto (`rol-de-informacoes-classificadas`, 177
processos, 2021–2025, mais o rol de desclassificados) e o que ela diz ter enviado a outras
entidades (`transferencias-e-repasses-enviados`, 60 meses, 2022–2026) — o lado que faltava da
`transferencias-voluntarias-recebidas` que a OS-064 já publica.

### `informacoes-classificadas` — 177 processos, e o que a Casa não rotula

Uma linha por processo. `categoria_de_sigilo` (Restrito/Sigiloso) e `grau_de_sigilo`
(Reservado/Secreto/Ultrassecreto) são a mesma informação da fonte sobre um mapa fechado de duas
categorias e três graus mais vazio; `categoria_na_fonte` e `grau_na_fonte` mantêm a grafia exata
que a Casa escreveu (`RESTRITO`, `SIGILOSO` e as demais três variações). `PRAZO DE SIGILO` — o
nome que a própria coluna da fonte carrega — nomeia um **grau**, não um prazo, e está vazio em
149 das 177 linhas. Este projeto não julga se um sigilo é legítimo, e nenhuma tabela aqui tenta.

### 2 das 177 linhas estão desalinhadas NA FONTE, e nada é afirmado sobre elas

O datastore da própria CLDF publica 2 processos cuja linha inteira está fora de posição a
partir da célula do exercício: o texto que deveria estar na classificação arquivística ocupa a
célula do ano, e cada campo seguinte carrega o valor do campo seguinte da fonte — `TIPO DE
PROCESSO` chega a carregar um valor com cara de categoria, `FUNDAMENTO LEGAL` um valor com cara
de número de processo. Por decisão do operador (2026-09-06, *"Publicar com flag, nada
afirmado"*), estas 2 linhas são publicadas com **todos os campos vazios** e
`linha_desalinhada_na_fonte = sim` — nada é adivinhado sobre a que ano, categoria ou fundamento
elas pertencem.

### Os bytes que o próprio datastore serve quebrados são reparados, sem coluna verbatim

O cabeçalho da fonte chega como `EXERCÖCIO`; células inteiras chegam com bytes como `\x84` e
`\x92` no meio de uma palavra. Achado, medido linha a linha: o defeito é uma codificação
Portuguesa de página única (CP850) decodificada de duas formas diferentes em algum ponto do
pipeline da própria CLDF — a maior parte como **Latin-1** (às vezes duas vezes seguidas na
mesma célula), e uma parte menor como **CP1252**, que redefine os mesmos bytes 0x80–0x9F para
outros símbolos (`€ ‚ ƒ „ … † ‡` e outros). O texto é reparado e publicado **só na forma
legível**; não existe coluna com o texto quebrado, por decisão do operador (2026-09-06,
*"Reparar, sem coluna verbatim"*). Um byte que o mapa fechado não resolve interrompe a coleta
em vez de virar `?` ou um caractere de substituição — nenhum ocorreu nos 177 processos reais:
medido, 102 caracteres precisaram de reparo, no máximo dois saltos, zero sem solução. Um `?`
literal que já aparecia na fonte não é tocado: é uma perda de dado antiga dos próprios sistemas
da CLDF, não um byte quebrado. **Um caractere do mapa não é um reparo, e está nomeado como tal
em vez de escondido**: o sinal de grau `°` em `AMD n° 57/2016` já é o texto correto da fonte —
o próprio jeito da fonte abreviar "número" — e não um byte a mais para decodificar; repará-lo
de novo trocaria um texto correto por um errado, e por isso ele está na lista de caracteres
legítimos, com o motivo escrito ao lado, não misturado com os bytes quebrados.

**Uma correção feita na revisão, e registrada em vez de escondida (F-122, 2026-09-06):** a
primeira versão deste módulo publicou `sindicƒncia` em vez de `sindicância` — o byte havia sido
decodificado como CP1252 (não Latin-1), e o mapa fechado só sabia reinterpretar um caractere
como mais um byte Latin-1. `ƒ` é a própria forma que o CP1252 dá ao byte 0x83, e o byte 0x83 em
CP850 é `â`. O mapa agora conhece os dois saltos, e a célula publicada é `sindicância`.

### `informacoes-classificadas-por-unidade-e-ano`

Unidade produtora × exercício: quantos processos, e como se dividem por categoria e por grau,
re-somado a partir da tabela anterior. As 2 linhas desalinhadas (sem exercício) não entram
aqui — não há ano para agrupá-las.

### `informacoes-desclassificadas` — a tabela está vazia, e isso é o achado

O recurso "Rol de Informações Desclassificadas" não tem datastore; foi lido pelo
redirecionamento 302 que o próprio portal emite para `minio.cl.df.gov.br` (decisão do
operador, 2026-09-06, *"Ler pelo 302 e publicar"*). **O arquivo-fonte publica 118 linhas e
NENHUMA carrega conteúdo algum** — cabeçalho e 118 linhas inteiramente em branco. Não é uma
falha de leitura deste projeto: é o que o arquivo contém. A Casa não relatou a este portal
nenhuma desclassificação.

### `transferencias-e-repasses-enviados-por-mes` — mais 60 meses de zero

As duas colunas — transferências financeiras e repasses financeiros enviados — são zero nos
60 meses medidos (2022–2026). É o mesmo achado que a `transferencias-voluntarias-recebidas`
(OS-064) já publica do outro lado: a Casa publica cinco anos das duas direções do repasse
voluntário e as três séries — enviada em transferências, enviada em repasses, recebida — são
inteiramente zero.

### `conferencia-transferencias-enviadas-x-recebidas`

As duas pontas do mesmo dinheiro lado a lado, mês a mês, sem uma nova requisição — a série
recebida é lida do acervo que a OS-064 já publicou. A diferença é subtração exata e só é
publicada onde as duas fontes declaram o mês (nos 60 meses medidos, as duas sempre declaram).
Nos 60 meses, a diferença é zero nos 60 — porque as três séries são zero.

### O que nenhuma destas tabelas diz

- **Nenhum juízo sobre a legitimidade de um sigilo.** `categoria_de_sigilo` e `grau_de_sigilo`
  são o que a Casa classificou, não uma avaliação deste projeto.
- **Nenhuma taxa, fatia ou ranking.** O achado das duas séries zero é publicado como contagem
  (60 de 60 meses), nunca como percentual.
- **Nada sobre as 2 linhas desalinhadas na fonte**, além de que existem e estão marcadas.

## A emenda parlamentar, na sua segunda superfície: para onde o dinheiro foi (OS-076)

Até esta OS, o dataset 8 tinha UMA superfície — o Painel de Emendas Parlamentares — que diz quem
assinou uma emenda e por quanto, e para. `emendas-parlamentares`, um pacote CKAN nunca antes
lido por este projeto (5 recursos, um por exercício 2021–2025, 4.604 emendas), diz para ONDE o
dinheiro foi (a unidade orçamentária) e SE foi pago (empenhado, liquidado) — e alcança dois anos
que o painel nunca cobre (2021–2022).

### Duas tabelas, nunca uma mistura — decisão do operador

*"Two separate tables"* (2026-09-06): os anos com autor (2023–2025, cruzados com o painel) e os
anos sem autor (2021–2022, só o portal) nunca dividem uma tabela.
`emendas-loa-execucao-2023-2025` (2.632 linhas) publica `parlamentar_no_painel` e
`partido_no_painel`; `emendas-loa-execucao-2021-2022` (1.972 linhas) **não publica coluna de
parlamentar nenhuma — nem vazia**, porque nenhuma das duas superfícies atribui autor a estes
dois exercícios, e uma célula vazia poderia ser lida como um cruzamento que falhou.

### Todo valor que as duas superfícies declaram é publicado duas vezes

*"Both values side by side"* (2026-09-06): `vl_lei_alteracao_portal`/`_painel` e
`vl_empenhado_portal`/`_painel` nunca escolhem uma fonte. Das 2.632 emendas casadas, **337
discordam em vl_lei_alteracao** (maior diferença R$ 14.995.000,00) e **240 em vl_empenhado** —
nenhuma célula aqui é um valor que este projeto escolheu entre as duas fontes.
`vl_desbloqueado`, `vl_liquidado` e `vl_saldo_a_solicitar` só o portal publica (o painel não os
tem); `parlamentar_no_painel`/`partido_no_painel` só o painel os tem.

### `emendas-loa-por-unidade-orcamentaria`

92 unidades orçamentárias × exercício, re-somado diretamente das 4.604 linhas do portal — nunca
uma segunda contagem da fonte. Seis das oito colunas monetárias da fonte: a que a emenda propôs,
a que a lei fixou, o empenhado, o disponível, o desbloqueado e o liquidado.
`vl_bloqueado_siggo` (um estado intermediário) e `vl_saldo_a_solicitar` (um resíduo, negativo na
soma da fonte) ficam fora desta agregação; ambos continuam publicados por emenda nas duas
tabelas de execução. R$ 2.453.471.142,32 empenhado contra R$ 2.086.835.058,96 liquidado — uma
diferença de R$ 366,6 mi que nenhuma tabela publicada até esta OS mostrava.

### `conferencia-emendas-painel-x-portal`

Uma linha por ID_EMENDA que QUALQUER UMA das duas superfícies declara — as 4.604 do portal mais
654 que só o painel declara: 606 de 2026 (fora da janela 2021–2025 do portal) e 48 dentro de
2023–2025, que o snapshot do portal (2025-12-16, anterior à leitura do painel) ainda não carrega.
A diferença é subtração exata e **uma linha que só uma superfície declara carrega diferença
VAZIA, nunca zero** — zero é uma afirmação sobre um cruzamento que ali não existe.

### Um achado que a fonte carrega, não este projeto

Seis emendas (todas com `PT_COMPARTILHADO = 1` — um programa de trabalho dividido com outra
emenda) chegam da fonte com precisão sub-centavo nos próprios campos monetários
(`22.56578947`), a assinatura aritmética de um rateio pro-rata feito em ponto flutuante a
montante. Publicadas arredondadas ao centavo (a mesma regra de toda outra coluna monetária deste
projeto), não uma correção deste módulo.

### O que nenhuma destas tabelas diz

- **Nenhuma taxa, fatia ou ranking.** Nenhum quociente calculado por este projeto aparece em
  coluna nenhuma.
- **Nenhum identificador pessoal.** As tabelas tratam de unidades orçamentárias e valores, não
  de pessoas.
- **Nada sobre se o dinheiro empenhado chegou a uma ordem bancária.** Ligar uma emenda a uma
  ordem bancária está fora do escopo desta OS (o BRIEF nomeia isso explicitamente).

## O teletrabalho que a Casa registra, dividido em dois (OS-077)

`servidores-em-teletrabalho`, um pacote CKAN já acessível (portal OS-059) mas nunca antes lido —
42 recursos, um por mês, Fev/2023 a Jul/2026, 6.944 linhas, onze formas de cabeçalho diferentes.

### Duas tabelas, nunca uma mistura — decisão do operador

*"Two separate tables"* (2026-09-06): os 18 meses "cheios" — que publicam matrícula, cargo,
dias em teletrabalho, aferições e as demais colunas — vão para
`servidores-em-teletrabalho-por-mes` (2.675 linhas). Os outros 24 meses — **mais da metade da
série**, 4.269 de 6.944 linhas — não publicam nada além de `Unidade, Servidor`, e vão para
`servidores-em-teletrabalho-nominal-por-mes`. Nenhuma cláusula deste projeto, e nenhuma fonte que
ele alcança, pode dizer se a Casa parou de medir, parou de publicar o que mediu, ou nunca mediu
esses meses — a tabela separada é o achado, não uma resposta a essa pergunta.

### O nome é publicado — mesmo precedente já tomado

Mesma decisão do operador já registrada para a folha, os terceirizados e os estagiários: o nome
do servidor é publicado nas duas tabelas. O servidor aqui É servidor da Casa (ao contrário de
terceirizados e estagiários), o que muda a base — mas a decisão de publicar o nome é a mesma.

### `afericoes` é verbatim, e a coluna reparada nunca existe

*"Verbatim only"* (2026-09-06): das 828 células não vazias de `Aferições` nos 18 meses cheios,
**203 (24,5 %) foram trocadas por `01/jan`** pelo autocorreto de data de uma planilha, no lugar
da razão `1/1` que as outras 592 linhas escrevem — o sentido oposto do achado do sinal 29g nos
estagiários, onde uma data virou prosa; aqui uma razão virou data. A coluna é publicada
**exatamente como a fonte a corrompeu**, sem nenhuma versão reparada em lugar nenhum desta
camada. `afericoes_na_fonte` repete o mesmo texto ao lado — as duas colunas têm que concordar
sempre, e um guard (33d) para a execução se um reparo futuro mudar uma cópia e não a outra.

### `teletrabalho-por-unidade-e-mes` e `conferencia-teletrabalho-x-folha`

O agregado por (unidade, mês) — 1.796 grupos — é recontado direto das duas tabelas-espinha,
nunca de si mesmo. A conferência lê a folha já publicada (OS-066/OS-072) — **zero requisições
novas** — e mede **271 matrículas distintas, 261 encontradas na folha**; o BRIEF, aprovado antes
de qualquer linha lida até o fim, estimava 272/260. **Não diz que o servidor de fato trabalhou
em teletrabalho, nem que uma aferição foi de fato realizada** — só que a matrícula aparece nos
dois registros.

### O que nenhuma destas tabelas diz

- **Nenhuma taxa, fatia ou ranking**, e nenhum quociente calculado por este projeto em coluna
  nenhuma.
- **Nada sobre se um servidor de fato trabalhou, ou se uma aferição foi de fato realizada.**
- **Nenhuma normalização das 220 grafias de unidade contra uma lista que a própria Casa não
  publica** — fora do escopo desta OS, por decisão do próprio BRIEF.

## O concurso de 2018: os aprovados, os nomeados, e o funil entre eles (OS-078)

`concursos`, um pacote CKAN com dois recursos — a última lista de aprovados e a última lista
de nomeados que a Casa publicou, ambas do concurso de 2018: 1.061 aprovados, 632 nomeados,
1.693 linhas ao todo.

### Uma agregada, uma nominal — decisão do operador

*"Nomeados nominal, aprovados aggregate"* (2026-09-06): dos 985 nomes distintos que passaram
no concurso, a maioria nunca foi chamada, e nenhum deles é publicado em coluna nenhuma —
`concurso-2018-aprovados-por-cargo-e-categoria` é um agregado por (cargo, categoria), sem
nenhuma coluna que pudesse carregar um nome. Os 596 nomes distintos que **foram** nomeados já
aparecem, nomeados, na folha de pagamento que este projeto já publica (OS-066/OS-072) — esses
sim são publicados, em `concurso-2018-nomeados`, um por linha.

### `concurso-2018-funil`: aprovados → nomeados → tornada sem efeito → posse → exoneração

Uma linha por (cargo, categoria), recontada DIRETO das duas espinhas — nunca da tabela
agregada acima, nem de si mesma. `nomeados` **não é afirmado menor ou igual a** `aprovados` —
a própria fonte quebra essa ordem em 26 nomeações cujo nome não bate com a lista de aprovados
por chave, e a tabela publica a contagem em vez de impor uma regra que a fonte não obedece.

### Um achado sobre a grafia do cargo, encontrado ao construir o funil

As duas listas nem sempre escrevem `cargo` da mesma forma: "Analista Legislativo" na lista de
aprovados é "Analista Legislativo (Técnico Legislativo)" na de nomeados (252 linhas), e
"Procurador" é "Procurador Legislativo" (16 linhas) — **268 das 632 linhas de nomeados, 42 %
do registro**, caem numa combinação (cargo, categoria) que a lista de aprovados nunca escreve
daquela forma exata. Os totais do funil ainda batem certo com as duas espinhas inteiras
(1.061 aprovados, 632 nomeados, 67 tornadas sem efeito, 65 exonerações); o que não bate, para
esses dois cargos, é a quebra por categoria que um leitor tiraria da tabela agregada —
nomeando o achado em vez de escondê-lo atrás de um número que parece fechado.

### Datas compostas: uma referência de Ato ao lado da data

`Nomeação Tornada sem Efeito` e `Exoneração` não são datas simples na fonte — são uma data
mais a referência de um Ato (`"02/12/2020 (Ato do Presidente nº 359, de 2020 - DCL nº 287)"`).
`nomeacao_tornada_sem_efeito` é publicada verbatim, texto inteiro; `data_exoneracao` é a data
ISO extraída da mesma célula, descartando a referência ao Ato — a mesma extração que
`despesa.data_iso` já faz em outra tabela deste projeto.

### O pareamento com a folha, e os 26 nomes que uma lista não contém

*"Counts only"* (2026-09-06): contra a folha 2023-2026, **484 dos 596 nomeados são
encontrados por chave de nome (112 não são)**; **474 dos 985 aprovados são encontrados (511
não são)**. Um encontro por nome não é identidade — um homônimo pode produzir um falso
encontro — e nenhum resultado é publicado por pessoa, só como as duas contagens e seus
denominadores. Separadamente, **26 dos 596 nomes nomeados não batem com nenhuma chave da
lista de aprovados**: ou a lista de aprovados está incompleta, ou um nome está grafado de
forma diferente nas duas listas que a própria Casa publica lado a lado — nenhuma fonte que
este projeto alcança diz qual das duas. Publicado como contagem, nunca como uma coluna
`consta_na_lista_de_aprovados` que nomeasse uma pessoa.

### O typo da fonte

Uma linha da lista de aprovados traz `Consulktor` onde toda outra linha do mesmo cargo traz
`Consultor`. `cargo_na_fonte` mantém a grafia da fonte; `cargo` traz a corrigida, lado a lado.

### O que nenhuma destas tabelas diz

- **Nenhum nome da lista de aprovados**, em coluna nenhuma, de nenhuma tabela deste módulo —
  a própria tabela do banco de dados não guarda o nome, só a sua chave normalizada, o que
  torna a garantia estrutural e não apenas uma regra que uma mão futura poderia esquecer.
- **Nenhuma taxa, fatia ou ranking**, e nenhum quociente calculado por este projeto em coluna
  nenhuma.
- **Nenhum identificador pessoal** (CPF, RG) — nenhum existe no pacote de origem, e o guard
  prova isso.
- **Nada sobre se um encontro de nome contra a folha é a mesma pessoa.**

## O mapa de campos (OS-104) — o que cada coluna é, e de onde veio

Três tabelas que falam das outras 102 (a terceira desde a OS-106, abaixo). **`campos-atomicos`** tem uma linha por campo atômico
que o acervo bruto (`data/raw/`) guarda — 2.591 campos, de sete fontes: as declarações de
campo do datastore CKAN de `https://dados.cl.df.gov.br` (para os recursos que o portal guarda
como arquivo, `origem_arquivo` é a URL do próprio recurso), as chaves dos JSON que o portal publica (LOA e
créditos), os cabeçalhos dos `.csv` e das planilhas, os rótulos dos PDFs da folha, os caminhos
de chave das respostas da API `pleservico` (`https://ple.cl.df.gov.br/pleservico/api/public` —
para essas linhas, `origem_arquivo` é a própria consulta registrada, verbo e URL, e
`origem_registro` o arquivo em `data/raw/` que guarda a resposta), e as propriedades do esquema
dos painéis Power BI.
Cada linha traz o `tipo_original`, o `rotulo_original` e a `descricao_original` **como a fonte
os escreveu** — e `n/d` quando ela não escreveu nada, que é o caso da maioria: só o datastore
CKAN documenta os seus campos (28 linhas têm descrição, 52 têm rótulo). Traz
também o arquivo concreto de onde a linha foi lida (`origem_registro`), a descrição do conjunto
de dados que o portal publica (`descricao_do_conjunto_original`), o módulo deste projeto que lê
o campo, e em `publicado_em` as colunas publicadas que ele alimenta — ou `não publicado`, para
os 2.238 campos que o acervo guarda e nenhuma tabela usa.

**`colunas-publicadas`** tem uma linha por (tabela, coluna) das 102 tabelas — 1.287 linhas. A
`natureza` diz se a coluna É um campo atômico (`atomica`), se foi computada (`derivada`: uma
soma, uma contagem, uma parte de um campo, um rótulo de norma, uma conferência) ou se é uma
chave que este projeto forma (`chave`); `campo_atomico` ou `derivada_de` dizem de quê, e a
`nota` diz, em uma frase, o que a computação é. **Nada disso foi deduzido do nome da coluna**:
cada linha é uma declaração escrita no código do módulo que produz a tabela (`ORIGEM`), e o
sinal 37 recusa a tabela inteira se uma coluna ficar sem declaração, se um arquivo de origem
não carregar o campo, se uma descrição não for substring byte a byte do arquivo, ou se uma
referência não resolver. A única célula inferida é `tipo_publicado` — o tipo que o painel
atribui à coluna por amostragem — e por isso ela fica numa coluna própria, rotulada *"(inferido
pelo painel)"*, ao lado do `tipo_original` que a fonte declarou.

**O que estas duas tabelas NÃO dizem.** Que a declaração está certa: o guarda prova que a
referência existe no acervo, não que é a certa entre duas vizinhas — essa parte confere-se
contra o código do módulo, que é público. E nenhuma célula delas é um valor: são cabeçalhos,
rótulos e descrições, nunca uma linha de dado, e o 37e recusa qualquer forma de CPF ou RG.

**Onde `origem_registro` aponta.** Para dentro de `data/raw/`, o acervo bruto que este
repositório NÃO versiona (é `.gitignore`d): o caminho confere-se na máquina que colheu, ou por
quem recolher com a mesma consulta — `data/queries/` é versionado, e o nome do arquivo é o
resumo da própria consulta — e não a partir da árvore pública. O sinal 37b corre onde o acervo
está. **Quatro linhas `pleservico:probe-*:error`** (`probe-emendas`, `probe-parecer`,
`probe-urgencia`, `probe-veto`) são sondagens que receberam um corpo de erro e o guardaram:
`error` é uma chave que esse corpo carrega, não um campo da API — estão no mapa porque estão
no acervo, com `modulo = n/d` e `não publicado`. **E o que não rendeu linha nenhuma é
contado**, não omitido: `provenance.json["campos"]` traz `arquivos_lidos` (49.588),
`arquivos_nao_lidos` (47 — páginas HTML, respostas vazias, JSON que não parseia)
e `entidades_sem_campo` (3 diretórios sem campo algum: `os011-scratch`, `probe-spa`, `probe-veto-portal`).

**`campo_normalizado` e `campos-unicos` (OS-106, 2026-09-12).** A mesma fonte grafa o mesmo campo
de modos diferentes entre os seus próprios arquivos — `Nome`/`nome`, `Lotação`/`Lotacao`/
`lotacao`, `Mês`/`MES`, `Cargo Efetivo`/`cargo_efetivo`: 22 grupos, 49 linhas, todos do datastore
CKAN; dentro de um mesmo arquivo, nenhum campo se repete. Por isso as duas tabelas ganham, logo
depois de `campo_original`, a coluna **`campo_normalizado`** — **uma chave que ESTE projeto
computa, não um dado da fonte**: acentos retirados (NFKD), tudo em minúsculas, toda sequência de
espaços e hifens virada num `_`, e nada mais (`.`, `[]` e `_` ficam, porque uma regra mais larga
fundiria 15 pares de campos diferentes, como `idsProposicoes` e `idsProposicoes[]`). A grafia
original fica intacta ao lado, e é ela — nunca a chave — que aparece em `campo_atomico`,
`derivada_de` e `publicado_em`. A chave vale dentro de uma (fonte, entidade): `ANO` da contratação
e `ANO` da despesa têm a mesma chave e distinguem-se pelas duas colunas anteriores. **Ela não é
única em `campos-atomicos`** — cada arquivo de origem mantém a sua linha, então um campo que a
fonte grafa igual em vários arquivos repete a chave uma vez por arquivo. Para quem quer cada campo
uma vez só há a terceira tabela, **`campos-unicos`**: uma linha por (fonte, entidade,
`campo_normalizado`) — 2.550 —, com as grafias (`grafias`), quantos e quais arquivos a carregam
(`n_arquivos`, `origem_arquivos`), os tipos, rótulos e descrições que a fonte escreveu (valores
distintos unidos por `;`, ou `n/d`), o módulo e a união das colunas publicadas. O sinal **37f**
prova que toda chave é a função aplicada à sua própria grafia, que nenhuma se repete dentro de um
arquivo (dois campos diferentes dobrados no mesmo nome param a exportação) e que `campos-unicos` é
exatamente o conjunto das triplas distintas da primeira tabela, com as grafias e as origens de
cada linha sendo exatamente as das linhas dobradas e `n_arquivos` igual ao número de itens de
`origem_arquivos` — a célula ao lado, que qualquer leitor reconta. O que a tabela **não** afirma é
o produto das duas listas: uma grafia aparece em alguma das origens listadas, não em todas. O que ele não prova é que a regra
está certa — que `Lotacao` e `Lotação` são o mesmo campo é uma leitura, aplicada por regra, e a
grafia verbatim ao lado é o que permite discordar dela.
