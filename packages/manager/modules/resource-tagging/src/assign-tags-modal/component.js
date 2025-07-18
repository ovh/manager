import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    resourceUrn: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
