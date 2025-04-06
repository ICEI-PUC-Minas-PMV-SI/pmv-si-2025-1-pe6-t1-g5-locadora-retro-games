import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create Status Reserves
  await prisma.statusReserve.createMany({
    data: [
      { name: 'Reservado' },
      { name: 'Devolvido' },
      { name: 'Cancelado' },
      { name: 'Pendente' }
    ],
    skipDuplicates: true
  })

  await prisma.console.createMany({
    data: [
      { name: 'Playstation 2' },
    ],
    skipDuplicates: true
  })

  await prisma.game.createMany({
    data: [
      { name: "Devil May Cry 3: Dante's Awakening", consoleId: 1, price: 25 },
    ],
    skipDuplicates: true
  })

  // Create Roles
  await prisma.role.createMany({
    data: [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'User' }
    ],
    skipDuplicates: true
  })

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@nintendin.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@nintendin.com',
      password: hashedPassword,
      cpf: '22328703089', // fake cpf
      roleId: 1
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })