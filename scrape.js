const puppeteer = require("puppeteer");
const scrapeOne = require("./scrapeOne");

module.exports = async function(mapURL, noOfPages) {

  // Scroll down until you can't anymore
  async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                const element = document.querySelectorAll('.section-scrollbox')[1];
                var scrollHeight = element.scrollHeight;
                element.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
  }

  //Getting all twenty links
  async function parseLinks(page) {
    let links = [];

    const elements = await page.$$(`[jsaction*="mouseover:pane"] > a`);
    if (elements && elements.length) {
      for (const el of elements) {
         const link = await el.evaluate(a => a.href);

         links.push(link);
      }
    }
    return links;
  }

  //click on next button
  async function goToNextPage(page) {
    await page.click('button[aria-label=" Next page "]');
    await page.waitForNetworkIdle();
  }

  //Starting the browser
  return await (async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1300,
      height: 600
    })
    await page.goto(mapURL);

    let links = [];
    let i = 0;

    do {
      await autoScroll(page);

      links = [...links, await parseLinks(page)];

      await goToNextPage(page);

      i++;

    } while (i < noOfPages);

      await browser.close();
      //return links;

      return await scrapeOne(links);

  })();


}
