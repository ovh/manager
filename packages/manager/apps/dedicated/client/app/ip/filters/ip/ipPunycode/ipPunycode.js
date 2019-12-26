angular.module('Module.ip.filters').filter(
  'ipPunycode',
  () =>
    function ipPunycodeFilter(reverse, decode) {
      return reverse ? punycode[decode ? 'toUnicode' : 'toASCII'](reverse) : '';
    },
);
