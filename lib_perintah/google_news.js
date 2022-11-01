
const { puppeterLoader, cheerio, colors, puppeteer } = require('../importer')
const prisma = new (require('@prisma/client').PrismaClient)();
const { speed, pageCount } = require('../config.json')
/**@type {puppeteer.page} */
var page;

async function main(keyword) {
    if (page === undefined) {
        const { page: pg } = await puppeterLoader();
        page = pg;
    }

    // menuju target
    await page.goto(`https://www.google.com/search?q=${keyword.name}&source=lnms&tbm=nws`, { waitUntil: "networkidle2", timeout: 0 });
    // pengambilan data
    let listHasil = await ambilData(page, keyword);
    console.log("page number 1")
    let [a] = await page.$$eval('tbody>td>a', link => link.map(e => e.href));
    await page.goto(a)
    // let itm in [...new Array(pageCount)]
    for (let itm in [...new Array(pageCount)]) {
        let hasilData = await ambilData(page, keyword);
        listHasil = listHasil.concat(hasilData);
        await page.waitForSelector('tbody > tr > td:nth-child(4) > a', { waitUntil: "networkidle2", timeout: 0 })
        let selanjutnya = await page.$$eval('a', link => link.map(e => e.href));
        let pilih = selanjutnya.filter(e => e.includes('&start='))
        let targetPage = pilih[pilih.length - 1];

        console.log(targetPage.toString().cyan)
        console.log("page number: " + (Number(itm) + 2).toString())
        await page.goto(targetPage)

    }


    let listResult = []
    for (let itm of listHasil) {
        let data = await prisma.googleNews.findUnique({
            where: {
                title: itm.title
            }
        })

        if (!data) {
            let simpan = await prisma.googleNews.create({
                data: itm
            })

            listResult.push(simpan)
        }
    }

    console.log(`${listResult.length} berhasil disimpan`.green)
    // await browser.close();

}

async function ambilData(page, keyword) {
    var $ = cheerio.load(await page.content());
    let listHasil = [];
    for (let i = 1; i < 10; i++) {
        let source = $(`body > div:nth-child(3) > div:nth-child(${i}) > div > div > div > a > div:nth-child(1) > span > span`).text().trim();
        let title = $(`body > div:nth-child(3) > div:nth-child(${i}) > div > div > div > a > div:nth-child(1) > span`).text().trim()
        let des = $(`body > div:nth-child(3) > div:nth-child(${i}) > div > div > div > a > div > table`).text().trim()
        let img = $(`body > div:nth-child(3) > div:nth-child(${i}) > div > div > div > a`).find('img').attr('src')
        let link = $(`body > div:nth-child(3) > div:nth-child(${i}) > div > div > div > a`).attr('href')
        let waktu = "";
        let keywordId = keyword.id
        var body = {
            source,
            title,
            des,
            img,
            link,
            waktu,
            keywordId
        }

        let mnt = des.match(/\d mnt lalu/g)
        let jam = des.match(/\d jam lalu/g)
        let hari = des.match(/\d hari lalu/g)
        let minggu = des.match(/\d minggu lalu/g)
        let bulan = des.match(/\d bulan lalu/g)

        for (let wak of [mnt, jam, hari, minggu, bulan]) {
            if (wak) {
                body.waktu = wak[0]
            }
        }

        listHasil.push(body)
        console.log(body.source.yellow)
        console.log(body.title.grey)
        console.log(body.waktu)
        await new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, speed)
        })

    }

    return listHasil;
}

async function run() {
    const keyword = await prisma.keyword.findMany()
    for (let itm of keyword) {
        console.log("search to : " + itm.name.toString().bgRed)
        await main(itm);
        await prisma.collectCount.create({
            data: {
                keywordId: itm.id
            }
        })
    }
    await run()
}

run()


// setInterval(async () => {
//     await run()
//     let waktu = jeda * 1000

// }, jeda * 1000)




