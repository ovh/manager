import template from './results.html';

export default {
  bindings: {
    results: '<',
    title: '@',
  },
  controller: class TelecomSearchResultController {
    /* @ngInject */
    constructor() {
      this.offset = 1;
    }

    onChange($event) {
      this.offset = $event.offset;
    }
  },
  template,
  transclude: true,
};
