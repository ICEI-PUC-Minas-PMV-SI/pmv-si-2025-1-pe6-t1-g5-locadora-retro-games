import prisma from "../../infra/prisma/prisma.js";
import { Decimal } from '@prisma/client/runtime/library';
const GameService = {};

GameService.list = async (limit, offset) => {
  const [games, total] = await Promise.all([
    prisma.game.findMany({
      take: limit,
      skip: offset,
      include: {
        console: true
      }
    }),
    prisma.game.count()
  ]);

  return { games, total };
};

GameService.create = async (body) => {
  await prisma.game.create({
    data: {
      name: body.name,
      price: new Decimal(body.price),
      description: body.description,
      console: {
        connect: { id: body.console },
      },
    },
  });
};
GameService.update = async (body) => {
  await prisma.game.update({
    where: { id: body.id },
    data: {
      name: body.name,
      price: new Decimal(body.price),
      description: body.description,
      ...(body.console && { 
        console: { 
          connect: { id: body.console }
        } 
      }),
    },
  });
};

GameService.delete = async (body) => {
  await prisma.game.delete({
    where: { id: body.id },
  });
};
export default GameService;
