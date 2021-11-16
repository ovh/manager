import controller from './hosting-multisite-statistics.controller';
import template from './hosting-multisite-statistics.html';

export default {
  bindings: {
    chartJsFactory: '<',
    domains: '<',
    getStatistics: '<',
    periods: '<',
    getCdnProperties: '<',
  },
  controller,
  template,
};
