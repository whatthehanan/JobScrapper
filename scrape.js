const request = require('request');
const cheerio = require('cheerio');

request('https://news.ycombinator.com/jobs', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.athing').each((i, row) => {
            let string = $(row)
                .text()
                .trim()
                .toLowerCase()
                // .split(/[^\w#]+/);
                // .split(/(\bis hiring\b)|(\bis looking\b)|(\bhiring\b)|(\bhires\b)/);
                // .split(/(is\s)?(hir(ing|es)|looking)+/)
                .replace(/(is\s)?(hir(ing|es)|looking)+/, '&&&')
                .split('&&&');

            console.log("Company Name:",string[0].trim())
            console.log($(row).next().text().trim());
        });

        console.log('Scraping Done...');
    }
});