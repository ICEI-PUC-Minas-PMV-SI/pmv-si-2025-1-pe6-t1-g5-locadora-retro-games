import prisma from "../../infra/prisma/prisma.js";
import bcrypt from 'bcrypt'

const UserService = {};

UserService.findByEmailAndPassword = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
};

UserService.list = async (limit, offset) => {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      take: limit,
      skip: offset,
      omit: { password: true }
    }),
    prisma.user.count()
  ]);
  return { users, total };
};

UserService.getUserById = async (userId) => {
  const result = await prisma.user.findUnique({ where: { id: userId }, omit: { password: true }})
  return result;
};

UserService.create = async (body) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(body.password, salt);
  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hash,
      cpf: body.cpf,
    },
  });
};

UserService.update = async (body) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(body.password, salt);
  await prisma.user.update({
    where: { id: body.id },
    data: {
      name: body.name,
      email: body.email,
      password: hash,
      cpf: body.cpf,
    },
  });
};

UserService.delete = async (body) => {
  await prisma.user.delete({
    where: { id: body.id },
  });
};

export default UserService;
