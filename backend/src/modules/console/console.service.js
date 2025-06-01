import prisma from "../../infra/prisma/prisma.js";
const ConsoleService = {};

ConsoleService.list = async (limit, offset, field, order, search) => {
  const [consoles, total, consoleWithMoreGames] = await Promise.all([
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
      },
      orderBy: field === "gamesCount" ? { games: { _count: order } } : { [field]: order },
    }),
    prisma.console.count(),
    prisma.console.findFirst({
      include: {
        _count: {
          select: { games: true },
        },
      },
      orderBy: {
        games: {
          _count: "desc",
        },
      },
    }),
  ]);

  return { consoles, total, consoleWithMoreGames };
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
