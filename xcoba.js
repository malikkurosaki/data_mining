const prisma = new (require('@prisma/client').PrismaClient)()

async function main(){
   await prisma.twitterLates.create({
        data: {
            contentId: "satu",
            userName: "dua",
            userUrl: "tiga",
            content: "empat",
            location: "apa"

        }
   })
}

main();