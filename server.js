const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const dir = './api_controller';
const apiDir = fs.readdirSync(path.join(__dirname, dir));

for (let subDir of apiDir) {
    let targetDir = fs.readdirSync(path.join(__dirname, dir, subDir));
    for (let targetFile of targetDir) {
        const name = path.parse(targetFile).name
        const method = name.split('_')[0]
        const target = path.join(__dirname, dir, subDir, targetFile);
        app[method](`/api/${_.kebabCase(name)}`, require(target));
    }
}

app.listen(PORT, () => console.log('listening on port '.green + PORT));