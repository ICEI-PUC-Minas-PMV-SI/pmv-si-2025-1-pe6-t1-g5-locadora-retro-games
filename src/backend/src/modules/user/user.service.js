import prisma from "./infra/prisma/prisma.js";

const ExampleService = {};

ExampleService.list = async () => {
    const result = await prisma.user.findMany();
    return result;
};

ExampleService.create = async (body) => {
    await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          age: req.body.age,
        },
      });
};

export default ExampleService;