
let fs = require('fs').promises
let { Octokit } = require("@octokit/rest")
let interceptPage = require('./interceptPage')


let TOKEN = process.env.TOKEN
let REPOSITORY = process.env.REPOSITORY
let [OWNER, REPO] = REPOSITORY.split('/')

let octokit = new Octokit({
  auth: TOKEN
})

let date = +new Date()

async function main() {

  let { data } = await octokit.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'open'
  })

  let promises = data.map(async (issue) => {
    try {
      let title = await interceptPage(issue.body || issue.title)
      await pushFiles(date, title)
      await octokit.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: issue.number,
        body: `已保存于：https://github.com/${OWNER}/${REPO}/tree/master/${date}`
      })
      await octokit.issues.update({
        owner: OWNER,
        repo: REPO,
        issue_number: issue.number,
        state: 'closed',
        title: title
      })
    } catch (error) {
      await octokit.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: issue.number,
        body: `错误 ${error.toString()}`
      })
      await octokit.issues.update({
        owner: OWNER,
        repo: REPO,
        issue_number: issue.number,
        state: 'closed',
        labels: 'invalid',
        title: '错误'
      })
      throw error
    }
  })

  await Promise.all(promises)
}

async function pushFiles(date, title) {
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: `${date}/${title.replace(/\//g, '-')}.jpg`,
    message: 'submit new article',
    content: await fs.readFile(`${title}.jpg`, { encoding: 'base64' }),
    committer: {
      name: process.env.NAME || 'none',
      email: process.env.EMAIL || 'none@none.com'
    },
    author: {
      name: process.env.NAME || 'none',
      email: process.env.EMAIL || 'none@none.com'
    }
  })
}

main()