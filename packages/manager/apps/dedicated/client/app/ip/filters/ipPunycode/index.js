export default () =>
  function ipPunycodeFilter(reverse, decode) {
    return reverse ? punycode[decode ? 'toUnicode' : 'toASCII'](reverse) : '';
  };
