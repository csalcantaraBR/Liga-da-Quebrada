# Liga da Quebrada — Instruções Funcionais (MVP v0.1)

> **Propósito:** Documento funcional para guiar design, produto e dev no MVP. Cobre fluxos, regras, estados, contratos, mensagens de erro, telemetria e critérios de aceite — **alinhado ao GDD/Tech Plan**.

---

## 0) Definições & Constantes (MVP)

* **Formato:** 1v1, 4 rodadas, cada carta usada 1x.
* **Energia:** inicia 8, +1 por rodada (cap 12).
* **Ataque:** `Atk = (Poder × 10) + EnergiaGasta`.
* **Respeito (vida):** 12. Empate: sem dano, sem `onWin`.
* **Timeouts:** matchmaking 45s (cai para **bot** aos 10s em tiers baixos), decisão de rodada 25s, reconexão 20s.
* **Facções — passivos:**

  1. **Roda de Ginga:** 1ª rodada recebe -1 Dano (mín. 1).
  2. **Motofrete União:** ao vencer, +1 Energia.
  3. **Crew do Graffiti:** se for a 1ª carta do turno do jogador, +1 Poder.
  4. **Bateria Central:** +1 Dano por vitória consecutiva aliada (reset em derrota/empate).
  5. **Guardiões do Verde:** fim de rodada, cura 1 o aliado de menor HP.
  6. **Vaqueiros do Sertão:** imune ao 1º debuff da partida.
* **Ordem de resolução por rodada:** Passivos → Ao entrar → Revelar Energia → Buffs/Debuffs → Calcular Atk → Vencedor → OnWin/OnLose + dano/curas → Cleanup → Regen +1.

---

## 1) Personas & Metas

* **Jogador Casual Mobile:** partidas rápidas no intervalo; quer progressão visual e matchmaking justo.
* **Competitivo Light:** quer leitura de oponente e ranking confiável; prioriza integridade e replays.

**KPIs MVP:** retenção D1 ≥ 30%, duração média 3–4 min, ≥ 95% partidas concluídas sem desconexão irrecuperável, abandono < 8%.

---

## 2) Fluxos Funcionais

### 2.1 Onboarding & Autenticação

* **Guest First** (1 toque): cria sessão anônima (Supabase) e entra no menu.
* **Upgrade de conta** (opcional): e-mail/senha ou provedor social; migra inventário/elo do guest.

**Estados:** `idle → creatingGuest → ready` | `guest → accountLinked`.

**Mensagens de UI:**

* *“Entrar como convidado”* / *“Criar conta (salvar progresso)”*.

**Aceite:** guest funcional; upgrade preserva progresso; erros exibem mensagem e ação de retry.

---

### 2.2 Matchmaking Rápido

* Botão **Jogar Agora** → fila por ELO.
* Se não parear em **10s** em tiers baixos, oferece **Vs Bot** (auto-aceite no MVP).
* Ao parear: **countdown 3…2…1** e entra na partida.

**Aceite:** matchmaking nunca bloqueia; fallback para bot garantido; usuário pode cancelar antes do pareamento.

---

### 2.3 Partida (4 rodadas)

**Estrutura:** topo (Respeito/Energia/Rodada), centro (mesa), base (mão de 4 cartas, slider de Energia, Confirmar).

**Passo a passo por rodada:**

1. Jogador escolhe **1 carta** (uma vez por partida) e ajusta **Energia** (0..N disponível).
2. Pressiona **Confirmar**. Mostra estado `Aguardando oponente…` com timer.
3. Servidor aplica **ordem** de resolução (Seção 0).
4. UI revela **Ataque** e **resultado** (+dano/curas/efeitos).
5. Reinicia a base com cartas restantes; **Energia +1** (até 12).

**Edge cases:** se tempo expira sem ação, jogo **auto-confirma** com carta de menor Poder e Energia 0.

**Aceite:** sempre possível jogar 4 rodadas; empate funcional; efeitos visíveis com tags; reconexão mantém estado.

---

### 2.4 Desconexão & Reconexão

* Se o cliente cair, tem **20s** para reconectar à sala.
* Durante queda, oponente vê `Aguardando reconexão (20s)`.
* Se tempo expira: **bot** assume decisões mínimas pelo desconectado (Energia 0, 1ª carta disponível) até o final da partida.

**Aceite:** reconexão recupera estado idêntico (mão, energia, rodada); logs permitem replay.

---

### 2.5 Deck & Cartas (MVP)

* **MVP:** deck **fixo** com as 4 cartas exibidas (das 6 seeds).
* Tela Deck mostra cartas possuídas; **Evoluir** aparece como *em breve*.

**Aceite:** grid com filtro por facção; tooltip de regra; sem edição de deck neste MVP.

---

### 2.6 Temporada & Territórios (Mock funcional)

* Mapa estilizado com barras de controle por facção (simulado).
* **Participação semanal**: entrar em 5 partidas concede um emblema visual.

**Aceite:** UI navegável, sem efeito real no matchmaking/dano neste MVP.

---

### 2.7 Perfil & Histórico

* Mostra avatar, respeito atual (ELO), vitórias/derrotas, últimas 10 partidas com resultado e duração.
* Botão **Rever partida** (reconstrói via log).

**Aceite:** dados persistidos; replay reexecuta eventos sequenciais.

---

## 3) Regras Detalhadas (Funcionais)

### 3.1 Prioridade & Conflitos

* **Prioridade alternada por rodada**: jogador A nas ímpares, B nas pares, quando dois efeitos simultâneos conflitam.
* `Imune ao 1º debuff`: consome o **primeiro** efeito com `tipo=DEBUFF`; registra como gasto (não volta).
* `Sem ganho de buff nesta rodada` impede deltas **positivos** de Ataque/Poder no alvo até o cálculo de Atk.

### 3.2 Dano & Arredondamentos

* Reduções de dano **após** determinar vencedor, **antes** de aplicar no Respeito.
* Metades **arredondam para cima**.

### 3.3 Persistência de Efeitos

* `x1 rodada` expira no **Cleanup** da mesma rodada.
* `Próxima rodada` ativa somente na rodada seguinte, expira no Cleanup dessa rodada.

---

## 4) Máquina de Estados

### 4.1 Partida

`MATCH_INIT → ROUND_1_SELECT → ROUND_1_RESOLVE → ROUND_2_SELECT → ROUND_2_RESOLVE → ROUND_3_SELECT → ROUND_3_RESOLVE → ROUND_4_SELECT → ROUND_4_RESOLVE → MATCH_END`

Eventos: `SELECT_CARD`, `COMMIT_ENERGY`, `CONFIRM`, `TIMEOUT`, `DISCONNECT`, `RECONNECT`, `FORCE_BOT_DECISION`.

### 4.2 Rodada

`IDLE → LOCKED (após Confirmar) → REVEAL → RESOLVE → CLEANUP → REGEN → NEXT`.

---

## 5) Contratos & DTOs (Colyseus + REST)

### 5.1 Mensagens tempo real (Colyseus)

**Client → Server**

```json
{ "op": "JOIN_QUEUE", "tier": "bronze" }
{ "op": "LEAVE_QUEUE" }
{ "op": "PLAY_CARD", "cardId": "lola-lambi" }
{ "op": "COMMIT_ENERGY", "value": 3 }
{ "op": "CONFIRM" }
{ "op": "REJOIN", "matchId": "abc", "sessionId": "xyz" }
```

**Server → Client**

```json
{ "type": "MATCH_FOUND", "matchId": "abc", "opponent": {"nick": "Fulano", "elo": 1200} }
{ "type": "STATE", "round": 2, "respect": {"me": 9, "op": 7}, "energy": {"me": 6, "op": 7}, "hand": ["..."], "effects": ["..."] }
{ "type": "ROUND_RESULT", "detail": {"winner": "me", "atkMe": 83, "atkOp": 78, "damage": 3, "effects": ["RHYTHM+1"]} }
{ "type": "MATCH_END", "result": "VICTORY", "deltaElo": +18 }
{ "type": "ERROR", "code": "E_ROUND_TIMEOUT", "message": "Tempo esgotado" }
```

### 5.2 REST (exemplos)

* `POST /auth/guest` → `{ sessionToken }`
* `POST /auth/upgrade` → `{ email, password }` → 200 / 409
* `GET /profile` → `{ nick, elo, stats, cosmetics }`
* `GET /history?limit=10` → `[{ matchId, result, durationSec, date }]`
* `GET /cards` → lista das cartas seed

### 5.3 Schemas (Zod/TypeScript)

```ts
export const PlayCard = z.object({ op: z.literal('PLAY_CARD'), cardId: z.string() });
export const CommitEnergy = z.object({ op: z.literal('COMMIT_ENERGY'), value: z.number().int().min(0).max(12) });
export const RoundState = z.object({ round: z.number().int().min(1).max(4), respect: z.object({ me: z.number(), op: z.number() }), energy: z.object({ me: z.number(), op: z.number() }) });
```

---

## 6) Conteúdo & Dados

### 6.1 Esquema das cartas (JSON)

```json
{
  "id": "mestre-dende",
  "name": "Mestre Dendê",
  "faction": "RODA_DE_GINGA",
  "power": 7,
  "damage": 3,
  "text": "Contra-golpe: se perder por ≤5 Ataque, reduz o dano recebido pela metade (arredonda p/ cima).",
  "keywords": ["Mandinga"],
  "onLose": [{ "name": "ON_LOSE_HALF_DAMAGE" }]
}
```

### 6.2 Localização (i18n keys)

```
ui.play=Jogar Agora
ui.cancel=Cancelar
ui.deck=Deck
ui.energy=Energia
msg.waiting=Esperando oponente…
err.timeout=Tempo esgotado
match.result.victory=Vitória
match.result.defeat=Derrota
```

---

## 7) Acessibilidade & Diretrizes de UI

* **Tamanho mínimo**: 48px para números-chave (Respeito/Energia).
* **Contraste**: AA+; use paleta oficial.
* **Alvos de toque**: ≥ 44px.
* **Feedback textual** para ícones; evitar cor como única semântica.
* **Estados padrão**: vazio, loading (skeleton), erro com CTA.

---

## 8) Telemetria

**Eventos obrigatórios**

* `match_start` { tier, deckId }
* `round_commit` { round, cardId, energy }
* `ability_triggered` { cardId, effect }
* `match_end` { result, durationSec, energySpentTotal, disconnects }
* `disconnect` { phase }

**Métricas chave**: winrate por carta/facção, energia média por rodada, duração média, abandono, reconexão ok.

---

## 9) Segurança & Anti-cheat

* Simulação **servidor autoritativo**; cliente nunca calcula resultado final.
* Validar toda entrada (Zod), rate limit por IP/conta, desconfiar de latências anômalas.
* Replays baseados em **seed + log**.

---

## 10) Mensagens de Erro (catálogo MVP)

* `E_ROUND_TIMEOUT`: "Tempo esgotado. Confirmamos sua jogada automaticamente."
* `E_INVALID_STATE`: "Ação fora de ordem. Sincronizando partida…"
* `E_REJOIN_EXPIRED`: "Não foi possível reconectar a esta partida."
* `E_QUEUE_ABORTED`: "Fila cancelada."
* `E_SERVER`: "Erro inesperado. Tente novamente."

Todas com botão **Tentar de novo** quando aplicável.

---

## 11) Critérios de Aceite (Gherkin)

### 11.1 Resolver rodada básica

```
Cenário: Jogador vence por maior Ataque
Dado que estou na rodada 2 com 6 de Energia
E escolhi uma carta de Poder 7 e gastei 2 de Energia
Quando o oponente revelar Poder 6 e gastar 1 de Energia
Então eu devo vencer a rodada
E o oponente deve perder Dano igual ao Dano da minha carta (ajustado por passivos)
E minha Energia remanescente deve ser reduzida de acordo e depois +1 na Regen
```

### 11.2 Imunidade ao 1º debuff

```
Cenário: Vaqueiros do Sertão ignora primeiro debuff
Dado que jogo uma carta dos Vaqueiros
e recebo um debuff de -2 Poder nesta rodada
Então o debuff é ignorado e marca a imunidade como consumida
```

### 11.3 Bateria Central (Ritmo)

```
Cenário: Dano escala com vitórias consecutivas
Dado que a minha equipe venceu a rodada anterior
Quando eu jogar Maestro Surdo
Então o dano base desta carta aumenta em +1 (passivo) e +2 (habilidade, se aplicável)
```

### 11.4 Desconexão

```
Cenário: Reconectar dentro do prazo
Dado que caí da partida durante a rodada 3
Quando eu retornar em até 20s
Então devo ver o estado atual correto da partida e poder confirmar a jogada
```

---

## 12) Testes (Mínimo viável)

* **Unitários @lq/game**: vitória/empate, metade do dano arredondando p/ cima, imunidade ao 1º debuff, +energia ao vencer (Motofrete), +1 dano por corrente (Bateria), -poder próxima rodada (Graffiti).
* **E2E**: fluxo *Jogar Agora → Vs Bot → 4 rodadas → fim*; reconectar na rodada 3.
* **Carga**: 200 partidas simultâneas com rooms mock no Colyseus.

---

## 13) Feature Flags (MVP)

* `ff.botFallback=true` — ativa partida vs bot ao estourar tempo de fila.
* `ff.replay=true` — habilita reconstrução por log.
* `ff.territoryMock=true` — tela de território com dados fictícios.

---

## 14) Fora de Escopo (MVP)

* Edição de deck, trade de cartas, monetização real, chat em partida, clãs, emotes persistentes.

---

