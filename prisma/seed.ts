import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create 300 users
  for (let i = 0; i < 300; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        posts: {
          create: Array(2)
            .fill(null)
            .map(() => ({
              title: faker.lorem.sentence({ min: 3, max: 8 }),
              content: faker.lorem.paragraphs({ min: 2, max: 5 }),
              published: faker.datatype.boolean(),
              createdAt: faker.date.past({ years: 1 }),
              updatedAt: faker.date.recent({ days: 30 }),
            })),
        },
      },
    });
    console.log(`Created user ${i + 1}/300 with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
