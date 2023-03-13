const http = require('http');
const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const options = new firefox.Options();
options.headless();
const profilePath = "C:/Users/Imtiaz Ahmed/AppData/Roaming/Mozilla/Firefox/Profiles/rf2zatww.scrapperProfile";
options.setProfile(profilePath);
// global browser instance

let browser;
async function start() {
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    browser = driver;
}


async function getJobs(query) {
    await start()
    await browser.get(`https://www.google.com/search?q=site:linkedin.com ${query} jobs`);
    let element = await browser.findElement(By.className('yuRUbf'));
    let link = await element.findElement(By.tagName('a')).getAttribute('href');
    await browser.get(link);

    let i = 0
    while (true) {
        await browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        let elements = await browser.findElements(By.className('infinite-scroller__show-more-button'));
        if (elements.length > 0) {
            let element = elements[0];
            await browser.executeScript('arguments[0].scrollIntoView(true);', element);
            await browser.wait(until.elementIsEnabled(element));
        }
        i++
        if (i == 280) {
            break
        }
    }

    // click
    let jobs = []
    try {
        i = 0;
        while (true) {
            await browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
            let elements = await browser.findElements(By.className('infinite-scroller__show-more-button'));
            if (elements.length > 0) {
                let element = elements[0];
                await browser.executeScript('arguments[0].scrollIntoView(true);', element);
                await browser.wait(until.elementIsEnabled(element));
                await element.click()
                i++
            } else {
                break
            }
        }
    }
    catch (err) {
        let cards = await browser.findElements(By.className('base-card__full-link'));
        for (let card of cards) {
            let title = await card.getAttribute('innerHTML')
            let link = await card.getAttribute('href')
            jobs.push({
                title,
                link
            })
        }
        return jobs
    }
}

async function getCompanies() {
    await browser.findElement(By.className('search-global-typeahead__input')).sendKeys('react');
    const data = await browser.findElement(By.className('artdeco-pill'))
    return data
}

const server = http.createServer(async function (req, res) {
    let body = '';
    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', async function () {
        if (req.url === '/jobs') {
            const data = JSON.parse(body);
            const query = data.query;
            const response = await getJobs(query);
            res.end(JSON.stringify(response));
        } else if (req.url === '/companies') {
            const response = await getCompanies();
            res.end(response);
        } else {
            res.statusCode = 404;
            res.end('Not found');
        }
    })
});

server.listen(4000, function () {
    console.log('Server running on port 4000');
});




async function getJobs() {
    const options = new firefox.Options();
    options.setProfile(profilePath);
    const driver = new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();
    await driver.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await driver.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await driver.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await driver.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await driver.findElements(By.className("search-reusables__primary-filter"));
    await buttons[0].click()
    // Fetch all jobs
    let totalJobs = []
    await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
    await new Promise(resolve => setTimeout(resolve, 10000));
    const container = await driver.findElement(By.className('jobs-search-results-list'));
    await driver.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container);

    await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();

    if(spanValue>5){
        spanValue = 5
    }
    for (let i = 0; i < spanValue; i++) {
        // await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));

        const list = await driver.findElements(By.className("jobs-search-results__list-item"))
        for(let i=0 ; i<list.length; i++){
            totalJobs.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
        const container = await driver.findElement(By.className('jobs-search-results-list'));
        await driver.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container)
    }
    console.log(totalJobs)
}

async function getCompanies() {
    const options = new firefox.Options();
    options.setProfile(profilePath);
    const driver = new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();
    await driver.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await driver.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await driver.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await driver.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await driver.findElements(By.className("search-reusables__primary-filter"));
    await buttons[1].click()
    // Fetch all companies
    let totalCompanies = []
    await driver.wait(until.elementLocated(By.className('entity-result__item')));
    await new Promise(resolve => setTimeout(resolve, 10000));
    const container = await driver.findElement(By.className('theme--mercado'));
    await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);

    await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();

    if(spanValue>5){
        spanValue = 5
    }
    for (let i = 0; i < spanValue; i++) {
        const container = await driver.findElement(By.className('theme--mercado'));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));

        const list = await driver.findElements(By.className("reusable-search__entity-result-list "))
        for(let i=0 ; i<list.length; i++){
            totalCompanies.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await driver.wait(until.elementLocated(By.className('entity-result__item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
    }
    console.log(totalCompanies)
}

async function getProfiles() {
    const options = new firefox.Options();
    options.setProfile(profilePath);
    const driver = new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();
    await driver.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await driver.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await driver.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await driver.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await driver.findElements(By.className("search-reusables__primary-filter"));
    await buttons[2].click()
    // Fetch all companies
    let totalProfiles = []
    await driver.wait(until.elementLocated(By.className('reusable-search__entity-result-list')));
    await new Promise(resolve => setTimeout(resolve, 5000));
    const container = await driver.findElement(By.className('theme--mercado'));
    await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);

    await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();

    if(spanValue > 5){
        spanValue = 5
    }
    for (let i = 0; i < spanValue; i++) {
        const container = await driver.findElement(By.className('theme--mercado'));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));

        const list = await driver.findElements(By.className("entity-result__item"))
        for(let i=0 ; i<list.length; i++){
            totalProfiles.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await driver.wait(until.elementLocated(By.className('entity-result__item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
    }
    console.log(totalProfiles)
}
