import prisma from "../../infra/prisma/prisma.js";
import { Decimal } from '@prisma/client/runtime/library';
const ConsoleService = {};

ConsoleService.list = async (limit, offset) => {
  const [consoles, total] = await Promise.all([
    prisma.console.findMany({
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: { games: true }
        }
      }
    }),
    prisma.console.count()
  ]);

  return { consoles, total };
};

ConsoleService.create = async (body) => {
  await prisma.console.create({
    data: {
      name: body.name,
      ...(body.games && body.games.length > 0 && {
        games: {
          connect: body.games.map((gameId) => ({ id: gameId })),
        },
      }),
    },
  });
  console.log("Body recebido:", body);
};

ConsoleService.create = async (body) => {
  const createdConsole = await prisma.console.create({
    data: {
      name: body.name,
      games: body.games,
    },
  });
  return createdConsole;
};

ConsoleService.update = async (body) => {
  await prisma.console.update({
    where: { id: body.id },
    data: {
      name: body.name,
      ...(body.games && body.games.length > 0 && {
        games: {
          connect: body.games.map((gameId) => ({ id: gameId })),
        },
      }),
    },
  });
};

ConsoleService.delete = async (body) => {
  await prisma.console.delete({
    where: { id: body.id },
  });
};
export default ConsoleService;
