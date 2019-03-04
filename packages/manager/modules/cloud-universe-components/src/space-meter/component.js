import has from 'lodash/has';

import template from './template.html';

export default /* @ngInject */ {
  template,
  bindings: {
    legend: '<',
    large: '<',
    usage: '<',
  },
  controller() {
    this.getMaxSize = function getMaxSize() {
      if (!has(this.usage, 'size.value')) {
        return null;
      }

      return parseInt(this.usage.size.value, 10);
    };
  },
};
