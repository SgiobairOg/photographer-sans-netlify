const htmlmin = require("html-minifier");

if (process.env['NODE_ENV'] === 'dev') {
    require('custom-env').env('dev')
}

let env = process.env.NODE_ENV;

module.exports = function (eleventyConfig) {
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }

        return content;
    });

    eleventyConfig.addWatchTarget("./src/styles/");

    eleventyConfig.addPassthroughCopy("./src/site/styles");

    // make the seed target act like prod
    env = (env == "seed") ? "prod" : env;

    return {
        dir: {
            input: "src/site",
            data: `photo-albums/${env}`,
            includes: "partials",
            layouts: "layouts",
            output: "dist"
        },
        templateFormats: ['njk'],
        htmlTemplateEngine: "njk",
    };
};