const http = require('http');
const cors = require('cors');
const { Builder, By, until, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const options = new firefox.Options();
options.headless();
const profilePath = "C:/Users/Imtiaz Ahmed/AppData/Roaming/Mozilla/Firefox/Profiles/rf2zatww.scrapperProfile";
options.setProfile(profilePath);
// global browser instance

var socketObj;
let browser;
async function start() {
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    browser = driver;
}

async function getJobs() {
    console.log('Jobs is called')
    await start()
    await browser.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await browser.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await browser.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));
    await buttons[0].click()
    // Fetch all jobs
    let totalJobs = []
    await browser.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
    await new Promise(resolve => setTimeout(resolve, 10000));
    const container = await browser.findElement(By.className('jobs-search-results-list'));
    await browser.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container);

    await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();

    if (spanValue > 2) {
        spanValue = 2
    }
    for (let i = 0; i < spanValue; i++) {
        // await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));

        const list = await browser.findElements(By.className("jobs-search-results__list-item"))
        for (let i = 0; i < list.length; i++) {
            totalJobs.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await browser.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
        const container = await browser.findElement(By.className('jobs-search-results-list'));
        await browser.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container)
        console.log('jobs in progress')
    }
    console.log('jobs is done')
    return totalJobs
}

async function getCompanies(socket) {
    await start()
    await browser.get('https://www.linkedin.com');
    // Wait for the page to finish loading before attempting to find the search input element
    await browser.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await browser.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));
    await buttons[1].click()
    // Fetch all companies
    let totalCompanies = []
    await browser.wait(until.elementLocated(By.className('entity-result__item')));
    await new Promise(resolve => setTimeout(resolve, 10000));
    const container = await browser.findElement(By.className('theme--mercado'));
    await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
    await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();
    for (let i = 0; i < 1; i++) {
        const container = await browser.findElement(By.className('theme--mercado'));
        await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
        await browser.wait(until.elementLocated(By.className('reusable-search__entity-result-list')));
        await new Promise(resolve => setTimeout(resolve, 3000));
        const list = await browser.findElements(By.className("reusable-search__result-container"))
        for (let i = 0; i < list.length; i++) {
            let d = await list[i].getAttribute('innerHTML')
            socket.emit('companies', d)
            totalCompanies.push(d)
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await browser.wait(until.elementLocated(By.className('entity-result__item')));
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return totalCompanies
}

async function getProfiles() {
    await start()
    await browser.get('https://www.linkedin.com');
    // Wait for the page to finish loading before attempting to find the search input element
    await browser.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await browser.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));
    await buttons[2].click()
    // Fetch all companies
    let totalProfiles = []
    await browser.wait(until.elementLocated(By.className('reusable-search__entity-result-list')));
    await new Promise(resolve => setTimeout(resolve, 5000));
    const container = await browser.findElement(By.className('theme--mercado'));
    await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
    await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();
    if (spanValue > 2) {
        spanValue = 2
    }
    for (let i = 0; i < spanValue; i++) {
        const container = await browser.findElement(By.className('theme--mercado'));
        await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));
        const list = await browser.findElements(By.className("entity-result__item"))
        for (let i = 0; i < list.length; i++) {
            totalProfiles.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await browser.wait(until.elementLocated(By.className('entity-result__item')));
        await new Promise(resolve => setTimeout(resolve, 4000));
        socket.emit('data', totalProfiles.join('\n'));
    }
    socket.emit('end', '');
    return totalProfiles
}

const server = http.createServer(async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let body = '';

    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', async function () {
        if (req.url === '/jobs') {
            // const data = JSON.parse(body);
            // const query = data.query;
            const response = await getJobs();
            res.end(JSON.stringify(response));
        }  else if (req.url === '/companies') {
            const response = await getCompanies(socketObj);
            res.end(JSON.stringify(response));
        }else if (req.url === '/profiles') {
            const response = await getProfiles();
            res.end(JSON.stringify(response));
        } else if (req.url === '/stream') {
            res.end('hello')
            // io.on('connection', (socket) => {
            //     console.log('a user connected');
            //     setInterval(() => {
            //       socket.emit('data', Math.random());
            //     }, 1000);
            //   });
        } else {
            res.statusCode = 404;
            res.end('Not found');
        }
    })
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socketObj = socket;
    console.log('a user connected');
    setInterval(() => {
        socket.emit('data', Math.random());
    }, 5000);

    socket.on('getCompanies', async function () {
        const response = await getCompanies(socket);
        socket.emit('companies', JSON.stringify(response));
    });
});

server.listen(4000, function () {
    console.log('Server running on port 4000');
});