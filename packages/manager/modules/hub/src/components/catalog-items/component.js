import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    items: '<',
    itemsPromise: '<',
    trackingPrefix: '@',
  },
  controller,
  template,
};
