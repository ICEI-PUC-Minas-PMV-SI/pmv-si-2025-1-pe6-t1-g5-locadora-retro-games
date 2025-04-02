import prisma from "../../infra/prisma/prisma.js";
import { Decimal } from '@prisma/client/runtime/library';
const ExampleService = {};

ExampleService.list = async () => {
  const result = await prisma.game.findMany();
  return result;
};

ExampleService.create = async (body) => {
  console.log("Body recebido:", body);
  await prisma.game.create({
    data: {
      name: body.name,
      price: new Decimal(body.price),
      description: body.description,
      console: {
        connect: { id: body.console }, // Conecta ao console existente
      },
    },

  });
  console.log(body)
};
ExampleService.update = async (body) => {
  await prisma.game.update({
    where: { id: body.id },
    data: {
      name: body.name,
      price: new Decimal(body.price),
      description: body.description,
      ...(body.console && { 
        console: { 
          connect: { id: body.console } //Valida se o consoleId foi passado na requisição para alterar o console do game.
        } 
      }),
    },
  });
};

ExampleService.delete = async (body) => {
  await prisma.game.delete({
    where: { id: body.id },
  });
};
export default ExampleService;
