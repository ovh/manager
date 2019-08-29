export default () => function (str, len) {
  if ((len > 4) && (len < str.length)) {
    const begin = str.substring(0, (len - 3) / 2);
    const end = str.substr(-(len - 3) / 2);
    return `${begin}...${end}`;
  }
  return str;
};
