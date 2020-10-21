import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallOvhPartition',
  controller,
  template,
  bindings: {
    model: '<',
    server: '<',
  },
};
