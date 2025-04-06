## Comando para iniciar o app

1. Baixar o docker
2. docker compose up -d --build
3. docker exec backend npx prisma generate
4. docker exec backend npx prisma migrate dev

## Observar Logs Backend
1. docker logs backend -f

## Restart Docker
1. docker restart backend
## Rodar migration
2. docker exec backend npx prisma migrate dev

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
 

 ## Swagger
 1. Referência https://davibaltar.medium.com/documenta%C3%A7%C3%A3o-autom%C3%A1tica-de-apis-em-node-js-com-swagger-parte-2-usando-openapi-v3-cbc371d8c5ee