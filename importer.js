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
const options = require('./config.json');
const coockies = require('./cookies.json');

module.exports = {
    ppt,
    // puppeteer,
    cheerio,
    axios,
    colors,
    fs,
    path,
    options,
    coockies,
    puppeterLoader: async function () {

        const browser = await puppeteer.launch({...options.puppeterOptions });
        const [p] = await browser.pages();

        /**@type {ppt.Page} */
        const page = p;
        await page.setCookie(...coockies)
        await page.emulate(ppt.KnownDevices['Nokia N9']);
        await page.setViewport({
            width: options.wid,
            height: options.hig,
            deviceScaleFactor: 1,
        });
        return {
            browser,
            page,
        }
    }
}