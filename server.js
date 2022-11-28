const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const colors = require('colors');
const fs = require('fs');
const os = require('os');
const path = require('path');
const _ = require('lodash');
const Data = require('./data_static');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const exec = require('child_process').exec


app.get('/gambar/:nama', (req, res) => {
    if (fs.existsSync(path.join(__dirname, `/public/img/${req.params.nama}.png`))) {
        const gambar = fs.readFileSync(path.join(__dirname, `/public/img/${req.params.nama}.png`))
        res.type("image/png").status(200).send(gambar.toString("base64"))
    } else {
        const gambar = fs.readFileSync(path.join(__dirname, `/public/img/default.png`))
        res.type("image/png").status(200).send(gambar.toString("base64"))
    }
})

var log = "";
app.get('/api/terminal', async (req, res) => {
    const name = req.query.name
    // const kill = req.query.kill

    if (!name) res.status(400).send(400)
    let home = os.platform() == "darwin" ? `/Users/mac/.pm2/logs/${name}-out.log` : `/home/makuro/.pm2/logs/${name}-out.log`;
    let log = []
    let berapa = 20
    if (fs.existsSync(home)) {
        // exec(`pm2 flush ${name}`)
        let listLog = fs.readFileSync(home).toString().split('\n')
        if (listLog.length > berapa) {
            listLog.splice(0, (listLog.length - berapa) - 1)
        }
        log = [...listLog].join("<br \>")

    } 

    res.send(log)

    // if (Data.log[name] == undefined) {
    //     // exec('node xcoba.js').kill("SIGHUP");
    //     Data.log[name] = exec(`pm2 log xcoba > xlog_${name}`);
    //     // Data.log[name].stdout.on('data', (data) => {
    //     //     log += "belum, "
    //     //     log += data
    //     //     console.log("run success")
    //     // })

    //     return res.status(200).send("run log success");
    // } else {
    //     // console.log("ada")
    //     if (kill) {
    //         Data.log[name].kill("SIGHUP")
    //         Data.log[name] = undefined
    //         return res.status(200).send("kill success")
    //     }

    //     Data.log[name].kill("SIGHUP")
    //     Data.log[name] = exec(`pm2 log xcoba > xlog_${name}`);
    //     // Data.log[name].stdout.on('data', (data) => {
    //     //     log += "sudah, "
    //     //     log += data
    //     //     console.log("run success")
    //     // })

    //     return res.status(200).send("run log success");
    // }

})

// const dir = './api_controller';
// const apiDir = fs.readdirSync(path.join(__dirname, dir));

// for (let subDir of apiDir) {
//     let targetDir = fs.readdirSync(path.join(__dirname, dir, subDir));
//     for (let targetFile of targetDir) {
//         const name = path.parse(targetFile).name
//         const method = name.split('_')[0]
//         const target = path.join(__dirname, dir, subDir, targetFile);
//         app[method](`/api/${_.kebabCase(name)}`, require(target));
//     }
// }

app.listen(PORT, () => console.log('listening on port '.green + PORT));