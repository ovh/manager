/**
 * Return first X characters of email + it's domain.
 * If no X provided, a default value of 30 is used.
 * Example : azertyuiop@ovh.net  >  azer...@ovh.net if index=4
 */
angular.module('filters').filter('sliceEmail', () => {
  const slice = function slice(content, _index) {
    let index = _index;
    index = index && index > 0 ? index : 50;
    let result = content.slice(0, index);
    if (content.length > index) {
      result += '...';
    }
    return result;
  };

  return function sliceEmailFilter(content, index) {
    if (content) {
      const indexOfAt = content.indexOf('@');
      const login = content.slice(0, indexOfAt);
      const domain = content.slice(indexOfAt, content.length);
      return slice(login, index) + domain;
    }
    return '';
  };
});
