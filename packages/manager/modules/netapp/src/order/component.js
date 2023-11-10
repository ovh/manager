import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    goBackLink: '<',
    goBack: '<',
  },
  controller,
  template,
};
