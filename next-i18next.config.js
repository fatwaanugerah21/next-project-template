const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
  },
  react: { useSuspense: false }, //this line
  localePath: path.resolve("./public/locales")
};