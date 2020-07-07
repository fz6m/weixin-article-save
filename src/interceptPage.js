let puppeteer = require('puppeteer-core')


module.exports = async function interceptPage(url) {

  let browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  let page = await browser.newPage()

  await page.setViewport({
    width: 414,
    height: 736,
    deviceScaleFactor: 3
  })

  await page.goto(url, {
    waitUntil: ['domcontentloaded', 'networkidle0']
  })

  await page.evaluate(() => {
    let promises = Array.from(document.querySelectorAll('.img_loading')).map(img => {
      let timeout = new Promise(resolve => {
        setTimeout(resolve, 9000)
      })
      let load = new Promise(resolve => {
        if (img.src == img.dataset.src) {
          resolve()
        } else {
          img.src = img.dataset.src
          img.classList.remove('img_loading')
          img.addEventListener('load', resolve)
        }
      })
      return Promise.race([timeout, load])
    })
    return Promise.all(promises)
  })

  await page.waitFor(1000)

  let title = await page.evaluate(() => document.querySelector('meta[property="og:title"]').content)

  await page.screenshot({
    path: `${title}.jpg`,
    fullPage: true,
    type: 'jpeg',
    quality: 100
  })

  await browser.close()

  return title
}