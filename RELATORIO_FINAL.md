# Relatório Final — Disciplina de Testes de Software

Equipe: Dayane Cunha, Kemelly Nascimento, Júlia Diniz e Nayara Maria  
Sistema: Plataforma Web **Universidade Nutrihouse**

## 1) Descrição do sistema testado
A Universidade Nutrihouse é uma plataforma web (React + Node/Express) com foco em:
- **Autenticação**: tela de login no frontend que chama o backend (`POST /authenticate`) para validar credenciais (LDAP/AD).
- **Consumo de conteúdo**: listagem de vídeos obtida do backend (`GET /api/videos`), originalmente via FTP (NAS).

### 1.1 Arquitetura (alto nível)
- **Frontend**: React (Create React App), rotas via `react-router-dom`.
- **Backend**: Node.js + Express, com serviços externos:
  - LDAP (bind para autenticação)
  - FTP (listar vídeos)

## 2) Objetivo e escopo dos testes
### 2.1 Objetivo
Garantir que os fluxos principais funcionem de ponta a ponta (login e listagem), com evidências, cobertura e análise dos resultados.

### 2.2 Escopo (incluído)
- Login (frontend + backend)
- Listagem de vídeos (backend + componente de listagem)
- Tratamento de falhas (credenciais inválidas, erro de rede/servidor, erro em serviço externo)

### 2.3 Fora do escopo (limitado pelo código atual)
- **Download real de material**: no código atual há UI (`MaterialPage`) sem implementação de download/endpoint.
- **Listagem de cursos via banco**: no código atual a lista vem de dados estáticos (`carouselData`).

## 3) Técnicas e abordagens aplicadas (conforme requisitos)

### 3.1 Partição de Equivalência
Exemplos aplicados no login:
- Classe válida: credenciais corretas → autentica e navega.
- Classe inválida: senha incorreta → mensagem adequada.
- Classe inválida: usuário inexistente → mensagem adequada.
- Classe inválida: falha de rede/servidor → mensagem “Erro ao conectar ao servidor”.

### 3.2 Análise de Valor Limite
Aplicada no login:
- **Limite inválido**: usuário contendo apenas espaços (“   ”) → bloqueia envio e exibe “Usuário obrigatório”.

### 3.3 Tabela de Decisão
Decisão de mensagem no login (backend → frontend):

| Condição (resposta do backend) | Mensagem exibida no frontend |
|---|---|
| `Senha incorreta` | “Senha incorreta” |
| `Usuário não encontrado` | “Usuário não encontrado” |
| qualquer outra | “Falha na autenticação” |

### 3.4 Transição de Estados
Modelagem do estado do login:
- **idle** → usuário preenche dados
- **loading** → clicou “Entrar” (botão desabilita / texto “Entrando...”)
- **success** → salva `username` e navega para `/home`
- **error** → mostra mensagem e retorna a idle

### 3.5 Casos de Uso
- **UC-01 — Realizar login**: usuário informa credenciais → sistema autentica → redireciona.
- **UC-02 — Listar vídeos**: sistema consulta backend → exibe lista → usuário seleciona vídeo.

## 4) Tipos de teste executados
- **Testes Funcionais (caixa-preta)**: UI do login e listagem (com mocks de API).
- **Testes Unitários/Estruturais (caixa-branca)**: serviços e rotas do backend (mocks de LDAP/FTP).
- **Testes de Regressão**: correções que quebravam o fluxo:
  - rota `/videos/:id` corrigida para `/video/:id`
  - `VideoList` passou a usar o `filename` ao montar URL do vídeo
- **Testes de Aceitação**: CT-01/CT-02 automatizados no componente de Login (critérios observáveis: mensagem, navegação, armazenamento).

## 5) Automação e ferramentas
### 5.1 Ferramentas
- **Jest** (runner, assertions, mocking, coverage)
- **React Testing Library** (testes de UI/aceitação no frontend)
- **Supertest** (testes de rotas HTTP no backend)

### 5.2 Como executar
#### Backend
```bash
cd backend
npm run test:coverage
```

#### Frontend
```bash
cd frontend
npm run test:coverage
```

## 6) Evidências (logs/prints)

### 6.1 Backend — `npm run test:coverage`
Resumo observado:
- 4 suites, 9 testes, todos passando
- Cobertura global: **75% statements**, **44.18% branches**

### 6.2 Frontend — `npm run test:coverage`
Resumo observado:
- 3 suites, 9 testes, todos passando
- Cobertura global: **22.16% statements**, **20.61% branches**
  - `Login.jsx`: **93.93% statements** (foco do escopo/CTs)
  - `VideoList.jsx`: **93.33% statements**

> Observação: a cobertura global do frontend é menor porque o sistema possui múltiplas páginas/componentes fora do escopo priorizado (Home, Cards, Sobre, etc.).

## 7) Análise dos resultados
- **Conformidade com requisitos**: técnicas pedidas foram aplicadas (equivalência, limite, decisão, estados, casos de uso) e automatização com Jest/RTL/Supertest.
- **Riscos/limitações**:
  - dependência de infraestrutura externa real (LDAP/FTP) foi substituída por **mocks** para garantir reprodutibilidade.
  - módulos fora do escopo permanecem com baixa cobertura; recomenda-se expandir testes para `Home`, `Header`, `Sidebar` e fluxo de navegação completo.

## 8) Próximos passos recomendados
- Implementar endpoint real de download de materiais + testes (CT-04/CT-09).
- Criar testes E2E com Cypress (login real + navegação).
- Aumentar cobertura do frontend (componentes de navegação e páginas).


