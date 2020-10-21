import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallOvhRaid',
  controller,
  template,
  bindings: {
    model: '<',
    server: '<',
  },
};
