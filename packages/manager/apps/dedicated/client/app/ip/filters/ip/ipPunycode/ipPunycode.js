angular.module('Module.ip.filters').filter('ipPunycode', () => function (reverse, decode) {
  return reverse ? punycode[decode ? 'toUnicode' : 'toASCII'](reverse) : '';
});
