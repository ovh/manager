import get from 'lodash/get';

export default () => function (err) {
  return get(err, 'data.value.message')
               || get(err, 'data.message')
               || get(err, 'statusText')
               || err;
};
