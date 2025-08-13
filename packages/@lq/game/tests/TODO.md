# Testes a implementar na Fase 2

## Testes Unitários

1. **attack-calculation.spec.ts**
   - Testar cálculo de ataque: `Atk = (Poder × 10) + EnergiaGasta`
   - Validar valores mínimos e máximos

2. **round-order-of-operations.spec.ts**
   - Verificar ordem correta: Passivos → Ao entrar → Revelar → Buffs/Debuffs → Calcular → Vencedor → OnWin/OnLose → Cleanup → Regen

3. **tie-no-damage.spec.ts**
   - Empate não causa dano
   - Efeitos onWin não disparam em empate

4. **half-damage-rounding-up.spec.ts**
   - Redução de dano pela metade arredonda para cima
   - Aplicar após determinar vencedor

5. **immunity-first-debuff.spec.ts**
   - Vaqueiros do Sertão ignora primeiro debuff da partida
   - Marcar imunidade como consumida

6. **on-win-gain-energy-motofrete.spec.ts**
   - Motofrete União: +1 Energia ao vencer
   - Respeitar cap de 12

7. **rhythm-chain-bateria.spec.ts**
   - Bateria Central: +1 Dano por vitória consecutiva
   - Reset em derrota/empate

8. **graffiti-next-round-debuff.spec.ts**
   - Crew do Graffiti: +1 Poder se primeira carta do turno
   - Debuff aplicado na próxima rodada

9. **end-of-round-heal-guardioes.spec.ts**
   - Guardiões do Verde: cura 1 o aliado de menor HP no fim da rodada

10. **four-rounds-sequence.integration.spec.ts**
    - Sequência completa de 4 rodadas
    - Verificar estado final correto
    - Validar todas as regras funcionando juntas

## Estrutura dos Testes

```typescript
describe('resolveRound', () => {
  it('should calculate attack correctly', () => {
    // Given: carta com Poder 7, Energia 3
    // When: calcular ataque
    // Then: Atk = (7 × 10) + 3 = 73
  });
});
```

## Cobertura Alvo

- **Mínimo**: 80% linhas/branches
- **Foco**: função `resolveRound` e lógica de facções
- **Métricas**: vitest --coverage
