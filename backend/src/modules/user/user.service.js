import prisma from "../../infra/prisma/prisma.js";
import bcrypt from "bcrypt";

const UserService = {};

UserService.findByEmailAndPassword = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
};

UserService.list = async (limit, offset, field, order, search) => {
  const query = {
    take: limit,
    skip: offset,
    omit: { password: true },
    orderBy:
      field === "roleLabel" ? { role: { name: order } } : { [field]: order },
    where: {
      OR: [
        { name: { contains: search || "", mode: "insensitive" } },
        {
          email: { contains: search || "", mode: "insensitive" },
        },
      ],
    },
  };

  const [users, total, userWithMoreOrders] = await Promise.all([
    prisma.user.findMany(query),
    prisma.user.count(),
    prisma.user.findFirst({
      include: {
        _count: {
          select: { reserves: true },
        },
      },
      orderBy: {
        reserves: {
          _count: "desc",
        },
      },
    }),
  ]);

  return { users, total, userWithMoreOrders };
};

UserService.getUserById = async (userId) => {
  const result = await prisma.user.findUnique({
    where: { id: Number(userId) },
    omit: { password: true },
  });
  return result;
};

UserService.create = async (body, reqUserRoleId) => {
  if (reqUserRoleId !== 1 && body.roleId == 1) {
    throw new Error('Cannot create an admin user without being admin' );
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(body.password, salt);
  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hash,
      cpf: body.cpf,
      roleId: body.roleId ?? 2,
    },
  });
};

UserService.update = async (body, reqUserRoleId) => {
  if (reqUserRoleId !== 1 && body.roleId == 1) {
    throw new Error({ message: 'Cannot update an user to admin without being admin' });
  }
  const data = {
    name: body.name,
    email: body.email,
    cpf: body.cpf,
    roleId: body.roleId,
  };
  if (body.password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.password, salt);
    data.password = hash;
  }
  await prisma.user.update({
    where: { id: body.id },
    data,
  });
};

UserService.delete = async (body) => {
  await prisma.user.delete({
    where: { id: body.id },
  });
};

export default UserService;
