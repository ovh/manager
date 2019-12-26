import snakeCase from 'lodash/snakeCase';

export default () =>
  function snakeCaseFilter(text) {
    return snakeCase(text);
  };
