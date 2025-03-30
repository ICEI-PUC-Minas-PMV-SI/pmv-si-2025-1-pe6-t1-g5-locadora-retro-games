import prisma from "../../infra/prisma/prisma.js";

const ExampleService = {};

ExampleService.list = async () => {
  const result = await prisma.game.findMany();
  return result;
};

ExampleService.create = async (body) => {
  await prisma.game.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description
    },
  });
};
ExampleService.update = async (body) => {
  await prisma.game.update({
    where: { id: body.id },
    data: {
      name: body.name,
      price: body.price,
      description: body.descriptionw
    },
  });
};

ExampleService.delete = async (body) => {
  await prisma.game.delete({
    where: { id: body.id },
  });
};
export default ExampleService;
