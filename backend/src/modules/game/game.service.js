import prisma from "../../infra/prisma/prisma.js";
import { Decimal } from "@prisma/client/runtime/library";
const GameService = {};

GameService.list = async (limit, offset, field, order, search) => {
  const query = {
    take: limit,
    skip: offset,
    include: {
      console: true,
    },
    orderBy:
      field == "consoleName"
        ? {
            console: {
              name: order,
            },
          }
        : { [field]: order },
    where: {
      OR: [
        { name: { contains: search || "", mode: "insensitive" } },
        {
          console: { name: { contains: search || "", mode: "insensitive" } },
        },
      ],
    },
  };
  const [games, total, gameWithMoreOrders] = await Promise.all([
    prisma.game.findMany(query),
    prisma.game.count(),
    prisma.game.findFirst({
      include: { reserves: true },
      orderBy: {
        reserves: {
          _count: "desc",
        },
      },
    }),
  ]);

  return { games, total, gameWithMoreOrders };
};

GameService.create = async (body) => {
  await prisma.game.create({
    data: {
      name: body.name,
      price: new Decimal(body.price),
      description: body.description,
      amount: body.amount,
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
      amount: body.amount,
      ...(body.console && {
        console: {
          connect: { id: body.console },
        },
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
