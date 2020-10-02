import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstall',
  bindings: {
    server: '<',
    getInstallationTypeHref: '<',
  },
  controller,
  template,
};
