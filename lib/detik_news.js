// module.exports = async function () {

// const fs = require('fs');
// const path = require('path');
// const kunci = fs.readFileSync(path.join(__dirname, '../src/kanta_kunci.txt')).toString().split('\n');


// const puppeteer = require('/usr/local/lib/node_modules/puppeteer');
// const cheerio = require('cheerio');
// const browser = await puppeteer.launch({
//     headless: false,
//     ignoreHTTPSErrors: true,
//     // defaultViewport: {
//     //     width: 375,
//     //     height: 720,
//     //     isMobile: true,
//     // },
//     args: [
//         '--window-size=375,720'
//     ]

// });
// const [page] = await browser.pages();
// await page.emulate(puppeteer.KnownDevices['Galaxy S5']);

// await page.goto('https://news.detik.com/indeks/12', { waitUntil: "networkidle2", timeout: 0 });
// let content = await page.$x('/html/body/div[6]/div[3]/div/article')

// for(let itm of content){
//     await itm.evaluate(async(e) => {
//         e.childNodes.forEach((e) => {
//             console.log(e.toString())
//         })
//     })
// }
// await browser.close();

// const axios = require('axios');
// const cheerio = require('cheerio');
// const data = await axios.get('https://news.detik.com/indeks/12',);
// const $ = cheerio.load(data.data);

// const lsTitle = $('article').find($('.media__title')).children();
// const lsLink = $('article').find($('.media__title')).children();
// const lsDate = $('article').find($('.media__date')).children();

// let hasil = [];
// for (let itm = 0; itm < lsTitle.length; itm++) {
//     let body = {
//         "title": $(lsTitle[itm]).text(),
//         "link": $(lsTitle[itm]).attr("href"),
//         "date": new Date(Number.parseInt($(lsDate[itm]).attr('d-time')) * 1000),
//     }

//     hasil.push(body);
// }

// console.log(hasil);


// }

const moment = require('moment');
require('colors')

var index = 1;
var jalan = true;

async function main() {
    while (jalan) {
        console.log(`index page ke ${index}`.green)
        let hasil = await scrap(index)

        for (let e of hasil) {
            let a = moment(moment().format('YYYY-MM-DD'));
            let b = moment(moment(e.date).format('YYYY-MM-DD'))
            let durasi = moment.duration(a.diff(b)).asDays();
            // console.log(durasi, "nya")
            if (durasi > 1) {
                jalan = false;
                return;
            }

        }

        index++;
        await main();

    }
}


async function scrap(index) {
    const axios = require('axios');
    const cheerio = require('cheerio');
    const url = 'https://news.detik.com/indeks/' + index

    console.log(`${moment().format('HH:mm:ss')} menuju ke target: ${url}`.yellow)
    const data = await axios.get(url);
    const $ = cheerio.load(data.data);

    console.log("mengambil title, link dan datetime".yellow)

    const lsTitle = $('article').find($('.media__title')).children();
    const lsLink = $('article').find($('.media__title')).children();
    const lsDate = $('article').find($('.media__date')).children();

    console.log(`${moment().format('HH:mm:ss')} memproses hasil`);
    let hasil = [];
    for (let itm = 0; itm < lsTitle.length; itm++) {
        let body = {
            "source": "detik news",
            "title": $(lsTitle[itm]).text(),
            "link": $(lsTitle[itm]).attr("href"),
            "date": new Date(Number.parseInt($(lsDate[itm]).attr('d-time')) * 1000),
            "url": url,
            "content": "",
            "category": "news"
        }
        console.log(`${moment().format('HH:mm:ss')} soure artikel ${body.source}`.yellow)
        console.log(`${moment().format('HH:mm:ss')} tanggal artikel ${body.date}`.grey)
        console.log(`${moment().format('HH:mm:ss')} data didapatkan dengan judul ${body.title}`.grey)
        

        console.log(`${moment().format('HH:mm:ss')} mengambil data detail content ${body.link}`.grey)
        let toDetail = await axios.get(body.link);
        let d = cheerio.load(toDetail.data);
        body.content = d('article').find('.detail__body-text').text();

        console.log(`${moment().format('HH:mm:ss')} detail content didapatkan , lanjut ke proses selanjutnya`)
        hasil.push(body);
    }

    // console.log(hasil);
    console.log(`${moment().format('HH:mm:ss')} hasil di compile sebanyak ${hasil.length}`.green)
    return hasil;
}

module.exports = async function () {
    await main();
}