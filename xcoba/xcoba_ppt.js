const puppeter = require('puppeteer');

async function main() {
    const browser = await puppeter.launch({
        headless: false
    })

    const [page] = await browser.pages()
    await page.goto('https://google.com')
}

main()