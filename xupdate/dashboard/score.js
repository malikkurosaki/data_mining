const prisma = new (require('@prisma/client').PrismaClient)()
const config = require('../../config.json')
const axios = require('axios');
const colors = require('colors');
const path = require('path');
const _ = require('lodash');

async function main() {
    let data = await prisma.keyword.findMany({
        include: {
            _count: {
                select: {
                    YoutubeContent: true,
                    FacebookLike: true,
                    GoogleNews: true,
                    TwitterLates: true
                }
            }
        }
    })

    // me sum semua score
    let hasil = data.map(e => {
        return {
            id: e.id,
            idx: e.idx,
            name: e.name,
            score: e._count.FacebookLike + e._count.GoogleNews + e._count.TwitterLates + e._count.FacebookLike
        }
    })

    let total = _.sumBy(hasil, (e) => e.score);
    
    let result2 = hasil.map(e => ({
        id: e.id,
        idx: e.idx,
        name: e.name,
        score: Number(((e.score/total) * 100).toFixed())
    }))

    try {
        // await axios(config.host + "/api/socket")
        let kirim = await axios(config.target_host_update, { method: "POST", data: result2 })
        console.log(kirim.data.green)

    } catch (error) {
        console.log("server tujuan error: 500".red)
        console.log(__filename)
    }

}

main()