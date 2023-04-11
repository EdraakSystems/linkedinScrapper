const { Builder, By, until, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { JSDOM } = require("jsdom");


const options = new firefox.Options();
const profilePath = "C:/Users/Imtiaz Ahmed/AppData/Roaming/Mozilla/Firefox/Profiles/rf2zatww.scrapperProfile";
options.setProfile(profilePath);

let browser;
async function start() {
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    browser = driver;
}





async function getCompanies(q1 = 'software', q2 = 'united kingdom') {


    await start();



    const arr = [
            "https://www.linkedin.com/company/corcentric/",
            "https://www.linkedin.com/company/moodys-analytics-pulse/",
            "https://www.linkedin.com/company/grand-canny/",
            "https://www.linkedin.com/company/scsolutionsinc/",
            "https://www.linkedin.com/company/avalith-net/",
            "https://www.linkedin.com/company/neogov/",
            "https://www.linkedin.com/company/dolly-inc-/",
            "https://www.linkedin.com/company/universal-translation-services/",
            "https://www.linkedin.com/company/airspan-networks/",
            "https://www.linkedin.com/company/bldai/",
            "https://www.linkedin.com/company/clearsense/",
            "https://www.linkedin.com/company/ami-global-meetings-solutions-inc./",
            "https://www.linkedin.com/company/mainline-information-systems/",
            "https://www.linkedin.com/company/elite-technical/",
            "https://www.linkedin.com/company/fortnainc/",
            "https://www.linkedin.com/company/mirabeltechnologies/",
            "https://www.linkedin.com/company/qtsdatacenters/",
            "https://www.linkedin.com/company/iquall-networks/",
            "https://www.linkedin.com/company/ducen/",
            "https://www.linkedin.com/company/mueller-water-products/",
            "https://www.linkedin.com/company/medicept/",
            "https://www.linkedin.com/company/magnolia-river/",
            "https://www.linkedin.com/company/coding-allstars/",
            "https://www.linkedin.com/company/bit2bit-s-a-c-/",
            "https://www.linkedin.com/company/verco-group/",
            "https://www.linkedin.com/company/social-native/",
            "https://www.linkedin.com/company/adistec/",
            "https://www.linkedin.com/company/exusia-inc-/",
            "https://www.linkedin.com/company/trinity-it-services/",
            "https://www.linkedin.com/company/engenium-staffing-inc/",
            "https://www.linkedin.com/company/pma-consultants/",
            "https://www.linkedin.com/company/distinctive-workforce-solutions/",
            "https://www.linkedin.com/company/the-revenue-optimization-companies/",
            "https://www.linkedin.com/company/m-ize/",
            "https://www.linkedin.com/company/ccna-ccnp-ccie-certifications-exam-dumps/",
            "https://www.linkedin.com/company/desco-llc/",
            "https://www.linkedin.com/company/verramobility/",
            "https://www.linkedin.com/company/signode/",
            "https://www.linkedin.com/company/legacy-medsearch/",
            "https://www.linkedin.com/company/teckpert/",
            "https://www.linkedin.com/company/leniolabs/",
            "https://www.linkedin.com/company/fortress-information-security/",
            "https://www.linkedin.com/company/aerosapien-technologies/",
            "https://www.linkedin.com/company/mojix/",
            "https://www.linkedin.com/company/intelepeer/",
            "https://www.linkedin.com/company/paktolus/",
            "https://www.linkedin.com/company/copypress/",
            "https://www.linkedin.com/company/aideo-technologies/",
            "https://www.linkedin.com/company/beesion-technologies-llc-/",
            "https://www.linkedin.com/company/lifeatappiskey/",
            "https://www.linkedin.com/company/trimech-solutions/",
            "https://www.linkedin.com/company/ioassociates-us/",
            "https://www.linkedin.com/company/knovos/",
            "https://www.linkedin.com/company/aquiva-labs/",
            "https://www.linkedin.com/company/geographic-solutions/",
            "https://www.linkedin.com/company/aisolutionsinc/",
            "https://www.linkedin.com/company/mobius-institute/",
            "https://www.linkedin.com/company/heru-inc/",
            "https://www.linkedin.com/company/future-tech/",
            "https://www.linkedin.com/company/goja-llc/",
            "https://www.linkedin.com/company/klika-tech/",
            "https://www.linkedin.com/company/global-survey/",
            "https://www.linkedin.com/company/splusm/",
            "https://www.linkedin.com/company/greenpages-technology-solutions/",
            "https://www.linkedin.com/company/revinate-inc/",  
            "https://www.linkedin.com/company/openinternational/",  
            "https://www.linkedin.com/company/nexval/"
      ];
      
    

    for (let i = 0; i < arr.length; i++) {
        let link = arr[i]
        await browser.get(link);
        await browser.wait(until.elementLocated(By.className('org-page-navigation__item')));
        let element = await browser.findElements(By.className('org-page-navigation__item'));
        await element[1].click();
        await new Promise(resolve => setTimeout(resolve, 4000));
        let nameContainer = await browser.findElements(By.className('org-top-card__primary-content'));
        let nameInnerContainer = await nameContainer[0].findElement(By.className('block'));
        let name = await nameInnerContainer.findElement(By.tagName('h1'));
        let nameinner = await name.findElement(By.tagName('span'));
        let finalName = await nameinner.getAttribute('innerHTML')
        let websiteContainer = await browser.findElements(By.className('org-grid__content-height-enforcer'));
        let htmlString = await websiteContainer[0].getAttribute('innerHTML')
        const dom = new JSDOM(htmlString);
        const websiteLinks = dom.window.document.querySelectorAll('dt');
        let websiteLink = null;
        for (let i = 0; i < websiteLinks.length; i++) {
            if (websiteLinks[i].textContent.trim() === 'Website') {
                websiteLink = websiteLinks[i].nextElementSibling.querySelector('a');
                break;
            }
        }
        const phoneLink = dom.window.document.querySelector('a[href^="tel:"]');
        const website = websiteLink ? websiteLink.href : null;
        const phone = phoneLink ? phoneLink.href.substring(0, 15) : null;
        console.log(finalName, link, website, phone);

    }





    // const websiteLink = dom.window.document.querySelector('a[href*="softwareadvice"]');
    // const phoneLink = dom.window.document.querySelector('a[href^="tel:"]');
    // const website = websiteLink ? websiteLink.getAttribute('href') : null;
    // phone = phoneLink?.substring(0, 15);
    // console.log(finalName, website, phone)

    // const innerDiv = div[0].querySelectorAll(".overflow-hidden .t-black--light span");
    // for(let i=0; i<innerDiv.length; i++){
    //     console.log(innerDiv[i].innerHTML)
    // }


    await new Promise(resolve => setTimeout(resolve, 100000));

    // await start();
    // await browser.get('https://www.linkedin.com');
    // // Wait for the page to finish loading before attempting to find the search input element
    // await browser.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // // get jobs on the page
    // let element = await browser.findElement(By.className('search-global-typeahead__input'));
    // await element.click();
    // await element.sendKeys(q1);
    // await element.sendKeys(Key.RETURN);
    // await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    // const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));
    // let temp = null
    // for (let i = 0; i < buttons.length; i++) {
    //     let ele = await buttons[i].getAttribute('innerHTML')
    //     let ind = ele.indexOf('type="button">')
    //     let ie = ele.slice(ind+14, ele.length)
    //     ie = ie.trim()
    //     if(ie.startsWith('Companies')){
    //         temp = i
    //         break;
    //     }
    // }
    // await buttons[temp].click()
    // // Fetch all companies  
    // await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    // const filters = await browser.findElements(By.className("search-reusables__primary-filter"));
    // await filters[1].click();
    // const inputField = await browser.findElement(By.className('search-basic-typeahead')).findElement(By.tagName('input'));
    // const buttons2 = await browser.findElement(By.className('reusable-search-filters-buttons')).findElements(By.tagName('button'));
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await inputField.click();
    // await inputField.sendKeys(q2, Key.RETURN);
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // const suggestion = await browser.findElement(By.className('basic-typeahead__triggered-content'));
    // await suggestion.click()
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // buttons2[1].click()
    // let totalCompanies = []
    // await browser.wait(until.elementLocated(By.className('entity-result__item')));
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // const container = await browser.findElement(By.className('theme--mercado'));
    // await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
    // await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    // const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    // const lastPageButton = pagination[pagination.length - 1];
    // const spanElement = await lastPageButton.findElement(By.tagName('span'));
    // let spanValue = await spanElement.getText();
    // console.log('yahn')
    // for (let i = 0; i < 1000; i++) {
    //     const container = await browser.findElement(By.className('theme--mercado'));
    //     await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
    //     await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    //     const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    //     await browser.wait(until.elementLocated(By.className('reusable-search__entity-result-list')));
    //     await new Promise(resolve => setTimeout(resolve, 3000));
    //     const list = await browser.findElements(By.className("reusable-search__result-container"));
    //     for (let i = 0; i < list.length; i++) {
    //         let d = await list[i].findElement(By.className('app-aware-link'))
    //         console.log(await d.getAttribute('href'))
    //         // socket.emit('companies', d)
    //     }


    //     const tt = await browser.wait(until.elementLocated(By.className('artdeco-pagination__button--next')));
    //     tt.click()
    //     await browser.wait(until.elementLocated(By.className('entity-result__item')));
    //     await new Promise(resolve => setTimeout(resolve, 1000));

    // }
    // return totalCompanies

}


getCompanies()