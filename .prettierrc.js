/**
 * https://prettier.io/docs/en/options.html
 */
module.exports = {
    jsxSingleQuote: false,
    bracketSameLine: true,
    quoteProps: "as-needed",
    endOfLine: "crlf",
    trailingComma: "none",
    semi: true,
    bracketSpacing: false,
    arrowParens: "always",
    htmlWhitespaceSensitivity: "strict",
    insertPragma: false,
    printWidth: 120,
    proseWrap: "preserve",
    singleQuote: true,
    useTabs: false,
    overrides: [
        {
            files: ".prettierrc",
            options: {
                parser: "json",
            },
        },
        {
            files: "document.ejs",
            options: {
                parser: "html",
            },
        },
    ],
};
