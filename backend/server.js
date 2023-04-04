const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Builder, By, until, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const options = new firefox.Options();
options.headless();
const profilePath = "C:/Users/Imtiaz Ahmed/AppData/Roaming/Mozilla/Firefox/Profiles/rf2zatww.scrapperProfile";
options.setProfile(profilePath);
const url = require('url');
const querystring = require('querystring');
// global browser instance

var socketObj;
let browser;
async function start() {
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    browser = driver;
}

async function getJobs(socket, queryParams, q2) {
    
    console.log(queryParams)
    console.log('Jobs is called')
    await start()
    await browser.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await browser.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await browser.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    console.log('first')
    await element.sendKeys(queryParams);
    await element.sendKeys(Key.RETURN);
    await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));
    let temp = null
    for (let i = 0; i < buttons.length; i++) {
        let ele = await buttons[i].getAttribute('innerHTML')
        let ind = ele.indexOf('type="button">')
        let ie = ele.slice(ind+14, ele.length)
        ie = ie.trim()
        console.log(ie)
        if(ie.startsWith('Jobs')){
            temp = i
            break;
        }
    }

    await new Promise(resolve => setTimeout(resolve, 6000));
    await buttons[temp].click()
    await browser.wait(until.elementLocated(By.className("jobs-search-box__input--location")));
    const inp = await browser.findElement(By.className("jobs-search-box__input--location"));
    const innerInput = await inp.findElements(By.tagName("input"));
    await innerInput[0].click();
    await new Promise(resolve => setTimeout(resolve, 6000));
    await innerInput[0].clear();
    await innerInput[0].sendKeys(q2);
    await innerInput[0].sendKeys(Key.RETURN);



    // Fetch all jobs
    let totalJobs = []
    await browser.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
    await new Promise(resolve => setTimeout(resolve, 10000));
    const container = await browser.findElement(By.className('jobs-search-results-list'));
    await browser.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container);
    console.log('third')
    await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();
    console.log('fourth')
    if (spanValue > 7) {
        spanValue = 7
    }
    for (let i = 0; i < spanValue; i++) {
        // await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));
        console.log('fifth')
        const list = await browser.findElements(By.className("jobs-search-results__list-item"))
        for (let i = 0; i < list.length; i++) {
            let d = await list[i].getAttribute('innerHTML')
            totalJobs.push(d)
            console.log(d)
            console.log('siz')
            socket.emit('jobs', d)
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await browser.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
        const container = await browser.findElement(By.className('jobs-search-results-list'));
        await browser.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container)
        console.log('jobs in progress')
    }
    // console.log('jobs is done')
    // return totalJobs
}

async function getCompanies(socket, q1, q2) {
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
            socket.emit('companies', d)
        }
        if (await pagination[i + 1]) {
            await pagination[i + 1].click()
            await browser.wait(until.elementLocated(By.className('entity-result__item')));
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return totalCompanies
}

async function getProfiles(socket, queryParams, q2) {
    console.log('working',queryParams)
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
    await buttons[0].click()
    console.log('first1')

    await new Promise(resolve => setTimeout(resolve, 5000));

    const inp = await browser.findElement(By.className("jobs-search-box__input--location"));
    const innerInput = await inp.findElements(By.tagName("input"));
    await innerInput[0].clear();
    await innerInput[0].click();
    await innerInput[0].sendKeys(q2);
    await innerInput[0].sendKeys(Key.RETURN);


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
    console.log('second2')
    for (let i = 0; i < spanValue; i++) {
        const container = await browser.findElement(By.className('theme--mercado'));
        await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        console.log('third3')
        const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));
        const list = await browser.findElements(By.className("relative job-card-list"))
        console.log('before')
        for (let i = 0; i < list.length; i++) {
            let d = await list[i].getAttribute('innerHTML')
            totalProfiles.push(d)
            console.log('asdfasdf')
            socket.emit('profiles', d)
        }
        console.log('after')

        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await browser.wait(until.elementLocated(By.className('relative job-card-list')));
        await new Promise(resolve => setTimeout(resolve, 4000));
    }

    // return totalProfiles
}

const server = http.createServer(async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let body = '';

    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', async function () {
        if (req.url.startsWith('/jobs')) {
            let str = req.url
            let query = str.slice(12, str.length)
            let q1 = query.slice(0, query.indexOf('/?location='))
            let q2 = query.slice(query.indexOf('/?location=') + 11, query.length)
            const response = await getJobs(socketObj, q1, q2);
            // res.end(JSON.stringify(response));
        } else if (req.url.startsWith('/companies')) {
            // Parse the URL and query string to retrieve query parameters
            let str = req.url
            let query = str.slice(17, str.length)
            let q1 = query.slice(0, query.indexOf('/?location='))
            let q2 = query.slice(query.indexOf('/?location=') + 11, query.length)
            const response = await getCompanies(socketObj, q1, q2);
            // res.end(JSON.stringify(response));
        } else if (req.url.startsWith('/profiles')) {
            let str = req.url
            let query = str.slice(16, str.length)
            let q1 = query.slice(0, query.indexOf('/?location='))
            let q2 = query.slice(query.indexOf('/?location=') + 11, query.length)
            const response = await getProfiles(socketObj, q1, q2);
            res.end('end');
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
    }, 10000);
});

server.listen(4000, function () {
    console.log('Server running on port 4000');
});