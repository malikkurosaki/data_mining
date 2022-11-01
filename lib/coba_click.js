const puppeteer = require('/usr/local/lib/node_modules/puppeteer')
const cheerio = require('cheerio');
const axios = require('axios');
require('colors');

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: [
            '--window-size=375,720',
            // '--lang=id-ID,id'
        ]
    })

    const [page] = await browser.pages();
    await page.emulate(puppeteer.KnownDevices['Galaxy S5']);

    await page.goto('https://www.google.com/search?q=prabowo&tbm=nws&start=10', { waitUntil: "networkidle2" })



    let $ = cheerio.load(await page.content());
    let listHasil = [];
    for (let i = 0; i < 5; i++) {
        for (let idx = 1; idx <= 9; idx++) {

            let title = $(`#rso > div > div > div:nth-child(${idx}) > g-card > div > div > a > div > div > div`).text();
            let link = $(`#rso > div > div > div:nth-child(${idx}) > g-card > div > div > a`).attr('href');
            // await new Promise((resolve, reject) => {
            //     setTimeout(async () => {
            //         console.log(title.yellow);
            //         // console.log(link);
            //         resolve(title);
            //     }, 500)
            // })
            console.log(title.yellow);

            let body = {
                "source": "google.com",
                "title": title,
                "link": link,
                "content": "",
                "category": "news"
            }

            const getContent = await axios.get(link);
            const d = cheerio.load(getContent.data);
            body.content = d('p').text();

            console.log(body.content);
        }

        // //*[@id="wepR4d"]/div/span/a[3]
        let $$ = cheerio.load(await page.content());
        let selanjutnya = $$('#wepR4d > div > span').children('a').last().attr('href');
        console.log(selanjutnya);
        await page.goto(`https://google.com${selanjutnya}`)

    }

    console.log("SUCCESS ...!".green)
    await browser.close();

}


module.exports = async function () {
    main();
}