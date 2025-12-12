# Roteiro de apresentação (máx. 20 min) — Testes de Software

## 0) Abertura (1 min)
- Contexto: disciplina de testes de software + sistema escolhido.
- Objetivo: mostrar estratégia, testes executados, evidências e resultados.

## 1) Visão geral do sistema (2 min)
- Stack: React (CRA) + Node/Express.
- Fluxos principais:
  - Login (frontend → backend → LDAP/AD)
  - Listagem de vídeos (frontend → backend → FTP/NAS)

## 2) Estratégia de testes (3 min)
- Pirâmide: foco em unitários/integração, com cenários funcionais no frontend.
- Reprodutibilidade: uso de **mocks** para LDAP/FTP.

## 3) Técnicas exigidas (6 min)
- **Partição de Equivalência**: classes válidas/ inválidas para login e respostas de API.
- **Valor Limite**: usuário com espaços (entrada limite) bloqueia envio.
- **Tabela de Decisão**: mensagem do backend → mensagem exibida no frontend.
- **Transição de Estados**: idle → loading → success/error no login.
- **Casos de Uso**: UC-01 login, UC-02 listagem de vídeos.

## 4) Tipos de teste executados (4 min)
- Funcional (caixa-preta): UI do login e listagem.
- Unitário/estrutural (caixa-branca): serviços/rotas do backend (CT-05).
- Regressão: correções de rota e montagem de URL de vídeo.
- Aceitação: CT-01/CT-02 automatizados com critérios observáveis.

## 5) Evidências e cobertura (3 min)
- Mostrar saída do `npm run test:coverage`:
  - Backend: suites e % de cobertura.
  - Frontend: suites e destaque do `Login.jsx` e `VideoList.jsx`.

## 6) Encerramento (1 min)
- Conclusão: requisitos atendidos + principais ganhos.
- Próximos passos: download real + Cypress E2E + aumento de cobertura.


