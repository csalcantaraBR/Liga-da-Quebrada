# Liga da Quebrada — Diretrizes UX/UI & Animações (MVP v0.1)

> **Propósito**: orientar design, produto e engenharia na construção da experiência do jogador (UX), interface (UI), animações, micro‑interações e demais elementos visuais do MVP, **alinhado** ao GDD/Instruções Funcionais.

---

## 1) Princípios de UX

* **Clareza primeiro**: mostrar sempre **Respeito**, **Energia** e **Rodada** no topo. Nada que esconda estado crítico de partida.
* **Decisão com feedback**: toda ação dá retorno imediato (visual +, opcionalmente, áudio/háptico).
* **Tempo curto, tensão alta**: rodadas de 25s com telemetria de engajamento; contagem regressiva visível.
* **Consistência**: padrões de componentes iguais no web/mobile; navegação previsível.
* **Acesso e respeito**: legibilidade, contraste e metáforas positivas da cultura urbana BR.

---

## 2) Jornada do Usuário (Mapa)

1. **Onboarding (guest)** → 2. **Home** (CTA *Jogar Agora*) → 3. **Fila** (com fallback vs bot) → 4. **Partida (4 rodadas)** → 5. **Pós‑partida** (resultado + progresso) → 6. **Temporada/Território** (mock funcional no MVP) → 7. **Deck** (visualização) → 8. **Perfil** e **Histórico** → 9. **Configurações** (áudio, acessibilidade, idioma).

**Pontos de emoção**: pareamento ("3,2,1"), revelar rodada, vitória/derrota, subir de faixa.

---

## 3) IA de Navegação

* **Mobile**: bottom bar com 4 abas (**Jogar**, **Temporada**, **Deck**, **Perfil**). Ação primária (Jogar) também como botão flutuante na Home.
* **Web**: top bar com as mesmas seções + botão destacado *Jogar Agora*.
* **Padrões**: no meio de uma partida, bloquear navegação disruptiva; pedir confirmação ao sair.

---

## 4) Sistema Visual

### 4.1 Paleta (do branding)

* Verde #00923F  | Amarelo #FFC400 | Azul #0A2A66 | Vermelho #C0392B | Cinza #2E2E2E | Off‑white #F4F4F4
* **Neutros UI**: Cinza 900 #121212 | 700 #2E2E2E | 500 #6B6B6B | 300 #BDBDBD | 100 #EDEDED

### 4.2 Tipografia

* Títulos: **Condensed bold grotesk** (Bebas/Anton‑like).
* Texto/auxiliar: Sans com toque **stencil/pixo** para slogans.
* **Escala** (8‑pt): Display 32, H1 24, H2 20, Body 16, Caption 14, Micro 12.

### 4.3 Grid & Espaçamento

* **8‑pt grid**. Padding padrão de cartão: 12–16. Área de toque min: **44px**.
* **Layout de partida**: HUD no topo (altura 64–80), mesa ao centro, mão no rodapé (altura 160 no mobile).

### 4.4 Superfícies & Texturas

* Texturas sutis (concreto/asfalto/lambe rasgado) com opacidade 6–12% para não prejudicar legibilidade.
* **Sombra** (elevations):

  * Card (idle): y2 blur6 15% | (hover/selected): y6 blur18 25%.
  * Modais: y24 blur48 35% + **scrim** 40–60%.

---

## 5) Componentes UI (Especificações)

### 5.1 Cartas (Card)

* **Ratio** 3:4; tamanhos: mobile 120×160 (mín), web 160×213 (mín).
* **Estrutura**: frame por facção, retrato, nome, selos (facção), **Poder** (canto sup.) e **Dano** (canto inf.), texto de regra (máx. 2 linhas; truncar com tooltip).
* **Estados**: `idle`, `hover` (web), `selected`, `locked` (já usada), `disabled` (fora de turno), `winning` / `losing` na revelação.
* **Badges**: ícones pequenos para **Ritmo**, **Mandinga**, `Ao entrar`, `Ao vencer`.
* **Acessibilidade**: contraste AA+, label de leitura (nome, facção, poder, dano, palavra‑chave).

### 5.2 HUD da Partida

* **Respeito** (12/12) como medidor horizontal com marcas em 12;
* **Energia** com pílulas/contagem e botão **+** (desabilitado ao atingir cap).
* **Rodada** 1/4 com contador regressivo (ring + tempo).

### 5.3 Controle de Energia (Slider)

* Range 0..N disponível, com **snaps** inteiros, teclas ←/→ (web) e arrasto (mobile).
* **Incrementos rápidos**: toque curto ±1; **press & hold** repete a cada 120ms.
* Feedback numérico ao lado (+announce para leitores de tela).

### 5.4 Botões

* Primário (sólido): *Confirmar*, *Jogar Agora*.
* Secundário (outline): *Cancelar*, *Voltar*.
* Tamanho M (44–48 de altura), raio 12–16.

### 5.5 Informativos

* **Tooltip** com atraso 250ms (web) e **Sheet**/Popover (mobile) para texto de regra completo.
* **Toasts/Snackbars**: 3s, no topo, não bloqueiam.

### 5.6 Estados de Sistema

* **Loading**: skeleton em lista de cartas (shimmer 1200ms).
* **Vazio**: ilustração leve + CTA.
* **Erro**: mensagem clara + ação (“Tentar de novo”).

### 5.7 Reconexão

* Banner fixo: “Reconectando… 20s” com spinner. **Bloqueia** confirmação até sincronizar.

---

## 6) Motion & Micro‑Interações

### 6.1 Princípios

* **Suave e funcional**: animações comunicam estado, não distraem.
* **Duração padrão**: 150–250ms (UI), 300–400ms (transições de página), 500–700ms (revelar rodada).
* **Easings** (tokens):

  * `motion/standard`: cubic‑bezier(0.2, 0, 0, 1)
  * `motion/decelerate`: cubic‑bezier(0, 0, 0, 1)
  * `motion/anticipate`: cubic‑bezier(0.2, 0.8, 0.2, 1)

### 6.2 Seleção de Carta

* Escala 1.00→1.04 (120ms), sombra aumenta, contorno da facção (2px) acende.

### 6.3 Slider de Energia

* *Tick* discreto a cada snap; número sobe com **count‑up** (60–90ms por unidade).

### 6.4 Revelação de Rodada

* **Stagger** 120ms entre cartas; flip 3D (perspective 800px) 400–500ms;
* **Vencedor**: bounce leve (1.00→1.05→1.00) 280ms; **Perdedor**: fade/tilt 6° 220ms.

### 6.5 Feedback por Facção (VFX simples)

* **Roda de Ginga**: traço de esquiva (arco semi‑transparente) + *whoosh* leve.
* **Motofrete União**: linhas de velocidade diagonais ao ganhar Energia.
* **Crew do Graffiti**: spray curto (partículas) ao aplicar debuff.
* **Bateria Central**: pulso rítmico no HUD (+1 dano em cadeia) sincronizado com *beat*.
* **Guardiões do Verde**: bloom verde‑água sobre aliado curado.
* **Vaqueiros do Sertão**: laço estilizado que “trava” buff adversário por 1 rodada.

### 6.6 Navegação

* *Push* de páginas: slide sutil 12–16px + fade 200–300ms. Modais: scale‑in 0.98→1.0.

### 6.7 Haptics (mobile)

* **Light impact** ao selecionar carta; **Success** ao vencer rodada; **Warning** ao tempo < 5s.

---

## 7) Áudio (opcional no MVP, mas previsto)

* **Camadas**: click UI, efeitos por facção (curtos), loop ambiente muito baixo no tabuleiro.
* **Mix**: -18 LUFS alvo; cortar abaixo de 200Hz em SFX para não embolar.
* **Controles**: ligar/desligar SFX/Música em Configurações.

---

## 8) Padrões por Tela

### 8.1 Home

* Hero com logo **LQ**, subtítulo internacional quando EN. CTA principal *Jogar Agora*. Destaques: Temporada, Deck, Perfil.

### 8.2 Fila/Matchmaking

* Fundo animado leve (linhas diagonais), texto “Procurando oponente…”, cancelável até parear.
* Se vs bot: mensagem transparente “Treino contra IA”.

### 8.3 Partida

* HUD fixo; mesa com área de revelação central. Mão com 4 cartas e slider de energia + botão **Confirmar**.
* Timer anelado ao lado do contador de rodada.
* Ícones/legendas dos efeitos ativos abaixo das cartas reveladas.

### 8.4 Pós‑partida

* Cartaz de **Vitória/Derrota** com variações de cor;
* Resumo: rodadas vencidas, energia gasta total, gatilhos de habilidade; CTA *Jogar de novo*.

### 8.5 Deck

* Grid de cartas; filtro por facção (chips); ao tocar, abre **Sheet** com arte e regra completas.

### 8.6 Temporada/Território (MVP)

* Mapa estilizado com **barras por bairro** (empilhadas por facção). Sem efeitos no matchmaking.

### 8.7 Perfil & Histórico

* Estatísticas (ELO/Respeito, W/L, duração média); lista de partidas com CTA **Rever** (replay).

---

## 9) Acessibilidade

* Contraste AA+; textos escaláveis (preferir unidades relativas).
* Leitores de tela: labels em HUD, cartas (nome, facção, poder, dano, palavras‑chave).
* Daltonismo: não depender de cor — usar ícones e rótulos.
* Motion‑reduce: respeitar preferência do SO; reduzir durações/efeitos quando ativo.

---

## 10) Performance & Qualidade Visual

* **Meta**: 60fps; layout estável (CLS≈0).
* Evitar blur/shadows pesadas em listas.
* **Tiers de qualidade**: baixo (sem partículas), médio (partículas simples), alto (efeitos completos).
* Sprites/atlases para VFX; Lottie < 200KB por animação.

---

## 11) Design System em Código (diretrizes)

* Tokens: `color/brand/*`, `color/faction/*`, `spacing/*`, `radius/* (8|12|16)`, `elevation/*`, `motion/*`.
* **RN/Expo**: Reanimated/Moti para micro‑interações; **Web**: Framer Motion.
* Componentes compartilhados em **@lq/ui**; evitar lógica de jogo no pacote de UI.

**Exemplo de tokens (pseudo‑TS)**

```ts
export const tokens = {
  radius: { sm: 8, md: 12, lg: 16 },
  motion: {
    standard: [0.2, 0, 0, 1],
    decel: [0, 0, 0, 1],
    anticipate: [0.2, 0.8, 0.2, 1],
    dur: { fast: 150, base: 220, slow: 400 }
  }
};
```

---

## 12) Ícones & Metáforas

* **Energia**: pílula/relâmpago estilizado.
* **Respeito**: medalhão/placa de rua.
* **Ritmo**: metrônomo/batida. **Mandinga**: amuleto/escudo leve.
* **Debuff**: spray ‑; **Cura**: folha/gota; **Imunidade**: cadeado.

---

## 13) Microcopy (tonalidade)

* Curtas, positivas e urbanas:

  * “Partiu duelo!”
  * “Ritmo encaixado: +1!”
  * “Mandinga ativada.”
  * “Sem sinal — reconectando…”

---

## 14) Checklist de UX/UI por entrega

* [ ] HUD sempre visível e legível.
* [ ] Estados: idle/selected/locked/disabled/win/lose implementados.
* [ ] Slider com snap + feedback numérico.
* [ ] Timer claro e acessível.
* [ ] VFX por facção funcional (fallback simples em tier baixo).
* [ ] Acessibilidade: contraste, toques ≥44px, labels.
* [ ] Telemetria: eventos de UI disparados.

---


