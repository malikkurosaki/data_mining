// const { puppeterLoader, cheerio, colors } = require('../importer')
// const prisma = new (require('@prisma/client').PrismaClient)();
// const { speed, pageCount } = require('../config.json')
// const puppeteer = require('puppeteer')
// /**@type {puppeteer.Page} */
// var page;


// async function main() {
//     let contentBody = {}
//     if (page === undefined) {
//         const { page: pg } = await puppeterLoader();
//         page = pg;
//     }
//     await page.goto(`https://m.facebook.com/search/posts/?q=prabowo`, { waitUntil: "networkidle2", timeout: 0 });




//     let $ = cheerio.load(await page.content())
//     let satu = $('#BrowseResultsContainer > div > div > div > div > div >').children()

//     for (let s of satu) {
//         let con = $(s);
//         let komentar = con.find('div').children('a')
//         let content = con.find('p').text()
//         for(let kom of komentar){
//             if($(kom).text().includes("Komentar")){
//                 let linkNya = $(kom).attr('href');
//                 console.log(linkNya)
//                 console.log("--------------------------------")
//                 await page.goto(`https://mbasic.facebook.com${linkNya}`);

//                 // #ufi_pfbid02RTTcYcpbeCo15DAuvNFhXgBvRDbC4hBSePqAmK3zintPnq4Jbmde86ThzPEBZYKil > div > div.eg.cj
//                 // #\35 25271149082544 > div > h3 > a


//                 return;

//             }
//         }
//     }
// }

// main();

const ppt = require('puppeteer');
/**@type {ppt} */
const puppeteer = require('puppeteer-extra')
const cheerio = require('cheerio');
const axios = require('axios');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteer.use(pluginStealth());
const config = require('../config.json');
const coockies = require('../cookies.json');

async function main() {
    const browser = await puppeteer.launch(config.puppeterOptions);
    const [page] = await browser.pages();
    await page.setCookie(...coockies)
    // await page.emulate(ppt.KnownDevices['Nokia N9']);
    await page.setViewport({
        width: config.wid,
        height: config.hig,
        deviceScaleFactor: 1,
    });

    await page.goto(`https://m.facebook.com/PrabowoSubianto/photos?psm=default&album=pb.100044501016660`, { waitUntil: "networkidle2", timeout: 0 });
    // await cobaScroll(page)

    console.log("coba ambil content")
    let $ = cheerio.load(await page.content());
    let target = $('#rootcontainer > div > div > span').children('a')
    console.log("didapatkan ", target.length, " konten")
    for (let itm of target) {
        let link = $(itm).attr('href')

        console.log(`menuju ke target content`)
        await page.goto(`https://mbasic.facebook.com${link}`)

        console.log("coba ambil komentar")
        await komentarHunter(page)
    }

    // #rootcontainer

}

async function komentarHunter(page) {
    console.log("ambil source komentar")
    let d = cheerio.load(await page.content())
    let targetContainer = d('#ufi_668249204668441 > div > div:nth-child(4)').children()
    console.log("didapatkan sebanyak "+ targetContainer.length)
    for (let elmKom of targetContainer) {
        let isinya = d(elmKom).text()

        if (!isinya.includes('Lihat komentar lainnya…')) {
            let targetProfile = d(elmKom).find('h3').find('a').attr('href')

            console.log("melihat profile")
            await page.goto("https://mbasic.facebook.com" + targetProfile, { waitUntil: "networkidle2", timeout: 0 })
            let e = cheerio.load(await page.content());
            let targetAsal = e('#living > div > div ').children()
            if (targetAsal) {
                for (let asl of targetAsal) {
                    let kota = e(asl).text();
                    if (kota.includes('Kota asal')) {
                        let hasil = e(asl).find('table > tbody > tr > td:nth-child(2)').text()
                        console.log(hasil)
                    }else{
                        console.log("kota asal tidak ditemukan")
                    }
                }
            }else{
                console.log("gak ada kota asal")
            }
            // #u_0_1_Pw > div > table
        } else {
            let selanjutnya = d(elmKom).find('a').attr('href')
            if (selanjutnya) {
                await page.goto(`https://mbasic.facebook.com${selanjutnya}`)
                await komentarHunter(page);
            }else{
                console.log("gak ada selanjutnya")
            }
        }

        // let targetProfile  = d(elmKom).find('h3').find('a').attr('href')
        // if(targetProfile){
        //     await page.goto(targetProfile, { waitUntil: "networkidle2", timeout: 0 })
        //     return;
        // }

    }
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

main();
