const prisma = new (require('@prisma/client').PrismaClient)()
const nodeGeocoder = require('node-geocoder')

async function main() {
    const data = await prisma.facebookLike.groupBy({
        by: ['kotaAsal', 'kotaSaatIni'],
        where: {
            OR: {
                kotaAsal: {
                    not: ""
                },
                kotaSaatIni: {
                    not: ""
                }
            }
        }
    })

    const tw = await prisma.twitterLates.groupBy({
        by: ["location"]
    })

    const geoCoder = nodeGeocoder({provider: "openstreetmap"})

    geoCoder.geocode('denpasar', (e, data) => {
        console.log(data)
    }).catch(e => console.log(e))
}

main();