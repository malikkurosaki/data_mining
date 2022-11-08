const execSync = require('child_process').execSync
const branchName = require('branch-name')
require('colors')

async function main() {
    let name = await branchName.get()
    execSync(`git add . && git commit -m '${Math.random()}' && git push origin ${name}`, { stdio: "inherit" })
    console.log("Completed".green)
}

main()