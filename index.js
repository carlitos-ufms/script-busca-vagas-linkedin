// https://github.com/puppeteer/puppeteer
const puppeteer = require('puppeteer')
// https://www.npmjs.com/package/puppeteer-autoscroll-down
// const { scrollPageToBottom } = require('puppeteer-autoscroll-down') 

async function robo() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  console.log('abrindo')
  const url = 'https://www.linkedin.com/jobs/search/?currentJobId=3232167573&geoId=92000000&keywords=devrel&location=Mundialmente&refresh=true'
  await page.goto(`${url}`)
  //await page.screenshot({path: 'example.png'});

  // Fechar pop-up que atrapalha o scroll
  const bt_close_popup = 'button.cta-modal__dismiss-btn'
  console.log(`${bt_close_popup}`)
  await page.waitForSelector(`${bt_close_popup}`, {visible:true})
  console.log('vai')
  await page.$eval( 'button.cta-modal__dismiss-btn', form => form.click() )

  const vagas = await page.evaluate(() => {
    const lis = Array.from(document.querySelectorAll('ul.jobs-search__results-list li'))
    return lis.map(li => {
      var title = li.querySelector('.base-search-card__info h3.base-search-card__title').innerHTML
      var link = li.querySelector('a.base-card__full-link').href
      
      return {
        title: title.replace(/<a [^>]+>[^<]*<\/a>/g, '').trim(),
        link: link
      }
    })
  })

  // const page2 = await browser.newPage();        // open new tab
  // await page2.goto('https://github.com');       // go to github.com 
  // await page2.bringToFront();                   // make the tab active

  async function acessarVaga() {
    for (const vaga of vagas) {
      const url_vaga = vaga.link
      console.log(`Abrir vaga: ${url_vaga}`)
      const page2 = await browser.newPage()       // open new tab
      await page2.goto(`${url_vaga}`)       // go to github.com 
      await page2.bringToFront()                   // make the tab active
      page2.close
    }
  
    console.log('Finished!')
  }
  // const lastPosition = await scrollPageToBottom(page, {
  //   size: 500,
  //   delay: 250
  // })

  
  // const dados = await page.evaluate(() => {
  //   return document.querySelector('.results-context-header__job-count').textContent
  // })

  // const dados = 10
  console.log('fim')
}

robo();