# Relação entre Casos de Uso, Casos de Teste e Código (Rastreabilidade)

Este documento explica **como os testes automatizados criados** se relacionam com os **Casos de Uso** e com os **Casos de Teste (CTs)** do PDF “Cópia de Casos de Teste.pdf”.

## 1) Casos de Uso (visão do sistema)

### UC-01 — Realizar login
**Objetivo**: permitir que o usuário acesse a plataforma informando usuário e senha.  
**Atores**: usuário.  
**Fluxo principal**:
1. Usuário informa `userDN` e `password` na tela.
2. Frontend chama o backend `POST /authenticate`.
3. Backend valida credenciais (LDAP/AD).
4. Sucesso: backend retorna `username`, frontend salva e navega para `/home`.
5. Falha: frontend exibe mensagem (senha incorreta / usuário não encontrado / falha genérica).

**Componentes/rotas do código**:
- Frontend: `frontend/src/components/Login.jsx`
- Backend: `backend/app.js` (rota `POST /authenticate`)
- Serviço: `backend/services/ldapAuth.js` (autenticação LDAP)

### UC-02 — Listar vídeos disponíveis
**Objetivo**: exibir ao usuário a lista de vídeos disponíveis e permitir selecionar um vídeo.  
**Fluxo principal**:
1. Frontend chama o backend `GET /api/videos`.
2. Backend lista vídeos (FTP/NAS) e retorna `{ videos: [...] }`.
3. Frontend renderiza botões/itens da lista.
4. Usuário clica em um vídeo e o sistema monta a URL para reprodução.

**Componentes/rotas do código**:
- Frontend: `frontend/src/components/VideoList.jsx`
- Backend: `backend/app.js` (rota `GET /api/videos`)
- Serviço: `backend/services/ftpVideos.js` (listagem via FTP)

## 2) Mapa “Caso de Teste do PDF” → “Teste automatizado” → “Parte do código”

### CT-01 — Login com senha incorreta (funcional / aceitação)
**O que valida (conforme PDF)**:
- Exibe mensagem “Senha incorreta”
- Usuário permanece na tela de login
- Nenhuma sessão é criada

**Onde está automatizado**:
- `frontend/src/components/Login.test.jsx`  
  - Teste: **“CT-01: senha incorreta -> mostra 'Senha incorreta' e não navega”**

**Código exercitado**:
- `frontend/src/components/Login.jsx` (tratamento de erro + estado)

**Complemento no backend (integração por contrato)**:
- `backend/__tests__/authenticate.test.js`  
  - Teste: **CT-01 (senha incorreta)** validando resposta 401 + mensagem
- `backend/app.js` (mapeamento de mensagens na rota)

---

### CT-02 — Login com credenciais válidas (funcional / sistema / aceitação)
**O que valida (conforme PDF)**:
- Autenticação realizada com sucesso
- Redirecionamento (dashboard/home)
- Sessão criada (na implementação atual: `localStorage`)

**Onde está automatizado**:
- `frontend/src/components/Login.test.jsx`  
  - Teste: **“CT-02: credenciais válidas -> salva username e navega para /home”**

**Código exercitado**:
- `frontend/src/components/Login.jsx` (salva `username` e navega)

**Complemento no backend (contrato do endpoint)**:
- `backend/__tests__/authenticate.test.js`  
  - Teste: **CT-02 (credenciais válidas)** validando `200` e retorno do `username`
- `backend/app.js` (montagem do `username` a partir do `userDN`)

---

### CT-03 — Listagem de cursos no Dashboard
**Observação importante (estado do sistema)**:
No código atual, a “listagem de cursos/cards” do dashboard vem de arquivo estático (`frontend/src/data/carouselData.js`) e não existe endpoint `/api/cursos` nem filtros/busca implementados como descrito no PDF.

**O que foi feito equivalente ao objetivo do CT-03 (listagem)**:
Implementamos testes automatizados para **listagem de vídeos** (fluxo real existente no sistema):
- `frontend/src/components/VideoList.test.jsx` (lista renderizada a partir de `GET /api/videos`)
- `backend/__tests__/videos.test.js` (contrato do `GET /api/videos`)

Se quiser, dá para evoluir o sistema criando `/api/cursos` e filtros/busca e então automatizar o CT-03 literalmente.

---

### CT-04 — Download de material de apoio
**Observação importante (estado do sistema)**:
No código atual, a tela `frontend/src/pages/MaterialPage.jsx` tem botão “Baixar”, mas **não há implementação de download** (rota/endpoint/arquivo) para validar integridade do arquivo.

**Como isso aparece no relatório**:
- Marcado como **fora do escopo/limitado pelo código atual** no `RELATORIO_FINAL.md`.

---

### CT-05 — Validação interna das credenciais no AD (caixa-branca)
**O que valida (conforme PDF)**:
- Quando o `client.bind()` falha:
  - `unbind()` é chamado
  - retorna falha
  - rota responde 401

**Onde está automatizado**:
- `backend/__tests__/ldapAuth.test.js`  
  - Teste: **“CT-05: quando bind falha, unbind é chamado e retorna ok=false”**

**Código exercitado**:
- `backend/services/ldapAuth.js` (fluxo de erro do bind + unbind)

---

### CT-08 — Carregamento sob carga (não-funcional / desempenho)
**Status**:
Não automatizado neste projeto (não há endpoint `/api/cursos` e não foi incluída ferramenta de carga).

**Como fazer se necessário (sugestão)**:
Usar k6/JMeter/Artillery e medir tempo/erros, documentando no relatório.

---

### CT-09 — Confirmação de bug de download corrompido
**Status**:
Depende da implementação real do download (CT-04).

---

### CT-10 — Regressão (listagem após atualização da API)
**O que foi coberto como regressão no código atual**:
1. **Bug de rota**: `Home.jsx` navegava para `/videos/:id` (rota inexistente) → corrigido para `/video/:id`.
2. **Bug de reprodução**: `VideoList.jsx` não usava o `filename` ao montar a URL → corrigido.

**Onde está automatizado**:
- `frontend/src/components/VideoList.test.jsx`  
  - Teste: **“ao clicar em um vídeo, monta a URL com base + filename (regressão)”**

## 3) Técnicas exigidas (como aparecem nos testes)

### Partição de Equivalência
- `backend/__tests__/authenticate.test.js`: body inválido → 400
- `frontend/src/components/Login.test.jsx`: sucesso / senha inválida / usuário inválido / falha de rede

### Análise de Valor Limite
- `frontend/src/components/Login.test.jsx`: usuário apenas com espaços (“   ”) → bloqueia e não chama API

### Tabela de Decisão
- `frontend/src/components/Login.test.jsx`: “Senha incorreta” vs “Usuário não encontrado” vs “Falha na autenticação”

### Transição de Estados
- `frontend/src/components/Login.test.jsx`: valida estado **loading** (“Entrando...”) e retorno ao estado normal

## 4) Lista rápida dos arquivos de teste (para apresentação)

### Frontend
- `frontend/src/App.test.js`
- `frontend/src/components/Login.test.jsx`
- `frontend/src/components/VideoList.test.jsx`

### Backend
- `backend/__tests__/authenticate.test.js`
- `backend/__tests__/videos.test.js`
- `backend/__tests__/ldapAuth.test.js`
- `backend/__tests__/ftpVideos.test.js`


