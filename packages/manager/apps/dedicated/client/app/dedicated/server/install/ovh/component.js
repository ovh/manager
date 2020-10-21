import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallOvh',
  bindings: {
    model: '<',
    server: '<',
    systemsFamilies: '<',
  },
  controller,
  template,
};
