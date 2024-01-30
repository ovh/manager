import controller from './server-installation-choice.controller';
import template from './server-installation-choice.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
    statePrefix: '<?',
    serverType: '<?',
  },
  controller,
  template,
};
