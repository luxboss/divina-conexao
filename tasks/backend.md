# Tarefas — Backend (dados)

Pasta: `backend/`. Sem servidor: a única entrega é o banco de versículos.

- [ ] Criar `backend/versiculos.json` com os 20 temas e a estrutura de `contracts/spec.md`.
- [ ] Preencher as referências de cada tema (20 por tema).
- [ ] Preencher o `texto` de cada versículo a partir de fonte conferida da ARA.
- [ ] Validar: 20 temas, 20 versículos por tema, nenhum `texto` nulo antes da publicação.
- [ ] Escrever um script de validação (`backend/validar.mjs`) que falha se algo estiver fora do padrão.
- [ ] Confirmar a política de uso da ARA com a SBB antes de publicar.

Critério de conclusão: `node backend/validar.mjs` passa sem erros.
