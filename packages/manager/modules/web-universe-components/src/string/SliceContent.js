/**
 * Return first X characters of a string.
 * If string length is smaller than index, the string is returned.
 * If string length is grater than index, the string is sliced and appended by '...'
 * If no X provided, a default value of 50 is used.
 */
export default () => (content, _index) => {
  const index = _index && _index > 0 ? _index : 50;
  let result = content ? content.slice(0, index) : '';
  if (content && content.length > index) {
    result += '...';
  }
  return result;
};
