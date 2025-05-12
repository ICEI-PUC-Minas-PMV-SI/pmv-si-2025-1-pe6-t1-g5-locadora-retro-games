import prisma from "../../infra/prisma/prisma.js";
import { Decimal } from '@prisma/client/runtime/library';
const ConsoleService = {};

ConsoleService.list = async (limit, offset, search) => {
  const [consoles, total] = await Promise.all([
    prisma.console.findMany({
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: { games: true }
        }
      },
      where: {
        name: { contains: search || "", mode: "insensitive" }
      }
    }),
    prisma.console.count()
  ]);

  return { consoles, total };
};

ConsoleService.create = async (body) => {
  await prisma.console.create({
    data: {
      name: body.name
    },
  });
};

ConsoleService.update = async (body) => {
  await prisma.console.update({
    where: { id: body.id },
    data: {
      name: body.name
    },
  });
};

ConsoleService.delete = async (body) => {
  await prisma.console.delete({
    where: { id: body.id },
  });
};

export default ConsoleService;
