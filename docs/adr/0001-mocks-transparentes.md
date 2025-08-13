# ADR 0001: Mocks Transparentes para Desenvolvimento TDD

## Status

**Aceito** - 2024-12-19

## Contexto

Durante o desenvolvimento do MVP de Liga da Quebrada seguindo metodologia TDD-primeiro, precisamos definir uma estratégia clara para lidar com integrações externas e sistemas complexos que ainda não foram implementados.

O projeto está estruturado em fases:
- **FASE 1-4**: Lógica de jogo pura (concluída)
- **FASE 5**: Mocks transparentes (atual)
- **FASE 6**: UX/UI completa
- **FASE 7**: Funcionalidades de jogo
- **FASE 8**: Integrações
- **FASE 9**: Aplicações completas

## Decisão

Implementar **mocks transparentes** seguindo os princípios:

1. **Transparência**: Todo mock deve ser documentado com seu contrato real
2. **Temporariedade**: Mocks são temporários até implementação real
3. **Contratos**: Definir contratos claros para validação futura
4. **Testes**: Criar testes de contrato para validar integrações reais

### Estratégia de Implementação

#### FASE 6 — UX/UI
- **Navegação**: Mock com React Navigation (mobile) e Next.js Router (web)
- **Animações**: Mock com React Native Reanimated e Framer Motion
- **Acessibilidade**: Mock com sistema completo de acessibilidade

#### FASE 7 — Funcionalidades
- **Matchmaking**: Mock com Redis + Colyseus
- **Partidas**: Mock com sala Colyseus completa
- **Deck**: Mock com Supabase

#### FASE 8 — Integrações
- **Servidor**: Mock com Colyseus funcional
- **Banco**: Mock com Supabase real
- **Auth**: Mock com Supabase Auth
- **Telemetria**: Mock com serviço de analytics

#### FASE 9 — Aplicações
- **PWA**: Mock com funcionalidades PWA completas
- **Mobile**: Mock com funcionalidades nativas

## Consequências

### Positivas
- **Desenvolvimento paralelo**: Equipes podem trabalhar independentemente
- **Testabilidade**: Mocks permitem testes isolados
- **Flexibilidade**: Fácil troca de implementações
- **Documentação**: Contratos claros para integração

### Negativas
- **Complexidade**: Mais código para manter
- **Risco de divergência**: Mocks podem ficar desatualizados
- **Overhead**: Tempo para criar e manter mocks

### Riscos
- **"Sucesso fantasma"**: Mocks podem esconder problemas reais
- **Dependência**: Equipes podem depender demais dos mocks
- **Performance**: Mocks podem não refletir performance real

## Alternativas Consideradas

### 1. Implementação Direta
- **Prós**: Sem overhead de mocks
- **Contras**: Desenvolvimento sequencial, difícil testar

### 2. Stubs Simples
- **Prós**: Simples de implementar
- **Contras**: Não documentam contratos reais

### 3. Test Doubles
- **Prós**: Padrão estabelecido
- **Contras**: Pode ser excessivo para nosso caso

## Implementação

### Documentação
- `/docs/mocks/mocks.md`: Documentação central de mocks
- `/docs/adr/0001-mocks-transparentes.md`: Este ADR

### Estrutura de Testes
```typescript
describe('Contract Tests - [Service Name]', () => {
  it('should match expected interface', () => {
    // Validar que o mock implementa o contrato
  });
  
  it('should handle error cases', () => {
    // Validar tratamento de erros
  });
  
  it('should return expected data format', () => {
    // Validar formato de dados
  });
});
```

### Checklist de Validação
- [ ] Mock documentado em `/docs/mocks/mocks.md`
- [ ] Contrato definido claramente
- [ ] Testes de contrato criados
- [ ] Plano de remoção estabelecido
- [ ] Riscos identificados

## Referências

- [Metodologia TDD-Primeiro](../Instruçoes/[SYSTEM e INSTRUÇÕES FUNCIONAIS – TDD‑PRIMEIRO])
- [Instruções Funcionais](../Instruçoes/Instruçoes funcionais)
- [Documentação de Mocks](./mocks/mocks.md)
