# Instituto Federal de Pernambuco — Projeto de Testes de Software

## Documentos de entrega
- `RELATORIO_FINAL.md`
- `ROTEIRO_APRESENTACAO.md`

## Como rodar os testes (com cobertura)

### Backend (Jest + Supertest)
```bash
cd backend
npm install
npm run test:coverage
```

### Frontend (Jest + React Testing Library)
```bash
cd frontend
npm install
npm run test:coverage
```

## Observação sobre registry npm
Para evitar falhas de autenticação em registries privados, foi adicionado um `.npmrc` local em:
- `frontend/.npmrc`
- `backend/.npmrc`

