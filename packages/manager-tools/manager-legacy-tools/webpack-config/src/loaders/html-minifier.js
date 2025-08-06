const { minify } = require('html-minifier');
// see : https://github.com/kangax/html-minifier

module.exports = function translationsJson(source) {
  if (this.mode !== 'production') {
    return source;
  }
  return minify(source, {
    continueOnParseError: true,
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });
};
