import template from './general-information.html';
import controller from './general-information.controller';

export default {
  bindings: {
    cluster: '<',
    displayName: '<?',
    commercialName: '<?',
    statePrefix: '<?',
  },
  template,
  controller,
};
