import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    informations: '<',
    installation: '<',
    onError: '&?',
  },
  controller,
  template,
};
