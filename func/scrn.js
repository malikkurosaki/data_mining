const path = require('path')
const scrn = {
    path: "",
    ytb() {
        this.path = path.join(__dirname, "../public/img/ytb.png")
        return this
    },
    fb() {
        this.path = path.join(__dirname, "../public/img/fb.png")
        return this
    },
    twt() {
        this.path = path.join(__dirname, "../public/img/twt.png")
        return this
    },
    ggl() {
        this.path = path.join(__dirname, "../public/img/ggl.png")
        return this
    },
    async shoot(page) {
        await page.screenshot({
            path: this.path,
            captureBeyondViewport: true
        })

        console.log("screenshot saved")
    }
}



module.exports = scrn