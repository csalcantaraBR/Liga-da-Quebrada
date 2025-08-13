# Liga da Quebrada

> **Card battler tático 1v1** com partidas de 3-4 minutos, progressão justa e Guerra de Território sazonal.

[![CI](https://github.com/your-org/liga-da-quebrada/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/liga-da-quebrada/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/your-org/liga-da-quebrada/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/liga-da-quebrada)

## 🎮 Sobre o Jogo

**Liga da Quebrada** é um card battler tático onde você recruta sua crew, vence duelos estratégicos e domina territórios. Cada partida é uma batalha de 4 rodadas onde você escolhe cartas únicas de 6 facções diferentes, cada uma com habilidades especiais.

### 🏆 Facções

- **Roda de Ginga**: Esquiva e contra-ataques
- **Motofrete União**: Velocidade e energia
- **Crew do Graffiti**: Arte e debuffs
- **Bateria Central**: Ritmo e combos
- **Guardiões do Verde**: Cura e proteção
- **Vaqueiros do Sertão**: Imunidade e controle

## 🚀 Tecnologias

- **Monorepo**: pnpm + Turborepo
- **Frontend**: React + TypeScript + React Native
- **Backend**: Node.js + Colyseus + Express
- **Testes**: Vitest (unit/integration) + Playwright (E2E)
- **Linting**: ESLint + Prettier
- **CI**: GitHub Actions

## 📦 Estrutura do Projeto

```
Liga da Quebrada/
├── packages/
│   ├── @lq/shared/     # Tipos e schemas compartilhados
│   ├── @lq/ui/         # Componentes UI (React + React Native)
│   └── @lq/game/       # Lógica de jogo pura
├── apps/
│   ├── web/            # Next.js PWA
│   ├── mobile/         # Expo React Native
│   └── server/         # Colyseus + Express
└── docs/               # Documentação
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- pnpm 8+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/your-org/liga-da-quebrada.git
cd liga-da-quebrada

# Instale as dependências
pnpm install
```

### Comandos

```bash
# Desenvolvimento
pnpm dev              # Inicia todos os apps em modo dev
pnpm dev:web          # Apenas app web
pnpm dev:mobile       # Apenas app mobile
pnpm dev:server       # Apenas servidor

# Testes
pnpm test             # Executa todos os testes
pnpm test:ci          # Testes com coverage
pnpm test:watch       # Testes em modo watch

# Build
pnpm build            # Build de todos os pacotes
pnpm build:web        # Build do app web
pnpm build:mobile     # Build do app mobile
pnpm build:server     # Build do servidor

# Qualidade
pnpm lint             # ESLint em todos os pacotes
pnpm format           # Prettier em todos os arquivos
pnpm typecheck        # TypeScript check
```

## 🧪 Testes

O projeto segue metodologia **TDD-primeiro** com cobertura mínima de **80%**.

```bash
# Executar testes
pnpm test

# Ver cobertura
pnpm test:ci

# Testes específicos
pnpm test -- @lq/game
```

## 📚 Documentação

- [Documentação Técnica](./docs/README.md)
- [Instruções Funcionais](./Instruçoes/)
- [ADRs](./docs/adr/) - Architectural Decision Records
- [Mocks](./docs/mocks/) - Documentação de mocks

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Siga a metodologia TDD-primeiro
4. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
5. Push para a branch: `git push origin feature/nova-funcionalidade`
6. Abra um Pull Request

### Padrões de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `test:` Adição ou correção de testes
- `docs:` Documentação
- `refactor:` Refatoração
- `chore:` Tarefas de manutenção

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🏗️ Roadmap

- [x] **Fase 2**: Testes RED em `@lq/game`
- [x] **Fase 3**: Implementação mínima (GREEN)
- [x] **Fase 4**: Refatoração segura
- [x] **Fase 5**: Mocks transparentes
- [x] **Fase 6**: UX/UI Completa
- [ ] **Fase 7**: Funcionalidades de Jogo
- [ ] **Fase 8**: Integrações (Colyseus, Supabase)
- [ ] **Fase 9**: Aplicações Completas

---

**Liga da Quebrada** - *Domine sua área.*
