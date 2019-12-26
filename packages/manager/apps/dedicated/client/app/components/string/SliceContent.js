/**
 * Return first X characters of a string.
 * If string length is smaller than index, the string is returned.
 * If string length is grater than index, the string is sliced and appended by '...'
 * If no X provided, a default value of 50 is used.
 */
angular.module('filters').filter(
  'sliceContent',
  () =>
    function sliceContentFilter(content, _index) {
      let index = _index;
      index = index && index > 0 ? index : 50;
      let result = content ? content.slice(0, index) : '';
      if (content && content.length > index) {
        result += '...';
      }
      return result;
    },
);
