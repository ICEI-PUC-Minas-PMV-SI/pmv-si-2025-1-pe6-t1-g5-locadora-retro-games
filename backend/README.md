## Comando para iniciar o app

1. Baixar o docker
2. docker compose up -d --build
3. docker exec backend npx prisma generate
4. docker exec backend npx prisma migrate dev

## Observar Logs Backend
1. docker logs backend -f

## Restart Docker
1. docker restart backend

## Rodar migration nova
2. docker exec backend npx prisma migrate dev

## Resetar banco
1. docker stop backend postgres
2. docker system prune -fa --volumes (cuidado! se tiver outras imagens e volumes no docker que não estiver usando, ele vai limpar também!!!)
3. se optar por não usar o comando 2, dê um docker volume ls e delete apenas o volume que precisa

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