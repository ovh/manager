export default {
  test(val: unknown) {
    return typeof val === 'string';
  },
  print(val: string) {
    return val.replace(/_[a-z0-9]{5,}_[0-9]+/g, '');
  },
};