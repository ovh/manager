import controller from './controller';
import template from './index.html';

export default {
  name: 'serverOsInstallImage',
  bindings: {
    server: '<',
    user: '<',
    // goDashboard: '<',
    imageTypeEnum: '<',
    checksumTypeEnum: '<',
    onGoBack: '&?',
  },
  controller,
  template,
};
