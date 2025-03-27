## Comando para iniciar o app

1. Baixar o docker
2. docker compose up -d --build
3. docker exec backend npx prisma generate
4. docker exec backend npx prisma migrate dev

## Observar Logs Backend
1. docker logs backend -f

## Restart Docker
1. Docker restart backend
## Rodar migration
2. Docker exec backend npx prisma migrate dev

## ---------------------------------------------------------

## Ordem de Camadas
1. Service -> Controller -> Route -> Index

## Service
1. Camada de Aplicação
 - Regra de negócios
 -Acesso ao BD

## Controller
1. Camada de apresentação
 - Mostra os dados 
 - Formata os métodos http Ex:(200,201,400,500)

## Route
1. Rotas do modulo
 
## Index
1. Inicio da configuração do servidor
 