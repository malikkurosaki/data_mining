// const ppt = require('puppeteer');
// const puppeteer = require('puppeteer-extra')
// const cheerio = require('cheerio');
// const axios = require('axios');
// const colors = require('colors');
// const fs = require('fs');
// const path = require('path');
// const pluginStealth = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(pluginStealth());
// const options = require('./../config.json');
// const coockies = require('./../cookies.json');

const { puppeterLoader, fs, path, colors, puppeteer } = require('../importer')

async function main() {

    const { browser, page } = await puppeterLoader();
    // /**@type {ppt.Browser} */
    // const browser = await puppeteer.launch(options.puppeterOptions);
    // const [p] = await browser.pages();

    // /**@type {ppt.Page} */
    // const page = p;
    // await page.setCookie(...coockies)
    // await page.emulate(ppt.KnownDevices['Nokia N9']);
    // await page.setViewport({
    //     width: 500,
    //     height: 720,
    //     deviceScaleFactor: 1,
    // });

    // page.on("framenavigated", async frame => {
    //     try {
    //         let perintah = new URL(frame.url()).searchParams.get('perintah');
    //         if (perintah == "simpan") {
    //             const cookies = await page.cookies();
    //             fs.writeFileSync(path.join(__dirname, './../cookies.json'), JSON.stringify(cookies));
    //             console.log('cookies saved '.green);
    //             await browser.close()
    //         }
    //     } catch (error) {
    //         console.log(`${error}`.red)
    //     }
    // });



    await page.goto(`https://www.google.com/search?q=prabowo&ei=CiNRY6G4HbqQ3LUPy629yAc&start=10&sa=N`, { waitUntil: "networkidle2", timeout: 0 })

    console.log("masukkan perintahnya".green)
    process.stdin.on("data", async (data) => {
        let perintah = `${data}`.trim();
        if (perintah == "simpan") {
            const cookies = await page.cookies();
            fs.writeFileSync(path.join(__dirname, './../cookies.json'), JSON.stringify(cookies));
            console.log('cookies saved '.green);
            await browser.close()
            process.exit(0);
        }
    })

}

main();



module.exports = async function () {
    main();

    console.log("masukkan perintahnya".green)
    process.stdin.on("data", async (data) => {
        let perintah = `${data}`.trim();
        if (perintah == "simpan") {
            const cookies = await pg.cookies();
            fs.writeFileSync(path.join(__dirname, './../cookies.json'), JSON.stringify(cookies));
            console.log('cookies saved '.green);
            await bs.close()
        }
    })
}