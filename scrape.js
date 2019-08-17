const request = require('request');
const cheerio = require('cheerio');

request('https://news.ycombinator.com/jobs', (error, response, html) => {
    // check if request executed correctly
    if (error || response.statusCode != 200) {
        console.log('error accessing website');
        return;
    }

    // load html returned by the website
    const $ = cheerio.load(html);

    // loop over elements with job description
    $('.athing').each((i, row) => {

        // this is the full job description
        let string = $(row)
            .text()
            .trim();

        // use regex to separate company name and rest of string
        //  match for characters that come after a company name
        // e.g is hiring/hires/hiring/is looking/wants/raises/raised
        let index = string.match(/(is\s)?(hir(ing|es)|looking|wants|(raise(d|s)))/i).index;
        let companyName = string.substring(0, index);

        // get location from jobDescription
        // checks for 2 cases i.e (in {cityname})| remote
        let jobDescription = string.substring(index);
        let location = jobDescription.trim().match(/((?<=in\s)\w+)|remote/i);
        location = location ? location[0] : 'No Location Matched';

        // gets time job was posted
        let timePosted = $(row).next().text().trim();

        console.log('\t\t----------\n');
        console.log("Company Name:", companyName);
        console.log("Location:", location);
        console.log("Time Posted: ", timePosted);
        console.log('\n\t\t----------');
    });

});