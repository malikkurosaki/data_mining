const { Prisma } = require("@prisma/client");
const { puppeterLoader, cheerio, fs } = require("./../importer");
const puppeteer = require("puppeteer");
const { execSync } = require('child_process');
const score_update = require("../xupdate/dashboard/score_update");
let listHasil = [];
let countIndex = 100;
let idx = 0;
const prisma = new (require("@prisma/client").PrismaClient)();
/**@type {puppeteer.Page} */
var page;

const MODEL_KEYWORD = Prisma.KeywordScalarFieldEnum;
const MODEL_TWEETER_LATES = Prisma.TwitterLatesScalarFieldEnum;

/**@param {MODEL_KEYWORD} keyword*/
async function main(keyword) {
    // deklarasi
    /**@type {MODEL_TWEETER_LATES} */
    let body = {};

    /**@type {MODEL_TWEETER_LATES[]} */
    let listHasil = [];

    if (page === undefined) {
        const { page: pg } = await puppeterLoader();
        page = pg;
    }

    console.log("membuka target")
    await page.goto(`https://twitter.com/search?q=${keyword.name
        }&src=typeahead_click&f=live`, {
        waitUntil: "networkidle2",
        timeout: 0
    });

    console.log("menyimpan image")
    await page.screenshot({
        path: "../public/img/twitter.png",
        fullPage: true
        
    })

    // gak dipake dulu karena gak mempan dapetnya segitue aja
    // await cobaScroll(page);
    console.log("load data content")
    let $ = cheerio.load(await page.content());
    let listContent = $("main > div > div > div > div > div > div:nth-child(3) > div > section > div > div").children();
    console.log("mendapatkan konten sebanyak : " + listContent.length)

    console.log("mengurai kontent")
    for (let itm of listContent) {
        let item = $(itm).find("article > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div > div > div > div").find("a");

        // isian db
        console.log("mengambil alamat url user")
        let userUrl = item.attr("href");

        if (!userUrl) continue

        body.userUrl = userUrl;

        // isian db
        console.log("mengambil nama user")
        let userName = item.text();
        body.userName = userName;

        // console.log("User URL: " + userUrl);
        // console.log("user name: " + userName);

        // article/div/div/div/div[2]/div[2]/div[2]/div[1]/div
        console.log("mengambil content user")
        let itemContent = $("article > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)").find("span");
        // console.log(itemContent.text())
        // console.log("--------------------------------")

        // isian db
        let contennya = itemContent.text();
        body.content = contennya.trim();
        body.contentId = contennya.trim().substring(0, 50)
        body.keywordId = keyword.id

        console.log('menuju target user')
        await page.goto(`https://mobile.twitter.com${userUrl}`, {
            waitUntil: "networkidle2",
            timeout: 0
        });

        const $$ = cheerio.load(await page.content());

        // isian db
        console.log("mengambil lokasi")
        const lokasi = $$('span[data-testid="UserLocation"]');
        body.location = lokasi.text();
        if (body.location == "") {
            delete body.location
        }

        console.log("userName : ".green + body.userName)
        console.log("location: ".green + lokasi.text())
        console.log("content : ".green + body.content.substring(0, 100))
        console.log("--------------------------------")

        console.log("coba menyimpan ...".yellow)
        await prisma.twitterLates.upsert({
            where: {
                userName_contentId: {
                    contentId: body.contentId,
                    userName: body.userName
                }
            },
            create: body,
            update: body
        })
        console.log("menyimpan success!".green);
        console.log("total : " + await prisma.twitterLates.count())

    }


    // console.log("coba menyimpan ....".yellow)
    // for (let itm of listHasil) {
    //     try {
    //         await prisma.twitterLates.create({
    //           data: {

    //           }
    //         })
    //     } catch (error) {
    //       console.log(error)
    //     }

    //     return
    // }
    // console.log("menyimpan berhasil!".green)

    // #react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(3) > div > section > div
}

// /**@param {puppeteer.Page} page*/
// async function cobaScroll(page) {
//     for (let i in [...new Array(10)]) {
//         console.log("scrolling...");
//         await page.evaluate(() => {
//             window.scrollTo(0, window.document.body.scrollHeight);
//         });
//         await new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 resolve();
//             }, 1000);
//         });
//     }
// }

async function run() {
    const keyword = await prisma.keyword.findMany({
        orderBy: {
            idx: "asc"
        }
    });
    for (let itm of keyword) {
        console.log("search for " + itm.name.toString().bgRed);
        await main(itm);

        // await prisma.collectCount.create({
        //     data: {
        //         keywordId: itm.id
        //     }
        // });

        // mengupdate ke server

    }

    await run();
    await score_update()
    // console.log("update date ke server ...".bgYellow)
    // execSync('node score.js', { stdio: "inherit", cwd: "../xupdate/dashboard" })
}

run();
