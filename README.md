# Photographer Sans

A Microblog by Jason Wilson using Google Sheets as a datasource to build a static site on Netlify.

## Dev and Deployment

### Prerequesites

The app requires an environment variable `PUBLIC_SHEET_URL` with the published ID number of the Google Sheet used as a data source ( See [Google Sheets Setup](#google-sheets-setup) ). On your local environment add a file named `.env.dev` with the following contents:

```env
PUBLIC_SHEET_URL=<your-id-number>
```

In your deployment environment, follow the instructions of your provider to add an environment variable.

### Development

Before running the cloned repository for the first time, install the dependencies.

```shell
  npm install
```

When the install completes run the start command to start the dev environment.

```shell
npm run start
```

The start script runs two scripts one after the other `seed` and `dev`. The script `seed` saves the data from the Sheets api into a local file so that you don't need to call the api so frequently. 

If you'd like to update the data during development you can run `seed` by itself with:

```shell
npm run seed
```

### Production

When you deploy the site your deployment pipeline will need to run the build script.

```shell
npm run build
```

## Data Source

### Google Sheets Setup

The app expects a google sheet with the following column headings: 

- title _: title of the post_
- text _: body content of the post_
- textLineLength _: number of characters per line, controls the width of each line and the number of lines in the 'photo'_
- titleLineLength _: same as above, for the title_
- bgColor _: sets a background color for the post, RRGGBB or RRGGBBAA_
- fgColor _: sets a foreground color_

Once the sheet is created, go to `file > publish to web`. Once the sheet is published, go to `share` and then `advanced`. The sheet needs to be set to 'anyone with the link can view'. The link that is produced contains the sheet ID you need to retrieve your data. 