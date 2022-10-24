import template from './modal.html';
import controller from './modal.controller';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    ctaURL: '<',
    illustration: '<',
  },
  name: 'modalHelpCenter',
};
