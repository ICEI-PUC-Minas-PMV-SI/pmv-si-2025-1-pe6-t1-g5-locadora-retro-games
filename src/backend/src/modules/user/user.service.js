import prisma from "../../infra/prisma/prisma.js";

const ExampleService = {};

ExampleService.list = async () => {
    const result = await prisma.user.findMany();
    return result;
};

ExampleService.create = async (body) => {
    await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
          cpf: body.cpf
        },
      });
};

export default ExampleService;