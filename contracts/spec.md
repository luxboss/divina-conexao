# Especificação — Divina Conexão

## Objetivo
App web (PWA) para público católico e cristão. O usuário escolhe um tema e recebe um versículo da Bíblia Sagrada (tradução ARA) relacionado ao tema.

## Restrições
- Sem API externa e sem IA. Todo conteúdo é curado e fica em arquivo local.
- Sem servidor de aplicação. Diário e favoritos ficam no `localStorage` do navegador.
- Idioma: pt-BR em todas as telas.
- Tradução: Almeida Revista e Atualizada (ARA). Copyright da Sociedade Bíblica do Brasil — confirmar política de uso antes de publicar.

## Temas (20 × 20 versículos = 400)
Ansiedade, Medo, Tristeza, Esperança, Gratidão, Fé, Perdão, Amor, Paz, Coragem, Sabedoria, Família, Perseverança, Humildade, Oração, Força, Alegria, Consolo, Fidelidade, Confiança.

## Formato dos dados (`backend/versiculos.json`)
```json
{
  "tema": "Paz",
  "versiculos": [
    { "referencia": "João 14:27", "texto": "..." }
  ]
}
```
Campo `texto` deve vir de fonte conferida. Enquanto não houver, fica `null` e o registro não é exibido.

## Fluxo do usuário
1. Tela inicial: grade com os 20 temas.
2. Tema escolhido: mostra um versículo sorteado com referência.
3. Botão "Outro versículo" sorteia outro do mesmo tema.
4. Botão "Favoritar" salva no `localStorage`.
5. Tela "Favoritos": lista os versículos salvos, com opção de remover.

## Design
- Base: blueprint `padrao-design-system.md` (dark mode, cards, tipografia, espaçamento).
- Paleta adaptada ao público devocional (definida pelo Luan em 31/10/2026):
  - Fundo: `#0B1020` a `#121A2E` (azul-noite)
  - Superfície de cards: `#17213A`, borda `1px solid rgba(255,255,255,0.08)`
  - Destaque principal: dourado suave `#D4AF37`
  - Texto principal: `#F5F1E6`; secundário: `#A9B3C7`
  - Tipografia: Inter (400/500/600/700), versículo em serifa (ex.: Georgia) para leitura

## Fora de escopo (por enquanto)
- Login, sincronização entre aparelhos, notificações push, compartilhamento em redes sociais.
