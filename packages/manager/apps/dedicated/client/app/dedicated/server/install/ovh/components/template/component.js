import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallOvhTemplate',
  controller,
  template,
  bindings: {
    compatibleTemplates: '<',
    model: '<',
    server: '<',
    templatesFamilies: '<',
  },
};
