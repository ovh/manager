import snakeCase from 'lodash/snakeCase';

export default () =>
  function slugify(str) {
    return snakeCase(str);
  };
