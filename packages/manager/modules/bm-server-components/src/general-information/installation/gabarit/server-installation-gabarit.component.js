import controller from './server-installation-gabarit.controller';
import template from './server-installation-gabarit.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
    serverType: '<?',
    statePrefix: '<',
  },
  controller,
  template,
};
