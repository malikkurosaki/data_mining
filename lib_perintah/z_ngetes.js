const {puppeterLoader, cheerio} = require('./../importer')
let listHasil = []
let countIndex = 100;
let idx = 0;
const prisma = new(require('@prisma/client').PrismaClient)();
const puppeteer = require('puppeteer');
const {Prisma} = require('@prisma/client');

/**@type {puppeteer.Page} */
var page;

const MODEL_KEYWORD = Prisma.KeywordScalarFieldEnum;

/**@param {MODEL_KEYWORD} keyword */
async function main(keyword) {
    if (page === undefined) {
        const {page: pg} = await puppeterLoader();
        page = pg;
    }

    await page.goto(`https://mobile.twitter.com/search?q=prabowo&src=typeahead_click&f=live`, {
        waitUntil: "networkidle2",
        timeout: 0
    });

    page.on("response", async (data) => {
        try {
            let apa = await data.json();
            console.log(JSON.stringify(apa, null, 2));
        } catch (error) {}
    })

}


async function cobaScroll(page) {
    for (let i in[...new Array(5)]) {
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


main();

async function run() {
    const keyword = await prisma.keyword.findMany({});
    for (let itm of keyword) {
        console.log("search for " + itm.name.toString().bgRed)
        await main(itm);
        await prisma.collectCount.create({
            data: {
                keywordId: itm.id
            }
        })
    }
    run();
}
