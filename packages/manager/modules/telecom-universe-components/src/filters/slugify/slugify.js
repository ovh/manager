import snakeCase from 'lodash/snakeCase';

export default () => function (str) {
  return snakeCase(str);
};
