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
const config = require('./config.json');
const coockies = require('./cookies.json');
const os = require('os');

console.log(os.type())

// "executablePath": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
module.exports = {
    ppt,
    // puppeteer,
    cheerio,
    axios,
    colors,
    fs,
    path,
    options: config,
    coockies,
    puppeterLoader: async function () {

        if (os.type() === 'Darwin') {
            config.puppeterOptions['executablePath'] = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        } else {
            // /usr/bin/google-chrome
            config.puppeterOptions['headless'] = true
            config.puppeterOptions['executablePath'] = "/usr/bin/google-chrome"
        }

        const browser = await puppeteer.launch({ ...config.puppeterOptions });
        const [p] = await browser.pages();

        /**@type {ppt.Page} */
        const page = p;
        await page.setCookie(...coockies)
        await page.emulate(ppt.KnownDevices['Nokia N9']);
        await page.setViewport({
            width: config.wid,
            height: config.hig,
            deviceScaleFactor: 1,
        });

        // await page.setUserAgent(
        //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
        // )
        
        return {
            browser,
            page,
        }
    }
}