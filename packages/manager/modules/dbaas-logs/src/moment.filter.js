export default /* @ngInject */ (moment) => (value, format) =>
  moment(value).format(format);
