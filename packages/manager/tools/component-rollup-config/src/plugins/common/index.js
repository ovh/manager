const translationNormalize = (text) => {
  if (text) {
    const filtered = text
      .toString()
      .replace(/&#13;\n/g, ' ') // carriage returns
      .replace(/&#160;/g, ' ') // spaces
      .replace(/\{(\s*\d\s*)\}/g, '{{t$1}}'); // {0} => {{t0}}
    return filtered;
  }
  return text;
};

module.exports = {
  translationNormalize,
};
