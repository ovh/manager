import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    serviceName: '@',
    onGoBack: '&?',
    byoi: '<',
    onCancel: '&?',
    goToOsInstallChooseSource: '<',
  },
  controller,
  template,
};
