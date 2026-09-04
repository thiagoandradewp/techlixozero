# Tech Lixo Zero — versão para Vercel

Arquivos:
- index.html
- style.css
- script.js

## Publicação na Vercel
1. Crie um repositório no GitHub e envie os 3 arquivos.
2. Na Vercel, importe o repositório.
3. Não precisa de build command.
4. Framework Preset: Other.
5. Deploy.

## Pontos de coleta
Os pontos são controlados no arquivo `script.js`, no array `collectionPoints`.

Exemplo:
{
  name: "Ponto de Coleta X",
  city: "Serra Talhada",
  address: "Rua Exemplo, 100",
  accepted: "Celulares, computadores, cabos e periféricos",
  lat: -7.9915,
  lng: -38.2980
}

A versão entregue não inventa os pontos do site original. Cadastre os pontos reais antes da publicação.

## Observações
- O Blog foi removido.
- O menu foi reorganizado para Início, Sobre, Como descartar e Pontos de coleta.
- O mapa usa Leaflet + OpenStreetMap.
- O vídeo original foi mantido.
- Não há backend nem banco de dados.
