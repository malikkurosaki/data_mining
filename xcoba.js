const prisma = new (require('@prisma/client').PrismaClient)()

var hitung = 0;
async function main() {

    const listKeyword = await prisma.keyword.findMany({
        select: {
            id: true,
            name: true
        }
    })

    for (let itm of listKeyword) {
        itm['count'] = await prisma.googleNews.aggregate({
            _count: {
                _all: true
            },
            where: {
                keywordId: {
                    equals: itm.id
                }
            }
        })

        itm['count'] = itm._count._all
    }

    console.log(listKeyword)

}

main()