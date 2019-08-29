import snakeCase from 'lodash/snakeCase';

export default () => function (text) {
  return snakeCase(text);
};
