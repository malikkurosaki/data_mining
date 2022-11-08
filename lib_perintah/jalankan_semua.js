const { exec } = require('child_process');

function main() {
    console.log("jalankan facebook")
    exec('node ./facebook_like.js')

    console.log("jalankan google news")
    exec('node ./google_news.js')

    console.log('jalankan tweeter')
    exec('node ./tweeter.js')

    console.log("jalankan youtube")
    exec("node ./youtube.js")
}

main();