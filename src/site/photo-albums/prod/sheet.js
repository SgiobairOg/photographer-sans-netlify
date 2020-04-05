if (process.env['NODE_ENV'] != 'production') {
    require('custom-env').env('development');
}
const axios = require('axios');
const seed = require('../../../utils/save-seed.js');

const sheetID = process.env['PUBLIC_SHEET_URL'];
const googleSheetUrl = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;

module.exports = () => {
    const buildTextToLength = (tokenSrc, lineLength, accumulator = [], currentLine = "") => {
        const nextWord = tokenSrc.shift();
        const testLine = `${currentLine} ${nextWord}`

        if (testLine.length > lineLength) {
            accumulator.push(currentLine.trim());
            currentLine = nextWord;
        } else {
            currentLine = testLine;
        }

        if (tokenSrc.length == 0) {
            accumulator.push(currentLine.padEnd(lineLength, String.fromCharCode(160)));
            return accumulator;
        }

        return buildTextToLength(tokenSrc, lineLength, accumulator, currentLine);
    }

    return new Promise((resolve, reject) => {

        console.log(`Requesting data from ${googleSheetUrl}`);

        axios.get(googleSheetUrl)
            .then(response => {
                // massage the data from the Google Sheets API into
                // a shape that will more convenient for us in our SSG.
                var data = {
                    "content": []
                };
                response.data.feed.entry.forEach(item => {
                    console.log(JSON.stringify(item, null, 2));
                    data.content.push({
                        "titleElements": buildTextToLength(
                            item.gsx$title.$t.split(' '), item.gsx$titlelinelength.$t
                        ),
                        "textElements": buildTextToLength(
                            item.gsx$text.$t.split(' '), item.gsx$textlinelength.$t
                        ),
                        "bgColor": item.gsx$bgcolor.$t,
                        "fgColor": item.gsx$fgcolor.$t,
                    })
                });

                // stash the data locally for developing without
                // needing to hit the API each time.
                seed(JSON.stringify(data), `${__dirname}/../dev/sheet.json`);

                // resolve the promise and return the data
                resolve(data);

            })

            // uh-oh. Handle any errrors we might encounter
            .catch(error => {
                console.log('Error :', error);
                reject(error);
            });
    })
}
