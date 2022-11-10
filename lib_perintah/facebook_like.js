const ppt = require("puppeteer");
/**@type {ppt} */
const puppeteer = require("puppeteer-extra");
const cheerio = require("cheerio");
const axios = require("axios");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());
const config = require("../config.json");
const coockies = require("../cookies.json");
const { Prisma } = require("@prisma/client");
const { execSync } = require("child_process");
const prisma = new (require("@prisma/client").PrismaClient)();

/**@type {ppt.Browser} **/
var browser;
/**@type {ppt.Page} **/
var page;

const MODEL_KEYWORD = Prisma.KeywordScalarFieldEnum;
const MODEL_FACEBOOK_LIKE = Prisma.FacebookLikeScalarFieldEnum;

/**@param {MODEL_KEYWORD} keyword */
async function main(keyword) {
  /**@type {MODEL_FACEBOOK_LIKE} */
  let body = {};

  if (!page) {
    // init
    const br = await puppeteer.launch({...config.puppeterOptions });
    const pg = await br.pages();
    browser = br;
    page = pg[0];
  }

  await page.setCookie(...coockies);
  // await page.emulate(ppt.KnownDevices['Nokia N9']);
  await page.setViewport({
    width: config.wid,
    height: config.hig,
    deviceScaleFactor: 1,
  });

  console.log("go to photos profile");
  await page.goto(`https://m.facebook.com/${keyword.profileId}/photos`, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  console.log("mendapatkan kontent album")
  let cher = cheerio.load(await page.content());
  let photosAlbumLink = cher(
    "#root > div > div > div > div:nth-child(1) > a"
  ).attr("href");

  if (photosAlbumLink) {
    console.log("go to album link");
    await page.goto("https://m.facebook.com" + photosAlbumLink, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

  } else {
    console.log("cek koneksi".red);
    return;
  }

  console.log("coba scroll ...".yellow);
  await cobaScroll(page);
  console.log("coba ambil content");
  let $ = cheerio.load(await page.content());
  let target = $("#rootcontainer > div > div > span").children("a");
  console.log("didapatkan ", target.length, " konten");

  if (target.length > 0) {
    for (let itm of target) {
      let link = $(itm).attr("href");

      // mencari content id untuk dijadikan id di database
      let contentId = new URL(`https://m.facebook.com${link}`).searchParams.get(
        "fbid"
      );

      console.log(`menuju ke target content`);
      // content url
      console.log(contentId.blue);

      body.id = contentId;
      body.contentUrl = link;

      await page.goto(`https://mbasic.facebook.com${link}`);
      let $$ = cheerio.load(await page.content());
      let olah1 = $$("#add_comment_switcher_placeholder")
        .next()
        .find("a")
        .attr("href");
      if (olah1) {
        await page.goto("https://m.facebook.com" + olah1, {
          waitUntil: "networkidle2",
          timeout: 0,
        });

        await clickSelengkapnya(page);

        console.log("akhir selengkapnya");
        // #reaction_profile_browser
        let $$$ = cheerio.load(await page.content());
        let olah2 = $$$("#reaction_profile_browser").children();
        console.log("mendapatkan sebanyak " + olah2.length + "suka");
        for (let itm1 of olah2) {
          let dataProfileLikeHref = $$$(itm1)
            .find("div > div > div > a")
            .attr("href");
          let dataProfileName = $$$(itm1)
            .find("div > div > div > a > div > span > span")
            .text();

          //   console.log(dataProfileName.yellow);
          //   console.log(dataProfileLikeHref);

          await page.goto("https://mbasic.facebook.com" + dataProfileLikeHref, {
            waitUntil: "networkidle2",
            timeout: 0,
          });

          let $$$$ = cheerio.load(await page.content());
          let kotaSaatIni = $$$$(
            "#living > div > div >  div:nth-child(1) > div > table > tbody > tr > td:nth-child(2)"
          ).text();

          let kotaAsal = $$$$(
            "#living > div > div >  div:nth-child(2) > div > table > tbody > tr > td:nth-child(2)"
          ).text();

          body.kotaSaatIni = kotaSaatIni ?? "";
          body.kotaAsal = kotaAsal ?? "";
          body.name = dataProfileName;
          body.profileUrl = dataProfileLikeHref;
          body.keywordId = keyword.id;

          console.log("------------------------------------------------------");
          console.log(body.name);
          console.log("kota Saat Ini: ".green, body.kotaSaatIni);
          console.log("kota asal: ".green, body.kotaSaatIni);
          console.log("Keyword: " + keyword.name);
          console.log("content id: " + body.id)
          console.log(
            "----------------------------------------------------------------"
          );

          console.log("coba menyimpan ...".cyan);
          await prisma.facebookLike.upsert({
            where: {
              id_name: {
                id: body.id,
                name: body.name,
              },
            },
            create: body,
            update: body,
          });

          console.log("menyimpan success!".green);



          // tunngu sedetik
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        }
      }
    }
  } else {
    console.log("target kosong ".bgRed);
  }

  // #rootcontainer
}

/**@param {ppt.Page} page */
async function clickSelengkapnya(page) {
  await tunggu(2000);
  let selengkapnya = await page.$("#reaction_profile_pager");

  try {
    await selengkapnya.click();
    console.log("click selengkapnya");

    await clickSelengkapnya(page);
  } catch (error) {
    console.log("tidak terdapat tombol selengkapnya > lanjut ".red);
  }
}

/**@param {ppt.Page} page */
async function cobaScroll(page) {
  for (let i in [...new Array(5)]) {
    console.log("scrolling...");
    await page.evaluate(() => {
      window.scrollTo(0, window.document.body.scrollHeight);
    });
    await tunggu(1000);
  }
}

async function run() {
  const keyword = await prisma.keyword.findMany({
    orderBy: {
      idx: "asc",
    },
  });

  for (let itm of keyword) {
    console.log("search to : " + itm.name.toString().bgGreen);
    await main(itm);
    // update ke server
    console.log("update date ke server ...".bgYellow)
    execSync('node score.js', { stdio: "inherit", cwd: "../xupdate/dashboard" })

  }
  await run();


  // mengupdate ke server
  console.log("update date ke server ...".bgYellow)
  execSync('node score.js', { stdio: "inherit", cwd: "../xupdate/dashboard" })
}

/**@param {number} berapa */
async function tunggu(berapa) {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, berapa);
  });
}

run();
