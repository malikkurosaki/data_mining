const prisma = new (require("@prisma/client").PrismaClient)();

async function main() {
  const dataSource = require("../property/keyword.json");

  for (let itm of dataSource) {
    const data = await prisma.keyword.upsert({
      where: {
        name: itm.name,
      },
      create: {
        name: itm.name,
        profileId: itm.profileId,
        idx: dataSource.indexOf(itm) + 1,
      },
      update: {
        name: itm.name,
        profileId: itm.profileId,
      },
    });

    console.log(data.name);
  }
}

main();
