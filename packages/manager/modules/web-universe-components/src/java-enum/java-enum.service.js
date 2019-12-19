import snakeCase from 'lodash/snakeCase';

export default () => ({
  tr: (enumValue) => snakeCase(enumValue).toUpperCase(),
});
