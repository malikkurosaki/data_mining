const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');


var index = 1;
var jalan = true;
async function main() {
    while (index < 15) {
        
        console.log(`index page ke ${index}`.green)
        let hasil = await scrap(index)

        console.log(hasil.length)

        index++;
        await main();

    }
}


async function scrap(index) {
    const url = "https://www.cnnindonesia.com/indeks/2/"+ index
    const data = await axios.get(url, { headers: { 'User-Agent': 'Axios 0.21.1' } });
    const $ = cheerio.load(data.data);
    const listTitle = $('article').children()

    let hasil = [];
    for (let itm of listTitle) {
        let time = $(itm).find('span .date').text();

        let body = {
            "source": "cnn indonesia",
            "title": $(itm).find('h2').html(),
            "link": $(itm).attr("href"),
            "date": moment().format("yyyy-MM-DD'T'HH:mm:ss Z"),
            "url": url,
            "content": "",
            "category": "news"
        }

        let toDetail = await axios.get(body.link);
        let d = cheerio.load(toDetail.data);
        body.content = d('#detikdetailtext').find('p').text();

        console.log(body.content);

        if(time){
            hasil.push(body)
        }
    }

    return hasil

}



module.exports = async function () {
   await main()
}