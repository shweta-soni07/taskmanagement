// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const alicePassword = await bcrypt.hash('password123', 10);
  const bobPassword = await bcrypt.hash('secret456', 10);

  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: alicePassword,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: bobPassword,
    },
  });

  // Create categories for Alice
  const workCat = await prisma.category.create({
    data: {
      name: 'Work',
      userId: alice.id,
    },
  });

  const personalCat = await prisma.category.create({
    data: {
      name: 'Personal',
      userId: alice.id,
    },
  });

  // Create tasks for Alice
  await prisma.task.create({
    data: {
      title: 'Finish README',
      description: 'Write README for Task API',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: alice.id,
      categoryId: workCat.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement authentication',
      description: 'Set up JWT authentication',
      status: 'TODO',
      userId: alice.id,
      categoryId: personalCat.id,
    },
  });

  // Create a task for Bob
  await prisma.task.create({
    data: {
      title: 'Plan sprint',
      description: 'Prepare sprint backlog',
      status: 'TODO',
      userId: bob.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Update project documentation',
      description: 'Revise and update the project docs',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      userId: alice.id,
      categoryId: workCat.id,
    },
  });

  console.log('Seeding complete with users, categories, tasks');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
