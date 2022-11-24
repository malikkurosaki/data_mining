const term = require('terimg');

function showImg(path) {
    term(path, {pixel: "'.", height: 40}).then(console.log)
}

module.exports = showImg