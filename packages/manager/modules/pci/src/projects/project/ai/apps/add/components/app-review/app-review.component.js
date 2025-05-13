import controller from './app-review.controller';
import template from './app-review.html';

export default {
  bindings: {
    projectId: '<',
    appModel: '<',
    prices: '<',
    convertModelToSpecs: '<',
  },
  controller,
  template,
};
