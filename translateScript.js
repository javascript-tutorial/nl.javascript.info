const json = require('./filesToTranslate.json');
fs = require('fs');

global.fetch = require("node-fetch");
const puppeteer = require('puppeteer');

async function translate(incomingText) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.deepl.com/translator', {waitUntil: 'domcontentloaded'});

    await page.evaluate(() => { localStorage.setItem('LMT_preferredLangs', 'EN,NL'); });
    await page.evaluate(() => { localStorage.setItem('LMT_preferredLangVariants', 'en-US'); });
    await page.evaluate(() => { localStorage.setItem('LMT_selectedTargetLang', 'NL'); });

    await page.waitForSelector('.dl_cookieBanner--buttonAll');
    await page.click('.dl_cookieBanner--buttonAll');
    await page.evaluate(val => document.querySelector('.lmt__source_textarea').value = val, incomingText);
    await page.click('.lmt__language_select--target');
    await page.evaluate(() => {
        [...document.querySelectorAll('.lmt__language_select__menu button')].find(element => element.textContent === 'Dutch').click();
    });
    await page.waitFor(5000);
    let translatedText = await page.$eval('.lmt__target_textarea', el => el.value);
    await browser.close();
    return [incomingText, translatedText];
}

function startTranslating(url, file){
    fetch(url)
        .then(response => response.text())
        .then(response => translate(response))
        .then(response => {
            fs.writeFile(file, `${response[0]}\n====================\n${response[1]}`, function (err) {
                if (err) return console.log("schrijven mislukt! " + err);
                console.log('schrijven gelukt');
            });
        })
        .catch(err => console.log(err));
}

function fetchJSON(){
    let files = json.files;
    files.forEach(el => {
        //console.log();
        startTranslating("https://raw.githubusercontent.com/javascript-tutorial/nl.javascript.info/master/"+el.slice(21, el.length), "." + el.slice(20, el.length))
    });
}

fetchJSON();