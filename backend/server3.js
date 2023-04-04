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

async function getCompanies(q1 = 'react', q2 = 'lahore') {

  
    console.log('started');
    await start();
    await browser.get('https://www.linkedin.com');
    // Wait for the page to finish loading before attempting to find the search input element
    await browser.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await browser.findElement(By.className('search-global-typeahead__input'));
    await element.click();
    await element.sendKeys(q1);
    await element.sendKeys(Key.RETURN);
    console.log('started2');
    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));
    await buttons[5].click();
    // Fetch all companies  
    console.log('started3');
    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const filters = await browser.findElements(By.className("search-reusables__primary-filter"));
    await filters[1].click();
    console.log('hello world');
    const inputField = await browser.findElement(By.className('search-basic-typeahead')).findElement(By.tagName('input'));
    const buttons2 = await browser.findElement(By.className('reusable-search-filters-buttons')).findElements(By.tagName('button'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await inputField.click();
    await inputField.sendKeys(q2, Key.RETURN);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const suggestion = await browser.findElement(By.className('basic-typeahead__triggered-content'));
    await suggestion.click()
    await new Promise(resolve => setTimeout(resolve, 1000));
    buttons2[1].click()
    console.log('after clicking')
    let totalCompanies = []
    await browser.wait(until.elementLocated(By.className('entity-result__item')));
    await new Promise(resolve => setTimeout(resolve, 1000));
    const container = await browser.findElement(By.className('theme--mercado'));
    await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
    await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();
    for (let i = 0; i < 7; i++) {
        const container = await browser.findElement(By.className('theme--mercado'));
        await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
        await browser.wait(until.elementLocated(By.className('reusable-search__entity-result-list')));
        await new Promise(resolve => setTimeout(resolve, 3000));
        const list = await browser.findElements(By.className("reusable-search__result-container"));
        for (let i = 0; i < list.length; i++) {
            let d = await list[i].getAttribute('innerHTML')
            // socket.emit('companies', d)
        }
        if (await pagination[i + 1]) {
            await pagination[i + 1].click()
            await browser.wait(until.elementLocated(By.className('entity-result__item')));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return totalCompanies

}


getCompanies()