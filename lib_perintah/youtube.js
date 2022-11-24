const score_update = require('../xupdate/dashboard/score_update');
const puppeteer = require('puppeteer')
const { puppeterLoader, cheerio } = require('./../importer');
const showImg = require('../func/img');

let listHasil = []
let countIndex = 100;
let idx = 0;

const prisma = new (require('@prisma/client').PrismaClient)();
/**@type {puppeteer.Page} */
var page;

async function main(keyword) {
    if (page === undefined) {
        const { page: pg } = await puppeterLoader();
        page = pg;
    }

    await page.goto(`https://m.youtube.com/results?search_query=${keyword.name}`, { waitUntil: "networkidle2", timeout: 0 })

    await imageConsole()




    // //*[@id="app"]/div[1]/ytm-search/ytm-section-list-renderer/lazy-list/ytm-item-section-renderer/lazy-list/ytm-compact-video-renderer
    let content = await page.$x('//*[@id="app"]/div[1]/ytm-search/ytm-section-list-renderer/lazy-list/ytm-item-section-renderer/lazy-list/ytm-compact-video-renderer');

    for (let el of content) {
        let con = await page.evaluate((e) => {
            return e.innerHTML;
        }, el)

        let $ = cheerio.load(con);

        let title = $(`div > div > a`).find('h4').text()
        let source = $(`div > div > a > div > div.compact-media-item-byline.small-text`).text()
        let views = $(`div > div > a > div > div:nth-child(2)`).text()
        let date = $(`div > div > a > div > div:nth-child(3)`).text()
        let link = $(`div > a`).attr('href');
        let img = `https://i.ytimg.com/vi/${link.split('=')[1]}/mqdefault.jpg`
        let keywordId = keyword.id

        let body = {
            img,
            title,
            source,
            views,
            date,
            link,
            keywordId
        }

        // console.log(body)
        // listHasil.push(body);

        let data = await prisma.youtubeContent.findUnique({
            where: {
                title: body.title
            }
        })

        if (!data) {
            let simpan = await prisma.youtubeContent.create({
                data: body
            })

            let berhasilTitle = await new Promise((resolve, reject) => {
                setTimeout(async () => {

                    resolve(simpan.title)
                }, 1000)
            })

            console.log("simpan data ke server ".green + berhasilTitle)
        }

    }

    // let listResult = []
    // for (let itm of listHasil) {
    //     let data = await prisma.youtubeContent.findUnique({
    //         where: {
    //             title: itm.title
    //         }
    //     })

    //     if (!data) {
    //         let simpan = await prisma.youtubeContent.create({
    //             data: itm
    //         })

    //         listResult.push(simpan)

    //         await new Promise((resolve, reject) => {
    //             setTimeout(async () => {

    //                 resolve()
    //             }, 1000)
    //         })

    //         console.log("simpan data ke server")
    //     }


    // }

    // console.log(`${listResult.length} berhasil disimpan`.green)

}


async function cobaScroll(page) {
    for (let i in [...new Array(5)]) {
        console.log("scrolling...");
        await page.evaluate(() => {
            window.scrollTo(0, window.document.body.scrollHeight);
        });
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
}


async function run() {

    const keyword = await prisma.keyword.findMany({
        orderBy: {
            idx: "asc"
        }
    });

    for (let itm of keyword) {
        console.log("search for " + itm.name.toString().bgRed)
        await main(itm);
        await prisma.collectCount.create({
            data: {
                keywordId: itm.id
            }
        })
    }
    await run();
    await score_update();
}

async function imageConsole() {
    await page.screenshot({
        path: "../public/img/youtube.png",
        captureBeyondViewport: true
    })
    showImg("../public/img/youtube.png")
}

run();

