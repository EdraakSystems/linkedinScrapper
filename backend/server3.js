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

async function getCompanies(queryParams = 'software', q2 = 'united kingdom') {

    console.log('working', queryParams)
    await start()
    await browser.get('https://www.linkedin.com');
    // Wait for the page to finish loading before attempting to find the search input element
    await browser.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await browser.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys(queryParams);
    await element.sendKeys(Key.RETURN);
    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));


    let temp = null
    for (let i = 0; i < buttons.length; i++) {
        let ele = await buttons[i].getAttribute('innerHTML')
        let ind = ele.indexOf('type="button">')
        let ie = ele.slice(ind + 14, ele.length)
        ie = ie.trim()
        console.log(ie)
        if (ie.startsWith('People')) {
            temp = i
            break;
        }
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    await buttons[temp].click()

    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const filters = await browser.findElements(By.className("search-reusables__primary-filter"));
    await filters[2].click();
    const inputField = await browser.findElement(By.className('search-basic-typeahead')).findElement(By.tagName('input'));
    const buttons2 = await browser.findElement(By.className('reusable-search-filters-buttons')).findElements(By.tagName('button'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await inputField.click();
    await inputField.sendKeys(q2, Key.RETURN);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const suggestion = await browser.findElement(By.className('basic-typeahead__triggered-content'));
    await suggestion.click()
    await new Promise(resolve => setTimeout(resolve, 1000));
    const btn2 = await filters[2].findElements(By.className('artdeco-button'))
    btn2[1].click()
    
    
    // Fetch all companies
    let totalProfiles = []
    // await browser.wait(until.elementLocated(By.className('reusable-search__entity-result-list')));
    await new Promise(resolve => setTimeout(resolve, 5000));
    const container = await browser.findElement(By.className('theme--mercado'));
    await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
    await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();
    if (spanValue > 5) {
        spanValue = 5
    }
    for (let i = 0; i < spanValue; i++) {
        const container = await browser.findElement(By.className('theme--mercado'));
        await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));
        const list = await browser.findElements(By.className("relative job-card-list"))
        for (let i = 0; i < list.length; i++) {
            let d = await list[i].getAttribute('innerHTML')
            totalProfiles.push(d)
            socket.emit('profiles', d)
        }

        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await browser.wait(until.elementLocated(By.className('relative job-card-list')));
        await new Promise(resolve => setTimeout(resolve, 4000));
    }

}


getCompanies()