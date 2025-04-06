import prisma from "../../infra/prisma/prisma.js";
import { Decimal } from '@prisma/client/runtime/library';
const ExampleService = {};

ExampleService.list = async () => {
  const result = await prisma.console.findMany();
  return result;
};

ExampleService.create = async (body) => {
  await prisma.console.create({
    data: {
      name: body.name,
      ...(body.games && body.games.length > 0 && {
        games: {
          connect: body.games.map((gameId) => ({ id: gameId })), // Conecta os jogos existentes pelo ID
        },
      }),
    },
  });
  console.log("Body recebido:", body);
};

ExampleService.create = async (body) => {
  console.log("Body recebido:", body);

  // Cria o console e captura o resultado
  const createdConsole = await prisma.console.create({
    data: {
      name: body.name,
      games: body.games,
    },
  });

  // Exibe o console criado, incluindo o ID
  console.log("Console criado:", createdConsole);

  return createdConsole; // Retorna o console criado, se necessário
};

ExampleService.update = async (body) => {
  await prisma.console.update({
    where: { id: body.id },
    data: {
      name: body.name,
      ...(body.games && body.games.length > 0 && {
        games: {
          connect: body.games.map((gameId) => ({ id: gameId })), // Conecta os jogos existentes pelo ID
        },
      }),
    },
  });
};

ExampleService.delete = async (body) => {
  await prisma.console.delete({
    where: { id: body.id },
  });
};
export default ExampleService;
