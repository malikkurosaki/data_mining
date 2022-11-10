const prisma = new (require('@prisma/client').PrismaClient)()
const moment = require('moment');
const puppeteer = require('puppeteer');
const { axios } = require('./importer');
async function main() {
    // let data = await prisma.youtubeContent.groupBy({
    //     by: ["keywordId"],
    //     _count: {
    //         _all: true,
    //     },
    //     orderBy: {
    //         _count: {
    //             source: "desc"
    //         }
    //     },
    //     where: {
    //         createdAt: {
    //             gte: new Date(moment("2021-11-06").format('YYYY-MM-DD')),
    //         }
    //     }
    // })


    // console.log(data)

    // let data = await prisma.youtubeContent.findMany({
    //     where: {
    //         Keyword: {
    //             name: "Prabowo Subianto"
    //         }
    //     },
    //     select: {
    //         title: true
    //     }
    // })

    // console.log(data.length)

   const ax = await axios('http://localhost:3000/api/dashboard/dashboard-test-socket');
   console.log(ax.data)

   
 }

main();