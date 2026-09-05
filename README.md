# Tech Lixo Zero

O **Tech Lixo Zero** é um site educativo sobre descarte correto de lixo eletrônico. A página apresenta orientações para a população, um passo a passo de descarte e um mapa interativo com pontos de coleta em Serra Talhada e região.

O projeto foi desenvolvido em **2025** e aprovado em **agosto de 2025** pelo **Programa Bibliotecas Disseminadoras da Cultura ODS no Senac Pernambuco**, por meio do **Edital de Chamada Trimestral Nº 01/2025**.

## Objetivos

O site foi criado para facilitar o acesso a informações sobre lixo eletrônico e incentivar práticas ambientalmente responsáveis. Além do conteúdo educativo, a página permite localizar pontos de coleta e consultar quais materiais cada local recebe.

O projeto também foi estruturado para receber novos pontos e novas turmas colaboradoras sem a necessidade de banco de dados. As alterações são feitas diretamente nos arquivos estáticos e depois publicadas novamente.

## Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura e conteúdo da página |
| CSS3 | Layout, responsividade, cores, tipografia e componentes visuais |
| JavaScript | Filtros, busca, menu responsivo, localização e renderização dos pontos |
| Leaflet | Mapa interativo e marcadores dos pontos de coleta |
| OpenStreetMap | Base cartográfica utilizada no mapa |
| YouTube | Vídeo educativo incorporado à página |

## Estrutura dos arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Contém o conteúdo principal, as seções, o rodapé, a foto de Thiago Andrade e a lista de turmas colaboradoras. |
| `style.css` | Contém todo o estilo visual e as regras de adaptação para celulares, tablets e computadores. |
| `script.js` | Contém os dados dos pontos de coleta e toda a lógica de interação do site. |
| `README.md` | Documentação do projeto e instruções de manutenção. |

## Como executar localmente

Por ser um site estático, o projeto não precisa de banco de dados, servidor de aplicação ou processo de compilação.

A maneira mais simples de visualizar o site localmente é abrir o arquivo `index.html` em um navegador. Para evitar limitações relacionadas a alguns recursos do navegador, recomenda-se utilizar um servidor local dentro da pasta do projeto:

```bash
cd tech-lixo-zero
python3 -m http.server 8080
```

Depois, acesse [`http://localhost:8080`](http://localhost:8080) no navegador.

## Como cadastrar ou alterar pontos de coleta

Os pontos de coleta estão no início do arquivo `script.js`, dentro do array `collectionPoints`.

Cada ponto possui os seguintes campos:

| Campo | Obrigatório | Descrição |
|---|---:|---|
| `name` | Sim | Nome do ponto de coleta. |
| `city` | Sim | Cidade em que o ponto está localizado. Esse campo alimenta o filtro de cidades. |
| `state` | Recomendado | Sigla do estado. |
| `address` | Sim | Endereço exibido na lista e no marcador do mapa. |
| `accepted` | Sim | Lista de materiais recebidos pelo ponto. |
| `lat` | Sim | Latitude do ponto no mapa. |
| `lng` | Sim | Longitude do ponto no mapa. |

Exemplo de cadastro:

```javascript
{
  name: "Nome do ponto",
  city: "Serra Talhada",
  state: "PE",
  address: "Rua Exemplo, 100, Serra Talhada - PE",
  accepted: [
    "Pilhas",
    "Baterias pequenas",
    "Celulares"
  ],
  lat: -7.9915,
  lng: -38.2980
}
```

Depois de adicionar ou alterar um ponto, salve o arquivo e recarregue a página. O filtro de cidades será atualizado automaticamente com base nos valores existentes em `city`.

### Materiais recebidos

Os materiais devem ser cadastrados como itens separados dentro de `accepted`. Essa estrutura permite que os materiais sejam exibidos individualmente na lista do ponto, no mapa e nos resultados da busca.

A busca pesquisa pelo nome do ponto, cidade, endereço e materiais aceitos. Por exemplo, uma pesquisa por `pilhas` exibirá todos os pontos que recebem pilhas.

### Coordenadas dos pontos

As coordenadas `lat` e `lng` devem representar a localização do ponto no mapa. É importante conferir as coordenadas antes da publicação. No cadastro atual, as coordenadas de **VISA Magazine** e **Magazine Luiza** são aproximadas para a região informada e podem ser refinadas posteriormente.

## Como adicionar uma nova cidade

Para adicionar uma nova cidade, basta inserir um novo objeto no array `collectionPoints` e informar a cidade no campo `city`.

Não é necessário alterar o HTML para criar a nova opção. O JavaScript identifica automaticamente as cidades cadastradas e atualiza o campo **Todas as cidades**.

## Como adicionar uma nova turma

A seção de turmas está no arquivo `index.html`, dentro da lista com a classe `team-list`.

Para acrescentar uma turma, copie o modelo abaixo e altere o número, o nome e a identificação da turma:

```html
<li class="team-list-item">
  <span class="team-list-number">03</span>
  <div>
    <strong>Nome da nova turma</strong>
    <span>Informação da turma • Cidade</span>
  </div>
</li>
```

A lista foi escolhida para permitir a inclusão contínua de novas turmas que contribuírem com a indicação de pontos de coleta, sem criar novos cards individuais.

## Como alterar a foto de Thiago Andrade

A foto do professor está no arquivo `index.html`, na seção de colaboradores. Para trocar a imagem, substitua o endereço no atributo `src` do elemento `img`:

```html
<img src="URL-DA-NOVA-IMAGEM" alt="Foto de Thiago Andrade" loading="lazy">
```

A imagem atualmente utilizada é a fornecida para o projeto e está hospedada no site de Thiago Andrade.

## Rodapé e informações institucionais

As informações institucionais do rodapé também estão no arquivo `index.html`. Atualmente, o rodapé apresenta:

- Programa Bibliotecas Disseminadoras da Cultura ODS;
- Senac Pernambuco;
- Edital de Chamada Trimestral Nº 01/2025;
- Aprovação em agosto de 2025.

Caso o programa, edital ou instituição sejam atualizados, altere os textos na coluna **Projeto** e na mensagem final do rodapé.

## Publicação

O projeto pode ser publicado em qualquer serviço que hospede arquivos estáticos. Algumas opções são Vercel, Netlify, GitHub Pages ou um servidor web tradicional.

Na publicação, mantenha os três arquivos principais na mesma pasta:

```text
index.html
style.css
script.js
```

O arquivo `index.html` referencia `style.css` e `script.js` por nomes relativos. Se os arquivos forem renomeados ou colocados em pastas diferentes, os caminhos dentro do HTML também precisarão ser atualizados.

## Dependências externas

O site utiliza recursos externos carregados pela internet. Para o mapa funcionar corretamente, o visitante precisa ter acesso à internet para carregar a biblioteca Leaflet e os mapas do OpenStreetMap. O vídeo depende do carregamento do YouTube. A foto de Thiago Andrade também é carregada a partir de uma URL externa.

Se algum serviço externo mudar de endereço ou bloquear o carregamento, será necessário atualizar a respectiva referência no arquivo `index.html`.

## Verificações antes da publicação

Antes de publicar uma nova versão, recomenda-se conferir os seguintes itens:

1. Verificar se os nomes e endereços dos pontos estão corretos.
2. Confirmar quais materiais cada ponto realmente recebe.
3. Conferir latitude e longitude no mapa.
4. Testar a busca por cidade, nome do ponto e material.
5. Testar o site em celular e computador.
6. Conferir se a foto, o vídeo e o mapa carregam corretamente.
7. Executar a validação de sintaxe do JavaScript:

```bash
node --check script.js
```

## Créditos

O projeto é uma iniciativa educacional desenvolvida por alunos do curso Técnico em Desenvolvimento de Sistemas e do curso Técnico Integrado ao Ensino Médio (MEDIOTEC), com orientação do professor Thiago Andrade, do SENAC Serra Talhada.

## Referências

[1]: https://leafletjs.com/ "Leaflet — biblioteca JavaScript para mapas interativos"

[2]: https://www.openstreetmap.org/ "OpenStreetMap — mapa colaborativo aberto"

[3]: https://www.youtube.com/watch?v=n3Pn2iAhyjw "Vídeo educativo sobre descarte de lixo eletrônico"

[4]: https://thiagoandrade.dev.br/wp-content/uploads/2026/07/Gemini_Generated_Image_o4fz4do4fz4do4fz-1024x1024.png "Imagem de Thiago Andrade utilizada no projeto"
