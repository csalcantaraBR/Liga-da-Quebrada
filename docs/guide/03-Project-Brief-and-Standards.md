# Brief e Padrões do Projeto

## Padrões de Desenvolvimento
- **Nomenclatura**: camelCase para variáveis, PascalCase para componentes
- **Estrutura de Testes**: describe → it → expect
- **Mocks**: Centralizados em __mocks__/ ou inline com vi.mock()
- **Convenções**: Given-When-Then para testes BDD

## Gates de Qualidade
- Cobertura mínima: 80%
- Testes obrigatórios: 100% passando
- Type checking: TypeScript sem erros
- Linting: ESLint sem erros
- Security audit: Vulnerabilidades críticas bloqueadas
