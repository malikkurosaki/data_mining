

let index = 1;
let jalan = true;
const moment = require('moment');
const puppeteer = require('/usr/local/lib/node_modules/puppeteer')

/**@type {puppeteer.Page} */
let page = (puppeteer.Page);

/**@type {puppeteer.Browser} */
let browser = (puppeteer.Browser)

async function main(text) {


    while (index < 3) {

        console.log(moment().format('HH:mm:ss'), " : page index " + index)

        try {
            let hasil = await scrap(text, index)

            // document.querySelector("#wepR4d > div > span > a.acRNod.IpLO9.IEQr4b")
            // //*[@id="wepR4d"]/div/span/a[3]
        } catch (error) {
            console.log(error)
        }


        index++;
        await main();

    }

    try {
        await browser.close()
    } catch (error) {
        console.log("error close browser");
    }
}

async function scrap(text, index) {

    const url = `https://www.google.com/search?q=${text}&tbm=nws&start=${index}0`;
    const cheerio = require('cheerio');
    const axios = require('axios');
    // const { data } = await axios.get(url);
    await page.goto(url, { waitUntil: "networkidle2" });

    console.log(moment().format('HH:mm:ss'), " : mulai mengambil data")

    // require('fs').writeFileSync('./data.html', await page.content())
    // console.log("data sisimpan");

    const $ = cheerio.load(await page.content());

    let listHasil = [];
    for (let idx = 1; idx < 10; idx++) {

        // document.querySelector("#rso > div > div > div:nth-child(1) > g-card > div > div > a > div > div > div")
        const title = $(`#rso > div > div > div:nth-child(${idx}) > g-card > div > div > a > div > div > div`);
        const link = $(`#rso > div > div > div:nth-child(${idx}) > g-card > div > div`).find('a');

        const body = {
            source: "google.com",
            title: title.text(),
            link: link.attr('href'),
            hostName: new URL(link.attr('href')).hostname,
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            category: "news",
            content: ""
        }

        if (link.attr('href')) {
            console.log(moment().format('HH:mm:ss'), " : ambil data dari", body.hostName)
            const getContent = await axios.get(body.link)
            // await page.goto(body.link, { waitUntil: "networkidle2" })
            const d = cheerio.load(getContent.data);
            body.content = d('p').text()
            listHasil.push(body);

        }
    }

    // console.log(listHasil)
    console.log(moment().format('HH:mm:ss'), " : compile data sebanyak ", listHasil.length)
    return listHasil

    // document.querySelector("#main > div:nth-child(5) > div")
    // document.querySelector("#main > div:nth-child(6) > div")
    // document.querySelector("#main > div:nth-child(14) > div")

    // document.querySelector("#main > div:nth-child(5) > div > a")
    // const container = $('#main div:nth-child(14)').find('h3');

    // console.log(container.html());

}


module.exports = async function (text) {
    if (!text || text == "") return console.log("masukan text")
    const bs = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        // defaultViewport: {
        //     width: 375,
        //     height: 720,
        //     isMobile: true,
        // },
        args: [
            '--window-size=375,720'
        ]
    })

    const [pg] = await bs.pages();
    page = pg;
    browser = bs;

    await page.emulate(puppeteer.KnownDevices['Galaxy S5']);

    // await scrap(text, index);

    main(text);
}