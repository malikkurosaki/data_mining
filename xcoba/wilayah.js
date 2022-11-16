const prisma = new (require('@prisma/client').PrismaClient)()
const Geo = require('node-geocoder')({ provider: "openstreetmap" })
const prompts = require('prompts');
const _ = require('lodash');
const converter = require('json-2-csv');
const fs = require('fs');

const listMenu = [listLokasi, groupLokasi, koordinat]

prompts({
    type: "autocomplete",
    name: "menu",
    message: "pilih aja menunya",
    choices: listMenu.map(e => ({
        title: e.name,
        value: e
    }))
}).then(({ menu }) => {
    if (!menu) return console.log("ok , bye ...")
    menu()
})


async function listLokasi() {
    const data = await prisma.twitterLates.findMany({
        where: {
            location: {
                not: null
            }
        },
        select: {
            location: true
        }
    })

    console.log(data)
}

async function groupLokasi() {
    const data = await prisma.twitterLates.groupBy({
        by: ['location'],
        where: {
            location: {
                not: null
            }
        }
    })

    data.forEach(d => d.train = "")

    converter.json2csv(data, (err, val) => {
        fs.writeFileSync('data_lokasi.csv', val, "utf-8")
    })

    console.log("completed")
}

async function koordinat() {
    const data = Geo.geocode('Rawa Belong', (err, [val]) => {

        console.log(val);
    })
}
