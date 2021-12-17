const puppeteer = require("puppeteer");

module.exports = async function(links) {
  let lists = [];
  for await (const arr of links) {
    for await (const [i, item] of arr.entries()){

      listContent = await (async () => {

        try {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();

          await page.setViewport({
            width: 1300,
            height: 600
          });

          await page.goto(item);

          const name = await page.evaluate(() => (document.querySelector('h1 span') !== null) ? document.querySelector('h1 span').textContent : null);
          const imgURL = await page.evaluate(() => (document.querySelector('button[jsaction="pane.heroHeaderImage.click"] > img') !== null) ? document.querySelector('button[jsaction="pane.heroHeaderImage.click"] > img').src : null);
          const category = await page.evaluate(() => (document.querySelector('button[jsaction="pane.rating.category"]') !== null) ? document.querySelector('button[jsaction="pane.rating.category"]').textContent : null);
          const description = await page.evaluate(() => (document.querySelector('button[jsaction="pane.attributes.expand;ptrdown:ripple.play;mousedown:ripple.play;keydown:ripple.play"] > div > div > div > span') !== null) ? document.querySelector('button[jsaction="pane.attributes.expand;ptrdown:ripple.play;mousedown:ripple.play;keydown:ripple.play"] > div > div > div > span').textContent : null);
          let address = await page.evaluate(() => (document.querySelector('button[data-tooltip="Copy address"]') !== null) ? document.querySelector('button[data-tooltip="Copy address"]').ariaLabel : null);
          let plusCode = await page.evaluate(() => (document.querySelector('button[data-tooltip="Copy plus code"]') !== null) ? document.querySelector('button[data-tooltip="Copy plus code"]').ariaLabel : null);
          let website = await page.evaluate(() => (document.querySelector('button[data-tooltip="Open website"]') !== null) ? document.querySelector('button[data-tooltip="Open website"]').ariaLabel : null);
          let phone = await page.evaluate(() => (document.querySelector('button[data-tooltip="Copy phone number"]') !== null) ? document.querySelector('button[data-tooltip="Copy phone number"]').ariaLabel : null);
          let status = await page.evaluate(() => (document.querySelector('div[jsaction="pane.openhours.163.dropdown;keydown:pane.openhours.163.dropdown;"]') !== null) ? document.querySelector('div[jsaction="pane.openhours.163.dropdown;keydown:pane.openhours.163.dropdown;"]').innerText : null);
          let isClaimed = await page.evaluate(() => (document.querySelector('button[aria-label="Claim this business"]') !== null) ? document.querySelector('button[aria-label="Claim this business"]').innerText : null);
          let day0 = await page.evaluate(() => (document.querySelectorAll('table > tbody > tr')[0] !== null && document.querySelectorAll('table > tbody > tr')[0] !== undefined) ? document.querySelectorAll('table > tbody > tr')[0].textContent : null);
          let day1 = await page.evaluate(() => (document.querySelectorAll('table > tbody > tr')[1] !== null && document.querySelectorAll('table > tbody > tr')[1] !== undefined) ? document.querySelectorAll('table > tbody > tr')[1].textContent : null);
          let day2 = await page.evaluate(() => (document.querySelectorAll('table > tbody > tr')[2] !== null && document.querySelectorAll('table > tbody > tr')[2] !== undefined) ? document.querySelectorAll('table > tbody > tr')[2].textContent : null);
          let day3 = await page.evaluate(() => (document.querySelectorAll('table > tbody > tr')[3] !== null && document.querySelectorAll('table > tbody > tr')[3] !== undefined) ? document.querySelectorAll('table > tbody > tr')[3].textContent : null);
          let day4 = await page.evaluate(() => (document.querySelectorAll('table > tbody > tr')[4] !== null && document.querySelectorAll('table > tbody > tr')[4] !== undefined) ? document.querySelectorAll('table > tbody > tr')[4].textContent : null);
          let day5 = await page.evaluate(() => (document.querySelectorAll('table > tbody > tr')[5] !== null && document.querySelectorAll('table > tbody > tr')[5] !== undefined) ? document.querySelectorAll('table > tbody > tr')[5].textContent : null);
          let day6 = await page.evaluate(() => (document.querySelectorAll('table > tbody > tr')[6] !== null && document.querySelectorAll('table > tbody > tr')[6] !== undefined) ? document.querySelectorAll('table > tbody > tr')[6].textContent : null);
          const noOfReviews = await page.evaluate(() => (document.querySelector('button[jsaction="pane.rating.moreReviews"]') !== null) ? document.querySelector('button[jsaction="pane.rating.moreReviews"]').textContent : null);

          let openHours;

          //Checking if reviews are null
          if (noOfReviews !== null) {
            arrNoOfReviews = noOfReviews.split(' ');
            newNoOfReviews = arrNoOfReviews[0];
          } else {
            newNoOfReviews = null;
          }

          //Removing "Address:" from addressScrape const
          if (address !== null){
            address = address.replace('Address: ','');
            address = address.replace(/\s+/g,' ').trim();
          }

          //Removing "Plus code:" from plusCodeScrape (Unique Address Code)
          if (plusCode !== null) {
            plusCode = plusCode.replace('Plus code: ','');
          }

          //Removing "Website: " and adding "http://" to websites
          if (website !== null) {
            website = website.replace('Website: ', 'http://');
            website = website.replace(/\s+/g,' ').trim();
          }

          //Removing "Phone: " and extra spaces
          if (phone !== null) {
            phone = phone.replace('Phone: ', '');
            phone = phone.replace(/\s+/g,' ').trim();
          }

          //There are two types of status element found 1st is Div and 2nd is Button
          if (status !==null) {
            // If status element type is div
            if (status.includes('Opens') || status.includes('Closed')) {
              status = 'Close';
            } else {
              status = 'Open';
            }
          } else {
            // If status element type is button Or first selection type has been failed
            status = await page.evaluate(() => (document.querySelector('button[data-item-id="oh"]') !== null) ? document.querySelector('button[data-item-id="oh"]').innerText : null);

            if (status !== null) {
              if (status.includes('Opens') || status.includes('Closed')) {
                status = 'Close';
              } else {
                status = 'Open';
              }
            }
          }

          //Checking Opening Hours
          if (day0 !== null && day0 !== undefined) {
            day0 = day0.replace(/\s+/g,' ').trim();
            day0 = day0.split(' ');
            day0name = day0[0];
            day0hour = day0[1];
          }
          if (day1 !== null && day1 !== undefined) {
            day1 = day1.replace(/\s+/g,' ').trim();
            day1 = day1.split(' ');
            day1name = day1[0];
            day1hour = day1[1];
          }
          if (day2 !== null && day2 !== undefined) {
            day2 = day2.replace(/\s+/g,' ').trim();
            day2 = day2.split(' ');
            day2name = day2[0];
            day2hour = day2[1];
          }
          if (day3 !== null && day3 !== undefined) {
            day3 = day3.replace(/\s+/g,' ').trim();
            day3 = day3.split(' ');
            day3name = day3[0];
            day3hour = day3[1];
          }
          if (day4 !== null && day4 !== undefined) {
            day4 = day4.replace(/\s+/g,' ').trim();
            day4 = day4.split(' ');
            day4name = day4[0];
            day4hour = day4[1];
          }
          if (day5 !== null && day5 !== undefined) {
            day5 = day5.replace(/\s+/g,' ').trim();
            day5 = day5.split(' ');
            day5name = day5[0];
            day5hour = day5[1];
          }
          if (day6 !== null && day6 !== undefined) {
            day6 = day6.replace(/\s+/g,' ').trim();
            day6 = day6.split(' ');
            day6name = day6[0];
            day6hour = day6[1];
          }

          if (day0 === null) {
            openHours = null;
          } else {
            openHours = {
              [day0name]: day0hour,
              [day1name]: day1hour,
              [day2name]: day2hour,
              [day3name]: day3hour,
              [day4name]: day4hour,
              [day5name]: day5hour,
              [day6name]: day6hour,
            }
          }

          //Checking if Claim your business link available
          if (isClaimed !== null) {
            isClaimed = 'no';
          } else {
            isClaimed = 'yes';
          }

          //Getting longitude and latitude
          var splitUrl = item.split('!3d');
          var splitAgain = splitUrl[1].split('!4d');
          const latitude = splitAgain[0];
          const pre_longitude = splitAgain[1];
          let longitude;
          if (pre_longitude.includes('?')) {
              longitude = pre_longitude.split('?')[0];
          } else {
              longitude = pre_longitude;
          }


          //Getting More Details about listing
          let isAvailableMore = await page.evaluate(() => (document.querySelector('button[jsaction="pane.attributes.expand;ptrdown:ripple.play;mousedown:ripple.play;keydown:ripple.play"]') !== null && document.querySelector('button[jsaction="pane.attributes.expand;ptrdown:ripple.play;mousedown:ripple.play;keydown:ripple.play"]') !== undefined ) ? true : false);
          if (isAvailableMore) {
            await page.click('button[jsaction="pane.attributes.expand;ptrdown:ripple.play;mousedown:ripple.play;keydown:ripple.play"]');
            await page.waitForNetworkIdle();

            var offerings = await page.evaluate(() => (document.querySelector('div[aria-label="Offerings"]') !== null && document.querySelector('div[aria-label="Offerings"]') !== undefined) ? document.querySelector('div[aria-label="Offerings"]').textContent : null);

            if (offerings !== null) {
              offerings = offerings.replace(/\s+/g,' ').trim();
              offerings = offerings.split(' ');
            }
          }

          console.log(i);

          content = await {
            'name': name,
            'noOfReviews': newNoOfReviews,
            'imgURL': imgURL,
            'category': category,
            'description': description,
            'address': address,
            'plusCode': plusCode, //Unique Address Code
            'website': website,
            'phone': phone,
            'status': status,
            'isClaimed': isClaimed,
            'openHours': openHours,
            'offerings': offerings,
            'latitude': latitude,
            'longitude': longitude,
            'mapLink': item,
          };

          await browser.close();

          return await content;

        } catch (e) {
          console.log(e);
        }

      })();


      //I need to push an object of Map listing
      lists.push(listContent);

    }

  }

  return await lists;
}
