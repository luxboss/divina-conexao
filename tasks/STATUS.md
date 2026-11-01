# Status

| Área | Status | Observação |
|---|---|---|
| Banco de versículos (`backend/versiculos.json`) | CONCLUÍDO | 20 temas × 20 versículos; referências conferidas na ACF |
| Validação do banco (`backend/validar.mjs`) | CONCLUÍDO | Passa sem erros |
| Versículo do dia | CONCLUÍDO | Muda à meia-noite; testado |
| Compartilhar como imagem e WhatsApp | CONCLUÍDO (lógica) | Geração de imagem e link testados em unidade; menu nativo não testado no navegador |
| Anotação pessoal nos favoritos | CONCLUÍDO | Testado em unidade |
| Backup (exportar/importar) | CONCLUÍDO | Testado em unidade |
| Testes unitários | 39 passando | `npm test` em `frontend` |
| Inspector (taste-skill) | 0 FAIL, 3 WARN | WARNs: borda de 1px (visual de referência), sem botão no primeiro telão do celular, sem vídeo |
| Lint (taste-skill) | 2 FAIL deliberados | Gradiente e desfoque, mantidos para seguir o visual de referência |
| Revisão teológica dos textos | PENDENTE | Por alguém da comunidade católica |
| Teste no celular real | PENDENTE | Captura do inspector ok; testar no aparelho |
| Publicação (GitHub Pages + domínio) | PENDENTE | Você monta GitHub e domínio |
