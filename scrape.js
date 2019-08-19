const request = require('request');
const cheerio = require('cheerio');
const dbConn = require("./db");

const getJobs = request('https://news.ycombinator.com/jobs', async (error, response, html) => {
    // check if request executed correctly
    if (error || response.statusCode != 200) {
        console.log('error accessing website');
        return;
    }

    // load html returned by the website
    const $ = cheerio.load(html);

    // get Job Model
    const { Job } = await dbConn();

    // loop over elements with job description
    // this is where we exctract all the information from the string
    $('.athing').each(async (i, row) => {

        // this is the full job description
        const string = $(row)
            .text()
            .trim();

        // use regex to separate company name and rest of string
        //  match for characters that come after a company name
        // e.g is hiring/hires/hiring/is looking/wants/raises/raised
        const companyNameRegex = /(is\s)?(hir(ing|es)|looking|wants|(raise(d|s)))/i;

        // match() funnctions returns 0 index if no match found
        let index = 0;
        let companyNameresult = string.match(companyNameRegex);
        if (companyNameresult) {
            index = companyNameresult.index;
        }


        //get company name
        const companyName = string.substring(0, index);

        // get job description
        const jobDescription = string.substring(index);

        // get job title
        let jobTitle;
        try {
            jobTitle = getJobTitle(jobDescription);
        } catch (Err) {
            jobTitle = "No Job Title Matched";
        }

        // get location from jobDescription
        // checks for 2 cases i.e (in {cityname})| remote
        let location = jobDescription.trim().match(/((?<=in\s)\w+)|remote/i);
        location = location ? location[0] : 'No Location Matched';

        // gets time job was posted
        const timePosted = $(row).next().text().trim();

        if (timePosted.indexOf('hours') !== -1) {
            let job = await Job.create({
                company_name: companyName,
                location,
                position: jobTitle,
                time_posted: timePosted,
                full_description: string,
            });
        }

        // console.log('\t\t----------\n');
        // console.log("Company Name:", companyName);
        // console.log("Location:", location);
        // console.log("Time Posted: ", timePosted);
        // console.log("Job Title:", jobTitle);
        // console.log("string:", string);
        // console.log('\n\t\t----------');

    });

});

// @param jobDescription String
// returns a jobTitle extracted from the string
// first we remove all the is hiring etc from string
// then we match for consecutive words that start with a capital letters
getJobTitle = (jobDescription) => {
    if (!jobDescription || typeof jobDescription === undefined)
        return 'No Job Title Matched';

    let jobTitle;
    const jobPositionRegex = /(?<=((for)?(a|an)?[^in]\s))([A-Z][a-zA-Z0-9-]*)([\s][A-Z][a-zA-Z0-9-]*)*/g;
    const jobPosition = jobDescription.replace(/(is\s)?(hir(ing|es)|looking|wants)/i, '&&&').split('&&&')[1];

    let res;
    if (jobPosition) {
        res = jobPosition.match(jobPositionRegex);
    } else {
        res = jobDescription.match(jobPositionRegex);
    }

    if (!res) {
        jobTitle = "No Job Title Matched";
    } else {
        jobTitle = res[0];
        if (res[0].length <= 4 && res[0] !== 'Back') {
            if (jobPosition.indexOf(/engineers?/) === -1) {
                jobTitle = "No Job Title Matched";
            } else {
                jobTitle = "Engineer";
            }
        } else if (res[0] === 'Back') {
            jobTitle = "Backend Engineer";
        }
    }

    return jobTitle;
}

setInterval(() => {
    getJobs();
}, 86400000);