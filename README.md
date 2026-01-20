# Hypesoft Challenge

Aplicação full-stack de gestão de inventário com produtos, categorias, controle de estoque, dashboard simples e autenticação via Keycloak.

## Funcionalidades
- Gestão de produtos: criar, listar, editar, excluir, buscar por nome e filtrar por categoria.
- Categorias: criar/editar/excluir categorias e associar produtos.
- Controle de estoque: atualização manual e listagem de baixo estoque (< 10).
- Dashboard: total de produtos, valor do estoque, lista de baixo estoque, gráfico por categoria.
- Autenticação: login via Keycloak (OIDC), rotas protegidas, acesso por roles, logout.
- UI: layout responsivo, validações e feedback via toasts.

## Arquitetura
- Backend em Clean Architecture + CQRS (Domain/Application/Infrastructure/API).
- Camada Application com MediatR para commands/queries e FluentValidation para regras.
- Infraestrutura com EF Core + provider MongoDB.
- Frontend em Next.js App Router com componentes, hooks e services modulares.

## Estrutura de Pastas (Frontend)
```
src/
├── components/
│   ├── ui/        # componentes base (shadcn/ui)
│   ├── forms/     # componentes de formulário
│   ├── charts/    # gráficos
│   └── layout/    # layout/navegação/guards
├── app/           # páginas (Next.js App Router)
├── hooks/         # hooks customizados
├── services/      # serviços de API
├── stores/        # (reservado para estado global)
├── types/         # tipos compartilhados
├── utils/         # helpers
└── lib/           # configs de bibliotecas
```

## Estrutura de Pastas (Backend)
```
backend/
├── Hypesoft.API/            # camada de apresentação (controllers)
├── Hypesoft.Application/    # casos de uso, handlers, validators, DTOs
├── Hypesoft.Domain/         # entidades e contratos de repositório
├── Hypesoft.Infrastructure/ # persistência, db context, repos
└── Hypesoft.Tests/          # testes
```

## Executar com Docker
1) Build e start:
```
docker-compose up --build
```

2) Acessos:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Keycloak: http://localhost:8080
- Mongo Express: http://localhost:8081

## Keycloak (Configuração via Código)
O Keycloak é configurado via `keycloak/realm-export.json` e importado na inicialização.

Usuários padrão:
- admin / admin (role: admin)
- manager / manager (role: manager)
- user / user (role: user)

Roles e acesso:
- admin: acesso total
- manager: criar/editar (sem delete)
- user: apenas leitura do dashboard (sem produtos/categorias)

Se o realm mudar, reimporte resetando o Keycloak:
```
docker-compose down -v
docker-compose up --build
```

## Desenvolvimento Local (sem Docker)
Backend:
```
cd backend
dotnet run --project Hypesoft.API
```

Frontend:
```
cd frontend
npm install
npm run dev
```

## Variáveis de Ambiente
Veja `.env.example`.

Principais:
- KEYCLOAK_URL=http://localhost:8080
- KEYCLOAK_REALM=hypesoft
- KEYCLOAK_CLIENT_ID=hypesoft-api
- NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
- NEXT_PUBLIC_KEYCLOAK_REALM=hypesoft
- NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=hypesoft-web

## Endpoints da API (Resumo)
- GET /api/products
- GET /api/products/{id}
- POST /api/products
- PUT /api/products/{id}
- PUT /api/products/{id}/stock (admin apenas)
- DELETE /api/products/{id} (admin apenas)

- GET /api/categories
- GET /api/categories/{id}
- POST /api/categories
- PUT /api/categories/{id}
- DELETE /api/categories/{id} (admin apenas)

- GET /api/products/low-stock
- GET /api/dashboard
- GET /health

## Notas sobre Requisitos
Implementado:
- Autenticação com Keycloak, rotas protegidas, acesso por roles.
- Validações de campos e precisão de preço (frontend + backend).
- Listagem de baixo estoque e KPIs no dashboard.
- UI responsiva com Tailwind + shadcn/ui + Recharts.

Planejado (ainda não integrado):
- Cache para consultas frequentes.
- Rate limiting.
- Logging estruturado (Serilog).
- AutoMapper.
- Testes (xUnit/FluentAssertions, React Testing Library/Vitest).

## Por que essa estrutura
- Clean Architecture mantém a lógica de domínio independente de frameworks.
- CQRS + MediatR facilita a separação de comandos/consultas e evolução.
- Separação do frontend (components/hooks/services) melhora manutenção e testes.
- Autorização em UI e API evita estados inconsistentes e protege dados.
