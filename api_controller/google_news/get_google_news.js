const handler = require('express-async-handler');
const prisma = new (require('@prisma/client').PrismaClient)()


module.exports = handler(async (req, res) => {
    const data = await prisma.googleNews.findMany();
    res.status(200).json(data);
});