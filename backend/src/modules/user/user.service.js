import prisma from "../../infra/prisma/prisma.js";

const ExampleService = {};
ExampleService.findByEmailAndPassword = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && user.password === password) {
    return user;
  }

  return null;
};
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
      cpf: body.cpf,
    },
  });
};

ExampleService.update = async (body) => {
  await prisma.user.update({
    where: { id: body.id },
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
      cpf: body.cpf,
    },
  });
};

ExampleService.delete = async (body) => {
  await prisma.user.delete({
    where: { id: body.id },
  });
};

export default ExampleService;
