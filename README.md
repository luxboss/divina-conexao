# Altar Diário

Escolha um tema e receba um versículo bíblico para o seu dia. App web (PWA), sem servidor, sem API e sem IA.

## Estrutura

```
DIVINA CONEXAO/
├── backend/              Banco de versículos (fonte única dos dados)
│   ├── versiculos.json   20 temas × 20 versículos
│   └── validar.mjs       Valida o banco (temas, quantidades, textos)
├── frontend/             App React + Vite + TypeScript (PWA)
│   ├── src/
│   │   ├── lib/          Lógica pura: sorteio e favoritos (com testes)
│   │   ├── hooks/        useFavoritos
│   │   ├── pages/        Home, Tema, Favoritos
│   │   ├── components/   Layout com barra inferior
│   │   └── styles.css    Visual (gradiente azul/roxo, botões amarelos)
│   ├── scripts/          Sincroniza dados e gera ícones
│   └── public/icons/     Ícones do PWA
├── contracts/spec.md     Especificação
└── tasks/                Tarefas e status
```

## Como rodar

Requisitos: Node 20 ou superior, Python 3 com Pillow (só para regenerar ícones).

```bash
cd frontend
npm install
npm run dev        # desenvolvimento
npm test           # testes unitários
npm run build      # gera frontend/dist
npm run preview    # serve o build localmente
```

Validar o banco de versículos:

```bash
node backend/validar.mjs
```

## Publicação (GitHub Pages)

- A configuração usa `base: "./"` e rotas com `HashRouter`, então funciona em subcaminho sem regras extras de servidor.
- O build fica em `frontend/dist`. Publique essa pasta pelo GitHub Pages (ou por um workflow de Actions).

## Antes de publicar

- Conferir as referências dos 400 versículos em uma fonte.
- Revisar os textos (são redação própria, não tradução oficial de nenhuma edição).
- Preencher o campo `traducao` em `backend/versiculos.json` com a fonte final.
