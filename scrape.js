const request = require('request');
const cheerio = require('cheerio');

request('https://news.ycombinator.com/jobs', (error, response, html) => {
    // check if request executed correctly
    if (error || response.statusCode != 200)
        console.log('error accessing website');

    // load html returned by the website
    const $ = cheerio.load(html);

    // select table row that has the jd
    $('.athing').each((i, row) => {
        let string = $(row)
            .text()
            .trim()
            .toLowerCase()
            .replace(/(is\s)?(hir(ing|es)|looking)/, '&&&')
            .split('&&&');

        console.log("Company Name:", string[0].trim())
        // select next tr that has the time job was posted
        console.log($(row).next().text().trim());
    });

    console.log('Scraping Done...');
});