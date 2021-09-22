import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    illustration: '<',
    guides: '<',
    anthosReadMoreInfoLink: '<',
    trackingPrefix: '<',
    trackClick: '<',
  },
  controller,
  template,
};
